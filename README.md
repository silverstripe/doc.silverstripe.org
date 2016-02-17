# doc.silverstripe.org

This is the source code powering http://docs.silverstripe.org and primarily consists of the SilverStripe
[framework](https://github.com/silverstripe/silverstripe-framework)
and the [docsviewer](https://github.com/silverstripe/silverstripe-docsviewer)
module with minimal configuration.

For adding functionality or editing the style of the documentation see the 
[docsviewer](http://github.com/silverstripe/silverstripe-docsviewer) module.

## Source Documentation Files

The source documentation markdown files are stored and maintained in the
[framework repository](https://github.com/silverstripe/silverstripe-framework/),
 within the `docs` directory. In order for `doc.silverstripe.org` to
render the most current versions of these source markdown files for
viewing, the files must first be downloaded and reindexed (see the Installation section below).

## Installing and Contributing

Follow these instruction to set up a local test instance of
`doc.silverstripe.org` for offline viewing and/or contributing. 

1. Clone this repository to a LAMP server. For example, the command

```	
	git clone https://github.com/silverstripe/doc.silverstripe.org path/to/webroot/ssdocs
```

will create a repository named `ssdocs` within `path/to/webroot/.

1. Install [Composer](http://docs.silverstripe.org/en/getting_started/composer).
1. Install required modules with the commands:
```	
	cd path/to/webroot/ssdocs
    composer install --prefer-source
```	
1. Install [sake](https://docs.silverstripe.org/en/developer_guides/cli/).
1. Refresh the markdown documentation files with the commands:

```	
	cd path/to/webroot/ssdocs
	sake dev/tasks/RefreshMarkdownTask flush=1
```	
Note: if you are contributing you need to also add a 'dev' flag to
keep the git repositories. So, use the following command instead:

```	
	sake dev/tasks/RefreshMarkdownTask flush=1 dev=1
```	
1. Reindex the markdown documentation files with the commands:
```	
	cd path/to/webroot/ssdocs
	sake dev/tasks/RebuildLuceneDocsIndex flush=1
```	
Note: rebuilding the indexes will take some time to complete.
1. After completing the above Installation instructions, you can edit
   the documentation markdown files, which are stored in
   `path/to/webroot/doc.silverstripe.org/assets/src/framework_*`, one
   for each version branch of the framework. After editing these
   files, your changes must be pushed to the appropriate branch of the
   [framework repository](https://github.com/silverstripe/silverstripe-framework/).
   A cron job `UpdateDocsCronTask` runs `RefreshMarkdownTask` and
   `RebuildLuceneDocsIndex` on the SilverStripe docs server at 8PM
   each day so after your changes have been reviewed and merged into
   the codebase, they will appear live on
   https://docs.silverstripe.org after the cron job has completed.

## Maintenance and Deployment

Deployment on the SilverStripe docs server is via the SilverStripe
Platform deployment tool and uses StackShare.

In order to add a new version or update which version is stable, update 
the `app/_config/docsviewer.yml` file:

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

Set `Stable: true` on the set of documentation relating the current
stable version of SilverStripe.

Also, update the `app/_config/docs-repositories.yml` file if needed:

```yaml
RefreshMarkdownTask:
  documentation_repositories:
    -
      - silverstripe/silverstripe-framework
      - framework
      - "3.2"
```
