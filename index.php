<?php
/**
 * Plugin Name: Raptor Editor
 * Plugin URI: https://github.com/PANmedia/raptor-wp
 * Description: Inline content editing.
 * Version: 0.1
 * Author: David Neilsen
 * Author URI: https://github.com/Petah
 * License: GPL
 */
define('RAPTOR_ROOT', dirname(__FILE__));

include RAPTOR_ROOT . '/classes/Raptor.php';

$raptor = new Raptor();
