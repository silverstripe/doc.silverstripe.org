<?php

global $project;
$project = 'mysite';

global $database;
$database = 'SS_ssnewdocstest';

require_once('conf/ConfigureFromEnv.php');

MySQLDatabase::set_connection_charset('utf8');

// This line set's the current theme. More themes can be
// downloaded from http://www.silverstripe.org/themes/
SSViewer::set_theme('docs');

// enable nested URLs for this site (e.g. page/sub-page/)
SiteTree::enable_nested_urls();

// render the user documentation first
Director::addRules(20, array(
	'Security//$Action/$ID/$OtherID' => 'Security',
));
DocumentationViewer::set_link_base('');
DocumentationViewer::$check_permission = false;

// Hacky, but does the job. Without checking for this,
// all tests relying on standard URL routing will fail (e.g. ContentControllerTest)
$isRunningTest = (
	(isset($_SERVER['argv'][1]) && strpos($_SERVER['argv'][1], 'dev/tests') !== FALSE)
	|| (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'dev/tests') !== FALSE)
);
if(!$isRunningTest) {
	Director::addRules(10, array(
		'$Action' => 'DocumentationViewer',
		'' => '->current/en/cms'
	));
}

DocumentationService::set_automatic_registration(false);
try{
	DocumentationService::register("cms", realpath("../src/github/master/cms/docs/"), '2.4');
} catch(InvalidArgumentException $e) {} // Silence if path is not found (for CI environment)


// We want this to be reviewed by the whole community
BasicAuth::protect_entire_site(false);
