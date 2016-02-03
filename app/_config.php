<?php

global $project;
$project = 'app';

global $database;

if(defined('SS_DATABASE_NAME') && SS_DATABASE_NAME) {
	$database = SS_DATABASE_NAME;
} else {
	$database = 'SS_ssdoc';
}

if(isset($_ENV['CLEARDB_DATABASE_URL'])) {
	global $databaseConfig;

	$parts = parse_url($_ENV['CLEARDB_DATABASE_URL']);
	
	$databaseConfig['type'] = 'MySQLDatabase';
	$databaseConfig['server'] = $parts['host'];
	$databaseConfig['username'] = $parts['user'];
	$databaseConfig['password'] = $parts['pass'];
	$databaseConfig['database'] = trim($parts['path'], '/');
} else {
	require_once('conf/ConfigureFromEnv.php');
}

MySQLDatabase::set_connection_charset('utf8');

SSViewer::set_theme('docs');

Config::inst()->update('DocumentationManifest', 'automatic_registration', false);
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
	Director::forceSSL();
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
	Config::inst()->update('DocumentationSearch', 'index_location', BASE_PATH . '/.lucene-index');
}

// Fix invalid character in iconv
// see http://stackoverflow.com/questions/4723135/invalid-characters-for-lucene-text-search
Zend_Search_Lucene_Search_QueryParser::setDefaultEncoding('utf-8');
Zend_Search_Lucene_Analysis_Analyzer::setDefault(
    new Zend_Search_Lucene_Analysis_Analyzer_Common_Utf8_CaseInsensitive ()
);

