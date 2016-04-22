# doc.silverstripe.org

This repository contains the source code powering [SilverStripe's
developer documentation website](https://docs.silverstripe.org).

The source code here primarily consists of the SilverStripe
[framework](https://github.com/silverstripe/silverstripe-framework)
and the [docsviewer](https://github.com/silverstripe/silverstripe-docsviewer)
modules with minimal configuration.

**This repository does NOT contain the most current documentation.**

The documentation files are written in the
[markdown](https://docs.silverstripe.org/en/2.4/misc/ss-markdown/)
format and the most current versions of these files and are not stored
here. Instead, they are stored in a `docs` folder alongside the
framework source code in each framework repository. For example, the
documentation markdown files for the master branch of the SilverStripe framework are
stored in
[https://github.com/silverstripe/silverstripe-framework/tree/master/docs](https://github.com/silverstripe/silverstripe-framework/tree/master/docs).
As described below in the **Installation** section, one must first
download the latest versions of the documentation markdown files from
the framework repositories and re-index them before being able to view
the most current content.

For adding functionality or editing the style of the documentation, see the 
[docsviewer](https://github.com/silverstripe/silverstripe-docsviewer) module.

## Installation

To set up a local instance of [doc.silverstripe.org](https://github.com/SpiritLevel/doc.silverstripe.org):

* Install [Composer](https://docs.silverstripe.org/en/getting_started/composer).
* Install [sake](https://docs.silverstripe.org/en/developer_guides/cli).
* Clone this repository to a LAMP server. For example, the shell command
```
   git clone https://github.com/silverstripe/doc.silverstripe.org path/to/ssdocs
```
will clone this repository into `path/to/ssdocs`.
* From within `path/to/ssdocs`, run the command
```
   composer install --prefer-source
```
to install all required modules, in particular, the [docsviewer](http://github.com/silverstripe/silverstripe-docsviewer) module.
* If you are only interested in being able to view the documentation locally then, from within `path/to/ssdocs`, run the command
```
sake dev/tasks/RefreshMarkdownTask flush=1
```
to get the latest documentation markdown files.

If you are interested in contributing, you must first install [subversion](https://subversion.apache.org/). For example,
in [Ubuntu](http://www.ubuntu.com/) or [Debian](https://www.debian.org/), `sudo apt-get install subversion` will install subversion. Then run the command
```
   sake dev/tasks/RefreshMarkdownTask flush=1 dev=1
```
to get the full git repositories.
* From within `path/to/ssdocs`, run the command
```
   sake dev/tasks/RebuildLuceneDocsIndex flush=1
```
to re-index the latest documentation markdown files. Note: re-indexing will take some time.
* Make sure to flush the cache for markdown content to show up.

Rather than using [sake](https://docs.silverstripe.org/en/developer_guides/cli), one can instead run the two tasks directly in the
browser. To get the documentation markdown files, use the url:
```
http://localhost/path/to/ssdocs/dev/tasks/RefreshMarkdownTask?flush=1
```
To get the full git repositories use the url
```
http://localhost/path/to/ssdocs/dev/tasks/RefreshMarkdownTask?flush=1&dev=1
```
To re-index the documentation files use the url:
```
http://localhost/path/to/ssdocs/dev/tasks/RebuildLuceneDocsIndex?flush=1
```

## Automation

Refreshing and re-indexing the documentation markdown files can be automated. From within `path/to/webroot/ssdocs`, run the command:
```
   sake dev/tasks/UpdateDocsCronTask
```
The cron job `UpdateDocsCronTask` runs the `RefreshMarkdownTask`
and `RebuildLuceneDocsIndex` tasks every day at 8PM. This execution schedule can be
altered by editing `UpdateDocsCronTask.php`, found in the `apps/code` folder, and changing the scheduling
function:
```
   public function getSchedule() {
      return "0 20 * * *"; // runs process() function every day at 8PM
   }
```

Rather than using `sake`, one can instead run the cron task directly in the browser using the url:
```
http://localhost/path/to/ssdocs/dev/cron/UpdateDocsCronTask?flush=1
```


## Contribution

To contribute an improvement to the https://docs.silverstripe.org functionality or
theme, submit a pull request on the [GitHub project](https://github.com/silverstripe/doc.silverstripe.org). Any approved pull requests will make
their way onto the https://docs.silverstripe.org site in the next release.

If you wish to edit the documentation content, submit a pull request
on the
[framework Github project](https://github.com/silverstripe/silverstripe-framework). Updated
documentation content is uploaded daily at 8PM to [doc.silverstripe.org](https://docs.silverstripe.org) via a cron job. See the **Automation** section.

If you are adding a new version of the documentation, you must
register it in both `app/_config/docs-repositories.yml` and
`app/_config/docsviewer.yml`. To set one particular version to be
current stable version, set `Stable: true` in
`app/_config/docsviewer.yml`. Remove the `Stable: true` for all
versions that are not stable.

## Deployment

Deployment is via the [SilverStripe Platform](https://www.silverstripe.com/platform/) deployment tool and uses [StackShare](http://www.silverstripe.com/platform/technical/).
