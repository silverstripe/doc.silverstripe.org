<?php

interface MarkdownUpdater {

	/**
	 * @param string $repo
	 * @param string $path
	 * @param string $branch
	 * @return array List of any errors that occurred
	 */
	public function update($repo, $path, $branch);
}
