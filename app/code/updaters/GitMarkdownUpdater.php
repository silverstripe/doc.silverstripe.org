<?php

class GitMarkdownUpdater implements MarkdownUpdater
{

	public function update($repo, $path, $branch)
	{
		// Ensure git is available
		$errors = array();
		if (!$this->runCommand('git --version', $errors)) {
			return $errors;
		}

		// Check if we should do a git update or re-clone
		if (is_dir($path . '/.git')) {
			return $this->doFetch($path, $branch);
		} else {
			return $this->doClone($repo, $path, $branch);
		}
	}

	/**
	 * Update existing git checkouts
	 *
	 * @param string $path
	 * @param string $branch
	 * @return array List of errors
	 */
	protected function doFetch($path, $branch) {
		$errors = array();
		$fetchCommand = sprintf(
			'cd %s && git fetch origin %s',
			escapeshellarg($path),
			escapeshellarg($branch)
		);
		$resetCommand = sprintf(
			'cd %s && git reset --hard origin/%s',
			escapeshellarg($path),
			escapeshellarg($branch)
		);

		// Run
		if($this->runCommand($fetchCommand, $errors)) {
			$this->runCommand($resetCommand, $errors);
		}
		return $errors;
    }

	/**
	 * Clone a new git repo
	 * @param string $repo Repo slug
	 * @param string $path Destination path
	 * @param string $branch Branch name
	 * @return array
	 */
	protected function doClone($repo, $path, $branch) {
		$errors = array();
		$remote = "https://github.com/{$repo}.git";
        $this->runCommand(sprintf(
			"git clone --quiet %s %s --branch %s",
			escapeshellarg($remote),
			escapeshellarg($path),
			escapeshellarg($branch)
		), $errors);
		return $errors;
	}

	/**
	 * Run this command
	 *
	 * @param string $cmd
	 * @param array $errors
	 * @return bool Flag if the command was successful
	 */
	protected function runCommand($cmd, &$errors = array()) {
		exec("{$cmd} 2>&1 >/dev/null", $output, $result);
		if($result) {
			$errors[] = "Error running command {$cmd}:";
			foreach($output as $error) {
				$errors[] = ' * ' . $error;
			}
			return false;
		}
		return true;
	}
}
