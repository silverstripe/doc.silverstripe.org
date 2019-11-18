# doc.silverstripe.org

This repository contains the source code powering [SilverStripe's
developer documentation website](https://docs.silverstripe.org).

This application is build on [Gatsby](https://gatsbyjs.com), a static
site generator based on [React](https://reactjs.org). It sources content
from the [framework](https://github.com/silverstripe/silverstripe-framework)
repository for each major release.

**This repository does NOT contain the most current documentation.**

The documentation files are written in the
[markdown](https://docs.silverstripe.org/en/2.4/misc/ss-markdown/)
format and the most current versions of these files and are not stored
here. Instead, they are stored in a `docs` folder alongside the
framework source code in each framework repository. For example, the
documentation markdown files for the master branch of the SilverStripe framework are
stored in
[https://github.com/silverstripe/silverstripe-framework/tree/master/docs](https://github.com/silverstripe/silverstripe-framework/tree/master/docs).

## Installation

To set up a local instance of [doc.silverstripe.org](https://github.com/silverstripe/doc.silverstripe.org):

* Install [Gatsby CLI](https://gatsbyjs.com)
* Clone this repository to an empty directory
```
   git clone https://github.com/silverstripe/doc.silverstripe.org path/to/ssdocs
```
will clone this repository into `path/to/ssdocs`.
* From within `path/to/ssdocs`, run the command
```
gatsby develop
```
to instantiate a development server. This will consume all of the markdown files in both major release
branches and allow you to browse the documentation site on `http://localhost:8000` by default 
(see the [Gatsby docs](https://www.gatsbyjs.org/docs/) for instructions on customising the port).

## Building

To test a static build of the site
```
gatsby build
gatsby serve
```

These commands will give you an exact representation of how the site will run on a production server, with
statically generated html files and server-side rendering.

## Deploying

Once your contribution has been merged into the master branch, you can run a build hook to trigger
a new build in Netlify.

```
(build hook coming soon)
```

## Contribution

To contribute an improvement to the https://docs.silverstripe.org functionality or
theme, submit a pull request on the [GitHub project](https://github.com/silverstripe/doc.silverstripe.org). Any approved pull requests will make
their way onto the https://docs.silverstripe.org site in the next release.

If you wish to edit the documentation content, submit a pull request
on the
[framework Github project](https://github.com/silverstripe/silverstripe-framework). Updated
documentation content is uploaded daily to [doc.silverstripe.org](https://docs.silverstripe.org) via a build hook.