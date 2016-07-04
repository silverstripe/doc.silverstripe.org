<?php

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
    protected $description = "Downloads a fresh version of markdown documentation files from source. Options are force=1, addonly=1, and branch=<branch>";

    /**
     * @var bool
     */
    protected $enabled = true;

    /**
     * @var SS_HTTPRequest $request
     *
     * @todo test the initial unlink works with cloned modules
     */
    public function run($request)
    {
		$this->request = $request;
		$repositories = $this->getRepositories();
		$baseDir = $this->getSourceRoot();
		$updater = $this->getUpdater();

		// Ensure root directory exists
		if(!$this->ensureRootDirectory($baseDir)) {
			return;
		}

		// Update each repo
        foreach ($repositories as list($repo, $folder, $branch)) {
			$path =  "{$baseDir}/{$folder}_{$branch}";

			// Pass in ?addonly=1 to only update new branches
			if($this->request && $this->request->getVar('addonly') && file_exists($path)) {
				$this->printLine("Skipping update of {$branch}: Already exists at {$path};");
				continue;
			}

			// Check if we want to update only a specific branch
			if($this->request && ($onlyBranch = $this->request->getVar('branch')) && $onlyBranch != $branch) {
				$this->printLine("Skipping update of {$branch}: doesn't match provided filter");
				continue;
			}

			// Pass in ?force=1 to force delete existing repos, rather than trying to update them
			if($this->request && $this->request->getVar('force') && file_exists($path)) {
				$this->printLine("Removing {$path}");
				Filesystem::removeFolder($path);
			}

			// Update this repo
			$this->printLine("Beginning update of {$branch}");
            $errors = $updater->update($repo, $path, $branch);

			// Handle result
			if(empty($errors)) {
				$this->printLine("Successful update of {$branch}");
			} else {
				foreach($errors as $error) {
					$this->error($error);
				}
			}
        }
        $this->printLine(" ");
        $this->printLine("To re-index the freshly downloaded documentation files either:");
        $this->printLine("(1) run the command 'sake dev/tasks/RebuildLuceneDocsIndex flush=1' in a shell or");
        $this->printLine("(2) point your browser at the url 'http://localhost/path/to/ssdocs/dev/tasks/RebuildLuceneDocsIndex?flush=1'");
    }

	/**
	 * Gets the service that will pull down remote markdown files
	 * @return MarkdownUpdater
	 */
	protected function getUpdater() {
		return Injector::inst()->get('MarkdownUpdater');
	}

    /**
	 * Get sources root directory
	 *
     * @return string
     */
    private function getSourceRoot()
    {
        return ASSETS_PATH . '/src';
    }

    /**
     * @param string $message
     */
    private function printLine($message)
    {
        $eol = Director::is_cli() ? PHP_EOL : "<br>";
        echo $message . $eol;
		if(ob_get_level() > 0) {
			ob_flush();
		}
		flush();


    }

	/**
	 * Log an error
	 *
	 * @param string $message
	 */
	protected function error($message)
	{
		$this->printLine($message);
		SS_Log::log($message, SS_Log::ERR);
	}

    /**
     * Returns the array of repos to source markdown docs from
     *
     * @return array
     */
    protected function getRepositories()
    {
        $repositories = $this->config()->documentation_repositories;
		if(empty($repositories)) {
			$this->error(
				"You need to set 'RefreshMarkdownTask:documentation_repositories' array in a yaml configuration file"
			);
		}
		return $repositories;
    }

	/**
	 * Ensure root directory exists
	 *
	 * @param string $path
	 * @return bool True if the directory exists and is writable
	 */
	protected function ensureRootDirectory($path) {
		Filesystem::makeFolder($path);
		if(is_dir($path) && is_writable($path)) {
			return true;
		}
		$this->error("Could not create {$path}");
		return false;
	}

}
