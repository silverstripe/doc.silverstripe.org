<?php
class DocumentationViewerExtension extends Extension {
	static $google_analytics_code = null;

	public function init() {
		parent::init();

		// Note: you should use SS template require tags inside your templates 
		// instead of putting Requirements calls here.  However these are 
		// included so that our older themes still work
		Requirements::themedCSS('layout'); 
		Requirements::themedCSS('typography'); 
		Requirements::themedCSS('form'); 
	}
	
	/**
	 * @return String
	 */
	function getGoogleAnalyticsCode() {
		return self::$google_analytics_code;
	}
}