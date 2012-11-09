<?php

class ControllerExtension extends Extension {
	
	/**
	 * @var string
	 */
	public static $google_analytics_code = null;

	/**
	 * @return string 
	 */
	public function getGoogleAnalyticsCode() {
		return self::$google_analytics_code;
	}
	
	/**
	 * @return boolean
	 */
	public function IsDev() {
		return (Director::isDev());
	}
}