<?php

class UpdateDocsCronTask implements CronTask 
{
    /**
     * @return string
     */
    public function getSchedule() 
    {
	return "0 20 * * *";
    }
    
    /**
     * @return BuildTask
     */
    public function process() 
    {
	
        //refresh markdown files
        $refresh_task = new RefreshMarkdownTask();
        $refresh_task->run(null);
	
        //reindex markdown files
        $reindex_task = new RebuildLuceneDocsIndex();
        $reindex_task->run(null);
	
    }
}
