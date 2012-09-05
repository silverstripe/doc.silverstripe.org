# Introduction

SSorgsites is the base library styles developed for the range of ssorgsites to share. 

 * open.silverstripe.org
 * api.silverstripe.org
 * docs.silverstripe.org
 * wiki.silverstripe.org
 * userhelp.silverstripe.org

## Usage

 * Add this module as an external to themes/ssorgsites.
 * Link to the CSS from the ss template using using
	
	<% require css(themes/ssorgsites/css/ss.screen.min.css, screen) %>
	<% require css(themes/ssorgsites/css/ss.print.min.css, print) %>
	
## Generating ss.*.min files

This minimal clone of the ssorgsites theme doesn't have the ability to regenerate the minified files.
