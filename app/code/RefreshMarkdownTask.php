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
        $this->printLine("Refreshing markdown files...");
        $repositories = $this->getRepositories();
        foreach ($repositories as $repository) {
            $this->cloneRepository($repository);
        }
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
        exec("rm -rf {$path}/src/{$folder}_{$branch}");
        chdir("{$path}/src");

        // If the dev=1 flag is used when RefreshMarkdownTask is run, a full git clone of the framework repository is kept
        // to enable local development of framework and doc.silverstripe.org from within doc.silverstripe.org. Otherwise,
        // only a shallow clone of the framework repository is made and all non-markdown files deleted, only allowing viewing
        // of documentation files. Note: The --depth 1 option in the git clone command implies the option --single-branch

        if( $this->request->getVar('dev') ) {
            $this->printLine("Performing full clone of " . $remote . "/" . $branch);
            exec("git clone -q https://github.com/{$remote}.git {$folder}_{$branch} --branch {$branch}");
        } else {
            $this->printLine("Performing shallow clone of " . $remote . "/" . $branch);
            exec("git clone -q https://github.com/{$remote}.git {$folder}_{$branch} --branch {$branch} --depth 1");
            $this->printLine("Deleting non-documentation framework files from shallow clone of " . $remote . "/" . $branch);
            chdir("{$path}/src/{$folder}_{$branch}");
            $framework_paths = array_merge(glob("*"), glob(".*"));
            foreach ($framework_paths as $framework_path) {
                if ( $framework_path !== "docs" && $framework_path !=="." && $framework_path !==".." ) {
                    exec("rm -rf {$framework_path}");
                }
            }
        }

    }

}
