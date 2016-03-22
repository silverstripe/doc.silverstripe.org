<?php

class UpdateDocsCronTask implements CronTask 
{
    /**
     * @var SS_HTTPRequest $request The request object the controller was called with.
    */
    protected $request = null;

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

        $this->request = Controller::curr()->getRequest();
	
        //refresh markdown files
        $refresh_task = new RefreshMarkdownTask();
        $refresh_task->run($this->request);
	
        //reindex markdown files
        $reindex_task = new RebuildLuceneDocsIndex();
        $reindex_task->run($this->request);
	
    }
}
