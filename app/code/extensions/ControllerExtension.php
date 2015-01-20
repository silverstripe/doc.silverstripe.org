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
		Requirements::javascript('themes/docs/javascript/main.js');
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
