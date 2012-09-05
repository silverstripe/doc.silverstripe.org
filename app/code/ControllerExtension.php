<?php

class ControllerExtension extends Extension {
	
	static $google_analytics_code = null;

	public function onBeforeInit() {

		Requirements::combine_files('doc.css', array(
			'themes/ssorgsites/css/core.css',
			'themes/ssorgsites/css/grid.css',
			'themes/ssorgsites/css/typography.css',
			'themes/ssorgsites/css/form.css',
			'docsviewer/css/DocumentationViewer.css'
		));

		Requirements::css('themes/ssorgsites/css/print.css', 'print');
	}
	
	/**
	 * @return String
	 */
	function getGoogleAnalyticsCode() {
		return self::$google_analytics_code;
	}
	
	/**
	 * @return Bool
	 */
	function IsDev() {
		return (Director::isDev());
	}
}