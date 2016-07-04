<?php

class SVNMarkdownUpdater implements MarkdownUpdater
{
	public function update($repo, $path, $branch)
	{
		$errors = array();
		$svnPath = "https://github.com/{$repo}.git/branches/{$branch}/docs";
		$svnDest = "{$path}/docs";
		$this->runCommand(sprintf(
			"svn export %s %s",
			escapeshellarg($svnPath),
			escapeshellarg($svnDest)
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
		exec($cmd, $output, $result);
		if($result) {
			$errors[] = "Error running command {$cmd}";
			return false;
		}
		return true;
	}
}
