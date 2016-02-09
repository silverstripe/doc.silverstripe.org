<?php

class DocsCronTask implements CronTask {
	/**
	 * 
	 * @return string
	 */
	public function getSchedule() {
		return "0 20 * * *";
	}

	/**
	 * 
	 * @return BuildTask
	 */
	public function process() {

		//rebuild the docs
		$docstask = new UpdateTask();
		$docstask->run(null);

		//reindex the search
		$searchtask = new RebuildLuceneDocsIndex();
		$searchtask->run(null);

	}
}