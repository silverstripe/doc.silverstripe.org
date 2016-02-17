<?php

class RefreshMarkdownTask extends BuildTask
{
    /**
     * @var array
     * @config documentation_repositories
     */
    private static $documentation_repositories;

    /**
     * @var string
     */
    protected $title = "Refresh markdown files";

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
        $this->printLine("refreshing markdown files...");

        $repositories = $this->getRepositories();

        foreach ($repositories as $repository) {
            $this->cloneRepository($repository);
            $this->cleanRepository($repository);
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
     *
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
     * @param array $repository
     *
     * @todo test this works with all modules
     */
    private function cloneRepository(array $repository)
    {
        list($remote, $folder, $branch) = $repository;

        $path = $this->getPath();

        exec("mkdir -p {$path}/src");
        exec("rm -rf {$path}/src/{$folder}_{$branch}");

        $this->printLine("cloning " . $remote . "/" . $branch);

        chdir("{$path}/src");
        exec("git clone -q https://github.com/{$remote}.git {$folder}_{$branch} --branch {$branch} --single-branch");

        chdir("{$path}/src/{$folder}_{$branch}");
    }

    /**
     * Clears out any non markdown files stored in assets
     *
     * @param array $repository
     */
    private function cleanRepository(array $repository)
    {
	
	// if the dev=1 flag is used when invoking RefreshMarkdownTask the git repos are kept.
	if( isset($_REQUEST['dev']) && $_REQUEST['dev'] ) return;

        $paths = array_merge(glob("*"), glob(".*"));

        foreach ($paths as $path) {
            if ($path !== "docs" && $path !== "." && $path !== "..") {
                exec("rm -rf {$path}");
            }
        }
    }
}
