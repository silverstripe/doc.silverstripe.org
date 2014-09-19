<?php

global $project;
$project = 'app';

global $database;
$database = 'SS_ssdoc';

require_once('conf/ConfigureFromEnv.php');

if (defined('SS_DATABASE_NAME')) {
	$database = SS_DATABASE_NAME;
}

MySQLDatabase::set_connection_charset('utf8');

SSViewer::set_theme('docs');

if(Director::isDev() && @$_GET['db'] == "sqlite3") {
	global $databaseConfig;
	$databaseConfig['type'] = 'SQLite3Database';
}

DocumentationViewer::set_link_base('');
DocumentationViewer::$check_permission = false;

DocumentationService::set_automatic_registration(false);
DocumentationSearch::enable();

try {
	DocumentationService::register("framework", BASE_PATH ."/src/framework_master/docs/", 'trunk');
	DocumentationService::register("framework", BASE_PATH ."/src/framework_3.1/docs/", '3.1', false, true);
	DocumentationService::register("framework", BASE_PATH ."/src/framework_3.0/docs/", '3.0');
	DocumentationService::register("framework", BASE_PATH ."/src/framework_2.4/docs/", '2.4');
	DocumentationService::register("framework", BASE_PATH ."/src/framework_2.3/docs/", '2.3');
} catch(InvalidArgumentException $e) {
	
} // Silence if path is not found (for CI environment)

DocumentationViewer::set_edit_link(
	'framework',
	'https://github.com/silverstripe/framework/edit/%version%/docs/%lang%/%path%',
	array(
		'rewritetrunktomaster' => true
	)
);

if(Director::isLive()) {
	ControllerExtension::$google_analytics_code = 'UA-84547-8';
}

DocumentationSearch::set_meta_data(array(
	'ShortName' => 'SilverStripe Documentation',
	'Description' => 'Documentation for SilverStripe CMS / Framework',
	'Tags' => 'silverstripe sapphire php framework cms content management system'
));

DocumentationSearch::$boost_by_path = array(
	// Changelogs have heaps of phrases, but are rarely relevant for content searches
	'/^changelog/' => 0.05
);

// Set shared index (avoid issues with different temp paths between CLI and web users)
if(file_exists(BASE_PATH . '/.lucene-index')) {
	DocumentationSearch::set_index(BASE_PATH . '/.lucene-index');
}
