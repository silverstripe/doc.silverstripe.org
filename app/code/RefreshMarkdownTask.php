<?php

/**
 * This task will download sources defined in the $documentation_repositories and put them into the
 * a folder where the markdown parser and indexer can work on them.
 *
 * Note that this downloader requires the repositories because it relies on their tarball download
 * functionality. So this is pretty much hardcoded.
 *
 * The tarball downloader runs all the repos in parallel to save time and will not remove the current
 * source until the new downloaded code can replace the old code.
 *
 * For local development you can use dev=1 to instead clone the repositories if you would like to
 * work on the documentation locally instead.
 *
 */
class RefreshMarkdownTask extends BuildTask
{

	/**
	 * @var array
	 * @config documentation_repositories
	 */
	private static $documentation_repositories;

	/**
	 * @var SS_HTTPRequest $request The request object the controller was called with.
	 */
	protected $request = null;

	/**
	 * @var string
	 */
	protected $title = "RefreshMarkdownTask";

	/**
	 * @var string
	 */
	protected $description = "Downloads a fresh version of markdown documentation files from source";

	/**
	 * @var bool
	 */
	protected $enabled = true;

	/**
	 * @var SS_HTTPRequest $request
	 *
	 */
	public function run($request)
	{
		$this->request = $request;
		$repositories = $this->getRepositories();

		if ($this->request && $this->request->getVar('dev')) {
			$this->cloneRepositories($repositories);
		} else {
			$this->downloadArchives($repositories);
		}
		$this->printLine(" ");
		$this->printLine("To re-index the freshly downloaded documentation files either:");
		$this->printLine("(1) run the command 'sake dev/tasks/RebuildLuceneDocsIndex flush=1' in a shell or");
		$this->printLine("(2) point your browser at the url 'http://localhost/path/to/ssdocs/dev/tasks/RebuildLuceneDocsIndex?flush=1'");
	}

	protected function cloneRepositories(array $repositories)
	{
		foreach ($repositories as $repository) {
			list($remote, $folder, $branch) = $repository;
			$path = $this->getPath();
			exec("mkdir -p {$path}/src");
			exec("chmod -R 775 {$path}/src");
			exec("rm -rf {$path}/src/{$folder}_{$branch}");
			chdir("{$path}/src");
			$this->printLine("Cloning repository {$remote}/{$branch} into assets/src/{$folder}_{$branch}");
			exec("git clone --quiet https://github.com/{$remote}.git {$folder}_{$branch} --branch {$branch}");
		}
	}

	/**
	 * Clone $repository which contains the most current documentation source markdown files
	 *
	 * @param array $repositories
	 *
	 */
	protected function downloadArchives(array $repositories)
	{
		$chs = [];
		$repoInformation = [];
		$cmh = curl_multi_init();

		$fileHandles = [];

		foreach ($repositories as $idx => $repository) {
			list($remote, $folder, $branch) = $repository;
			$source = "https://codeload.github.com/$remote/tar.gz/$branch";
			$tarFile = "$branch.tar.gz";
			$filePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $tarFile;
			$fileHandle = fopen($filePath, 'w+');
			$fileHandles[] = $fileHandle;
			$chs[$idx] = $this->getCurlOptions($source, $fileHandle);
			$repoInformation[$source] = [
				'remote' => $remote,
				'branch' => $branch,
				'folder' => $folder,
				'filepath' => $filePath,
				'status' => null,
			];
			curl_multi_add_handle($cmh, $chs[$idx]);
		}

		printf("Downloading %d repositories in parallel\n", count($repositories));

		$repoInformation = $this->waitForDownload($cmh, $repoInformation);

		foreach ($repositories as $idx => $repository) {
			curl_multi_remove_handle($cmh, $chs[$idx]);

			curl_close($chs[$idx]);
		}
		curl_multi_close($cmh);

		foreach($fileHandles as $handle) {
			fclose($handle);
		}

		$path = $this->getPath();
		exec("mkdir -p {$path}/src");
		exec("chmod -R 775 {$path}/src");

		foreach ($repoInformation as $info) {
			if ($info['status'] != 200) {
				printf("download failed with status %d, skipping\n", $info['status']);
				continue;
			}
			if (!$this->checkTarIntegrity($info)) {
				echo "not a valid tar, skipping" . PHP_EOL;
				continue;
			}
			if (!$this->uncompressTar($info)) {
				echo "failed uncompressing tar, skipping" . PHP_EOL;
				continue;
			}
			if (!$this->removeOldSource($path, $info)) {
				echo "failed removing old source, skipping" . PHP_EOL;
				continue;
			}
			if (!$this->moveSource($info, $path)) {
				echo "failed moving new code into {$path}, skipping" . PHP_EOL;
				continue;
			}
		}
	}

