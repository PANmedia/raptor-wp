<?php
/**
 * Plugin Name: Raptor Editor for WordPress
 * Plugin URI: https://github.com/PANmedia/raptor-wp
 * Description: Inline content editing.
 * Version: 1.0.10
 * Author: David Neilsen
 * Author URI: https://github.com/Petah
 * License: GPLv2 or later
 */
define('RAPTOR_ROOT', dirname(__FILE__));

include RAPTOR_ROOT . '/classes/Raptor.php';

$raptor = new Raptor();
