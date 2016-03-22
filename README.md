# doc.silverstripe.org

This repository contains the source code powering SilverStripe's developer documentation website https://docs.silverstripe.org.

The source code here consists primarily of the SilverStripe
[framework](https://github.com/silverstripe/silverstripe-framework)
and the [docsviewer](https://github.com/silverstripe/silverstripe-docsviewer)
module with minimal configuration.

**This repository does not contain the most current documentation files**.

The most current documentation files are not stored here but instead are
stored in each framework repository within a `docs` folder. For
example, the documentation for the master branch of the SilverStripe
framework is stored in
[https://github.com/silverstripe/silverstripe-framework/tree/master/docs](https://github.com/silverstripe/silverstripe-framework/tree/master/docs).
As described below in the Installation section, one must first obtain
and re-index fresh versions of the documentation files from the framework
repositories before being able to view the latest content.

For adding functionality or editing the style of the documentation, see the 
[docsviewer](https://github.com/silverstripe/silverstripe-docsviewer) module.

## Installation

To set up a local instance of `doc.silverstripe.org`:

* Install [Composer](https://docs.silverstripe.org/en/getting_started/composer).
* Install [sake](https://docs.silverstripe.org/en/developer_guides/cli).
* Clone this repository to a LAMP server. For example, the command
```
   git clone https://github.com/silverstripe/doc.silverstripe.org path/to/webroot/ssdocs
```
will clone this repository into `path/to/webroot/ssdocs`.
* From within `path/to/webroot/ssdocs`, run the command
```
   composer install --prefer-source
```
to grab the modules, in particular, the [docsviewer](http://github.com/silverstripe/silverstripe-docsviewer) module.
* From within `path/to/webroot/ssdocs`, run the command
```
sake dev/tasks/RefreshMarkdownTask flush=1
```
to get the latest documentation source markdown files. If you are interested in contributing, instead use the command
```
   sake dev/tasks/RefreshMarkdownTask flush=1 dev=1
```
to get the full git repositories.
* From within `path/to/webroot/ssdocs`, run the command
```
   sake dev/tasks/RebuildLuceneDocsIndex flush=1
```
to re-index the latest documentation source markdown files. Note: re-indexing will take some time.
* Make sure to flush the cache for markdown content to show up.

## Automation

Refreshing and re-indexing the documentation markdown files can be automated. From within `path/to/webroot/ssdocs`, run the command:
```
   sake dev/tasks/UpdateDocsCronTask
```
The cron job `UpdateDocsCronTask` runs the `RefreshMarkdownTask`
and `RebuildLuceneDocsIndex` tasks every day at 8PM. This can be
altered by editing `UpdateDocsCronTask.php` and changing the scheduling
function:
```
   public function getSchedule() {
      return "0 20 * * *"; // runs process() function every day at 8PM
   }
```

## Contribution

To contribute an improvement to the https://docs.silverstripe.org functionality or
theme, submit a pull request on GitHub. Any approved pull requests will make
their way onto the https://docs.silverstripe.org site in the next release.

If you wish to edit the documentation content, submit a pull request on that
Github project. Updated documentation content is regularly uploaded to https://docs.silverstripe.org via a cron job.

If you are adding a new version of the documentation, you must
register it in both `app/_config/docs-repositories.yml` and
`app/_config/docsviewer.yml`. To set one particular version to be the
current stable version, set `Stable: true` in
`app/_config/docsviewer.yml`. Remove the `Stable: true` setting for
all versions that are not stable.

## Deployment

Deployment is via the SilverStripe Platform deployment tool and uses StackShare.
