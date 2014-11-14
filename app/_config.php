<?php

global $project;
$project = 'app';

global $database;
$database = 'SS_ssdoc';

if (defined('SS_DATABASE_NAME')) {
	$database = SS_DATABASE_NAME;
}

if(isset($_ENV['CLEARDB_DATABASE_URL'])) {
	global $databaseConfig;

	$parts = parse_url($_ENV['CLEARDB_DATABASE_URL']);
	
	$databaseConfig['type'] = 'MySQLDatabase';
	$databaseConfig['server'] = $parts['host'];
	$databaseConfig['username'] = $parts['user'];
	$databaseConfig['password'] = $parts['pass'];
	$databaseConfig['database'] = trim($parts['path'], '/');

	Security::setDefaultAdmin('heroku', 'yesletmeinplease');
} else {
	require_once('conf/ConfigureFromEnv.php');
}

MySQLDatabase::set_connection_charset('utf8');

SSViewer::set_theme('docs');

if(Director::isDev() && @$_GET['db'] == "sqlite3") {
	global $databaseConfig;
	$databaseConfig['type'] = 'SQLite3Database';
}

Config::inst()->update('DocumentationViewer', 'link_base', '');
Config::inst()->update('DocumentationViewer', 'check_permission', false);

DocumentationViewer::set_edit_link(
	'framework',
	'https://github.com/silverstripe/silverstripe-framework/edit/%version%/docs/%lang%/%path%',
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

// Changelogs have heaps of phrases, but are rarely relevant for content searches
Config::inst()->update('DocumentationSearch', 'boost_by_path', array(
	'/^changelog/' => 0.05
));

// Set shared index (avoid issues with different temp paths between CLI and web users)
if(file_exists(BASE_PATH . '/.lucene-index')) {
	DocumentationSearch::set_index(BASE_PATH . '/.lucene-index');
}