	/**
	 * @param resource $cmh - curl multi resource
	 * @param array $repoInformation
	 *
	 * @return array
	 */
	protected function waitForDownload($cmh, $repoInformation)
	{
		$active = false;
		do {
			$status = curl_multi_exec($cmh, $active);
			$info = curl_multi_info_read($cmh);
			if (false !== $info) {
				$info = curl_getinfo($info['handle']);
				printf("%d %s %.0f sec %d bytes\n", $info['http_code'], $info['url'], $info['total_time'],
					$info['size_download']);
				$repoInformation[$info['url']]['status'] = $info['http_code'];
			}
		} while ($status === CURLM_CALL_MULTI_PERFORM || $active);
		return $repoInformation;
	}

	/**
	 * @param string $source
	 * @param resource $fileHandle
	 *
	 * @return resource
	 */
	protected function getCurlOptions($source, $fileHandle)
	{
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $source);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_TIMEOUT, 300);
		curl_setopt($curl, CURLOPT_FILE, $fileHandle);
		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
		return $curl;
	}

	/**
	 * @return string
	 *
	 * @todo document this new configuration parameter
	 */
	private function getPath()
	{
		return ASSETS_PATH;
	}

	/**
	 * @param string $message
	 */
	private function printLine($message)
	{
		$this->eol = Director::is_cli() ? PHP_EOL : "<br>";
		print $message . $this->eol;
		flush();
	}

	/**
	 * Returns the array of repos to source markdown docs from
	 *
	 * @return array
	 */
	private function getRepositories()
	{
		if ($repos = $this->config()->documentation_repositories) {
			return $repos;
		} else {
			user_error("You need to set 'RefreshMarkdownTask:documentation_repositories' array in a yaml configuration file",
				E_USER_WARNING);
			return null;
		}
	}

	/**
	 * @param string $info
	 *
	 * @return bool
	 */
	private function checkTarIntegrity($info)
	{
		$tarCheck = sprintf("tar tf %s", $info['filepath']);
		echo $tarCheck . PHP_EOL;
		exec($tarCheck, $output, $status);
		if ($status != 0) {

			$fileDelete = sprintf("rm -rf %s", $info['filepath']);
			echo $fileDelete . PHP_EOL;
			exec($fileDelete, $output, $status);
			return false;
		}
		return true;
	}

	/**
	 * @param array $info
	 *
	 * @return bool
	 */
	private function uncompressTar($info)
	{
		$unpack = sprintf("tar xzf %s --directory %s", $info['filepath'], dirname($info['filepath']));
		echo $unpack . PHP_EOL;
		exec($unpack, $output, $status);
		if ($status != 0) {
			$fileDelete = sprintf("rm -rf %s", $info['filepath']);
			echo $fileDelete . PHP_EOL;
			exec($fileDelete, $output, $status);
			return false;
		}
		return true;
	}

	/**
	 * @param string $path
	 * @param array $info
	 *
	 * @return bool
	 */
	private function removeOldSource($path, $info)
	{
		$oldSourceCleanup = sprintf("rm -rf %s/src/%s_%s", $path, $info['folder'], $info['branch']);
		echo $oldSourceCleanup . PHP_EOL;
		exec($oldSourceCleanup, $output, $status);
		if ($status != 0) {
			return false;
		}
		return true;
	}

	/**
	 * @param array $info
	 * @param string $path
	 *
	 * @return bool
	 */
	private function moveSource($info, $path)
	{
		list(, $repo) = explode('/', $info['remote']);

		$source = sprintf("%s/%s-%s", dirname($info['filepath']), preg_replace("/[^A-Za-z0-9 ]/", '-', $repo),
			$info['branch']);
		$destination = sprintf("%s/src/%s_%s", $path, $info['folder'], $info['branch']);
		$moveCommand = sprintf("mv %s %s", $source, $destination);
		echo $moveCommand . PHP_EOL;
		exec($moveCommand, $output, $status);
		if ($status != 0) {
			return false;
		}
		return true;
	}
}
