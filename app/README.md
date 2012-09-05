# doc.silverstripe.org #

## Installation ##

See `sapphiredocs/README.md` for main setup instructions.

## Source Documentation Files

Source registration is documented in `sapphiredocs` module.
We keep sources in a `src/` subdirectory.
For this project the different sources are NOT included in version control,
because we need to check out from git and subversion (so svn:externals won't work in this case). All sources have to be checked out and updated manually. 
We use the `Makefile` for this, which exposes a new `make update` command.

In `mysite/_config.php`:

	DocumentationService::register("sapphire", BASE_PATH ."/src/github/master/sapphire/docs/", '2.4');

When registering a new module, you have to update the `Makefile` as well.

## Cronjob Setup ##

	05 * * * * sites make -f /sites/ss2doc-v2/www/Makefile -C /sites/ss2doc-v2/www update 

## Legacy Dokuwiki ##

We assume that DokuWiki (which ran the original doc.silverstripe.org)
is served on the same webserver from a different webroot, thats
symlinked in under the URL http://doc.silverstripe.org/old.

	ln -s /sites/ss2doc/www /sites/ss2doc-v2/www/old