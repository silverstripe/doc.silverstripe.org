<?php

class ControllerExtension extends Extension {
	
	/**
	 * @var string
	 */
	public static $google_analytics_code = null;

	/**
	 * 
	 */
	public function onAfterInit(){
		Requirements::javascript('themes/docs/javascript/jquery.cookie.js');
		Requirements::javascript('themes/docs/javascript/main.js');
		Requirements::css('themes/docs//css/styles.css');

	}

	/**
	 * @return string 
	 */
	public function getGoogleAnalyticsCode() {
		return self::$google_analytics_code;
	}
	
	/**
	 * @return bool
	 */
	public function IsDev() {
		return (Director::isDev());
	}

}