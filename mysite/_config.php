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

if(@$_GET['db'] == "sqlite3") {
	global $databaseConfig;
	$databaseConfig['type'] = 'SQLite3Database';
}

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
		'' => '->framework/en/'
	));
}

DocumentationService::set_automatic_registration(false);
DocumentationSearch::enable();

try{	
	DocumentationService::register("framework", BASE_PATH ."/src/framework_master/docs/", 'trunk');
	DocumentationService::register("sapphire", BASE_PATH ."/src/sapphire_3.0/docs/", '3.0');
	DocumentationService::register("sapphire", BASE_PATH ."/src/sapphire_2.4/docs/", '2.4');
	DocumentationService::register("sapphire", BASE_PATH ."/src/sapphire_2.3/docs/", '2.3');
} catch(InvalidArgumentException $e) {
} // Silence if path is not found (for CI environment)


// We want this to be reviewed by the whole community
BasicAuth::protect_entire_site(false);

Object::add_extension('DocumentationViewer', 'DocumentationViewerExtension');
if(Director::isLive()) {
	DocumentationViewerExtension::$google_analytics_code = 'UA-84547-8';
}

Validator::set_javascript_validation_handler('none');	

DocumentationSearch::set_meta_data(array(
	'ShortName' => 'SilverStripe Documentation',
	'Description' => 'Documentation for SilverStripe CMS / Framework',
	'Tags' => 'silverstripe sapphire php framework cms content management system'
));

DocumentationSearch::$boost_by_path = array(
	// Changelogs have heaps of phrases, but are rarely relevant for content searches
	'/^changelog/' => 0.05
);
