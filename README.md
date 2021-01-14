[![Netlify Status](https://api.netlify.com/api/v1/badges/98ac537e-14f6-4864-bf56-d5a60c76ccc9/deploy-status)](https://app.netlify.com/sites/ss-docs/deploys)

# doc.silverstripe.org

This repository contains the source code powering [the Silverstripe CMS
developer documentation website](https://docs.silverstripe.org) and
[userhelp website](https://userhelp.silverstripe.org).

This application is build on [Gatsby](https://gatsbyjs.com), a static
site generator based on [React](https://reactjs.org). It sources content
from the [framework](https://github.com/silverstripe/silverstripe-framework)
repository for each major release.

**This repository does NOT contain any documentation.**

The developer documentation is stored in the framework module
repository, in the `docs` folder. For example, the documentation for the
master branch of Silverstripe CMS is stored in
[https://github.com/silverstripe/silverstripe-framework/tree/master/docs](https://github.com/silverstripe/silverstripe-framework/tree/master/docs).

The userhelp documentation is stored in the [userhelp-content repo](https://github.com/silverstripe/silverstripe-userhelp-content/).

## Installation

To set up a local instance of [doc.silverstripe.org](https://github.com/silverstripe/doc.silverstripe.org):

* Clone this repository to an empty directory
```
   git clone https://github.com/silverstripe/doc.silverstripe.org path/to/ssdocs
```

### Docker install

No local NodeJS nor gatsby-cli is required for this option.

 * Make sure docker and docker-compose are installed and docker daemon is running
 * Simply use `./docker/run` to run yarn commands within container
     - `./docker/run dev-docs` would be equal to run `yarn dev-docs` within a container
     - `./docker/run build-docs` would run `yarn build-docs` within a container

### Native install

* Install [Gatsby CLI](https://gatsbyjs.com)

## Developing

Once cloned, from the root of the repository, run the command `yarn dev-docs`
to instantiate a development server. This will consume all of the markdown files in both major release
branches and allow you to browse the developer documentation site on `http://localhost:8000` by default
(see the [Gatsby docs](https://www.gatsbyjs.org/docs/) for instructions on customising the port).

## Building

To test a static build of the site, first create a production environment file.

```
cp .env.development .env.production
```

Then, run the build.

```
yarn build-docs
yarn serve
```

These commands will give you an exact representation of how the site will run on a production server, with
statically generated html files and server-side rendering.

## Toggling between docs and userhelp

Whether the application uses the `docs.silverstripe.org` content or `userhelp.silverstripe.org` is determined
by the environment variable, `DOCS_CONTEXT`. You can set this in the `.env.development` file, or use one of
the script shortcuts:

```
yarn dev-docs
yarn dev-user
yarn build-docs
yarn build-user
```

## Authoring

You can make changes directly to the source markdown files and get live updates in the development
server without having to rebuild the app or even refresh the browser. The clones of the `silverstripe/framework`
repositories are in the `.cache/gatsby-source-git` folder in the root of this project. There are subfolders
for `3/` and `4/`, respective to their branch names. You can edit the files in `docs/en` from there.

Just don't forget to merge your changes upstream once you're done. Building the gatsby app will not preserve
your content changes, since the remote repositories are the source of truth.

## Deploying content changes

Once your contribution has been merged into the master branch, it will be deployed to production via a
Github action in the repository that holds the markdown files (e.g. `silverstripe/silverstripe-framework` for docs).

## Deploying app changes

Once your change is merged in to the `master` branch of this repository, it will be deployed to production.

## Contribution

To contribute an improvement to the https://docs.silverstripe.org or https://userhelp.silverstripe.org functionality or
theme, submit a pull request on the [GitHub project](https://github.com/silverstripe/doc.silverstripe.org). Any approved pull requests will make
their way onto the https://docs.silverstripe.org or https://userhelp.silverstripe.org sites in the next release.

If you wish to edit the documentation content, submit a pull request
on the
[framework Github project](https://github.com/silverstripe/silverstripe-framework) or the
[userhelp documentation](https://github.com/silverstripe/silverstripe-userhelp-content) repository
or corresponding module.