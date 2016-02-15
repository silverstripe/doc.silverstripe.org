# doc.silverstripe.org

This is the source code powering http://docs.silverstripe.org. It
primarily consists of the SilverStripe
[framework](https://github.com/silverstripe/silverstripe-framework)
and the [docsviewer](https://github.com/silverstripe/silverstripe-docsviewer)
module with minimal configuration.

For adding functionality or editing the style of the documentation see the 
[docsviewer](http://github.com/silverstripe/silverstripe-docsviewer) module.

## Development

To set up a test instance:

 * Clone this repository to a LAMP server.
 * Install [Composer](http://docs.silverstripe.org/en/getting_started/composer)
 * Install [sake](https://docs.silverstripe.org/en/developer_guides/cli/).
 * After installing composer run `composer install --prefer-source` to grab the modules.
 * Run the docs crontask in the browser `dev/tasks/UpdateDocsCronTask`
   to download all fresh markdown documentation files and reindex them. Note: this
   will take some time to run. Alternatively, you can use sake
   to perform these tasks by firstly running the command `sake
   dev/tasks/RefreshMarkdownTask flush=1` and secondly `sake
   dev/tasks/RebuildLuceneDocsIndex flush=1`.
 * Make sure to flush the cache for markdown content to show up.

## Source Documentation Files

Documentation for each module is stored on the filesystem via a full git clone
of the module to the `src/` subdirectory in this project. These checkouts are
ignored from this repository to allow for easier updating and to keep this
project small.

To update or download the source documentation at any time run the following
BuildTask command with sake:

	cd /Sites/doc.silverstripe.org/
	sake dev/tasks/RefreshMarkdownTask flush=1

This build task will download / update each module as listed in the
`app/_config/docs-repositories.yml` file. Running `sake
dev/tasks/RebuildLuceneDocsIndex flush=1` will then create a search
index and reindex the documentation to facilitate searching.

Once the build task has executed and downloaded the latest files,
those files are registered along with the module version the folder relates to
through the `app/_config/docsviewer.yml` file.

```yaml
DocumentationManifest:
  register_entities:
    -
      Path: "src/framework_3.2/docs/"
      Title: "Developer Documentation"
      Version: "3.2"
      Stable: true
      DefaultEntity: true
```

Set `Stable: true` on the set of documentation relating the current stable version of SilverStripe.


## Contribution

To contribute an improvement to the docs.silverstripe.org functionality or
theme, submit a pull request on GitHub. Any approved pull requests will make
their way onto the docs.silverstripe.org site in the next release.

The content for docs.silverstripe.org is stored in the modules
repository inside a "docs" folder (for example, the framework
documentation is stored at
[https://github.com/silverstripe/silverstripe-framework/tree/master/docs](https://github.com/silverstripe/silverstripe-framework/tree/master/docs).

If you wish to edit the documentation content, submit a pull request on that
Github project. Updates to the content are synced regularly with
docs.silverstripe.org via a cron job.

## Cron job

The cron job `UpdateDocsCronTask` includes tasks that fetch the latest documentation for each module from git and rebuilds the search indexes.

	public function getSchedule() {
        return "0 20 * * *"; // runs process() function every day at 8PM
	}

## Deployment

Deployment is via the SilverStripe Platform deployment tool and uses StackShare.
