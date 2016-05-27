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
    protected $description = "Downloads a fresh version of markdown documentation files from source";

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
        foreach ($repositories as $repository) {
            $this->cloneRepository($repository);
        }
        $this->printLine(" ");
        $this->printLine("To re-index the freshly downloaded documentation files either:");
        $this->printLine("(1) run the command 'sake dev/tasks/RebuildLuceneDocsIndex flush=1' in a shell or");
        $this->printLine("(2) point your browser at the url 'http://localhost/path/to/ssdocs/dev/tasks/RebuildLuceneDocsIndex?flush=1'");
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
        if($repos = $this->config()->documentation_repositories)
        {
            return $repos;
        } else {
            user_error("You need to set 'RefreshMarkdownTask:documentation_repositories' array in a yaml configuration file", E_USER_WARNING);
            return null;
        }
    }

    /**
     * Clone $repository which contains the most current documentation source markdown files
     *
     * @param array $repository
     */
    private function cloneRepository(array $repository)
    {

        list($remote, $folder, $branch) = $repository;

        $path = $this->getPath();

        exec("mkdir -p {$path}/src");
        exec("chmod -R 775 {$path}/src" );
        exec("rm -rf {$path}/src/{$folder}_{$branch}");
        chdir("{$path}/src");

        // If the dev=1 flag is used when RefreshMarkdownTask is run, a full git clone of the framework repository is kept
        // to enable local development of framework and doc.silverstripe.org from within doc.silverstripe.org. Otherwise,
        // only the documentation source files are downloaded, only allowing the viewing of documentation files. 

        if ($this->request instanceof SS_HTTPRequest && $this->request->getVar('dev')) {
            $this->printLine("Cloning repository {$remote}/{$branch} into assets/src/{$folder}_{$branch}");
            exec("git clone --quiet https://github.com/{$remote}.git {$folder}_{$branch} --branch {$branch}");
        } else {
            $this->printLine("Downloading the latest documentation files from repository {$remote}/{$branch} to assets/src/{$folder}_{$branch}");
            exec("svn export --quiet https://github.com/{$remote}.git/branches/{$branch}/docs {$folder}_{$branch}/docs");
        }

    }

}
