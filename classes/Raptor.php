<?php
/**
 * Raptor
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */
class Raptor {

    public function __construct() {
        add_action('plugins_loaded', array($this, 'pluginsLoaded'));
    }

    public function pluginsLoaded() {
        if (current_user_can('edit_posts')) {
            add_action('wp_print_scripts', array($this, 'adminPrintScripts'));
            add_action('wp_ajax_raptor_save', array($this, 'save'));
        }
    }

    public function save() {
        if (!isset($_POST['nonce']) ||
                !wp_verify_nonce($_POST['nonce'], 'raptor')) {
            header('HTTP/1.0 403 Unauthorized', true, 403);
            die('Access denied');
        }

        if (!isset($_POST['posts']) || !is_array($_POST['posts'])) {
            header('HTTP/1.0 400 Bad Request', true, 400);
            die('Error saving content');
        }

        $updated = 0;
        foreach ($_POST['posts'] as $id => $post) {
            if (current_user_can('edit_post', $id)) {
                $data = array('ID' => $id);
                if (isset($post['title'])) {
                    $data['post_title'] = $post['title'];
                }
                if (isset($post['content'])) {
                    $data['post_content'] = $post['content'];
                }
                if (wp_update_post($data) !== 0) {
                    $updated++;
                }
            }
        }
        die("Successfully saved {$updated} post(s).");
    }

    public function adminPrintScripts() {
        wp_enqueue_style('jquery-pnotify', plugins_url('libraries/jquery-pnotify.css', dirname(__FILE__)), false, false, false);
        wp_enqueue_style('raptor-theme', plugins_url('libraries/theme.css', dirname(__FILE__)), false, false, false);
        wp_enqueue_style('raptor-theme-icons', plugins_url('libraries/theme-icons.css', dirname(__FILE__)), false, false, false);
        wp_enqueue_style('raptor', plugins_url('libraries/raptor.css', dirname(__FILE__)), false, false, false);
        wp_enqueue_style('raptor-front-end', plugins_url('libraries/raptor-front-end.css', dirname(__FILE__)), false, false, false);

        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-widget');
        wp_enqueue_script('jquery-ui-mouse');
        wp_enqueue_script('jquery-ui-progressbar');
        wp_enqueue_script('jquery-ui-tabs');
        wp_enqueue_script('jquery-ui-sortable');
        wp_enqueue_script('jquery-ui-draggable');
        wp_enqueue_script('jquery-ui-droppable');
        wp_enqueue_script('jquery-ui-selectable');
        wp_enqueue_script('jquery-ui-position');
        wp_enqueue_script('jquery-ui-resizable');
        wp_enqueue_script('jquery-ui-dialog');
        wp_enqueue_script('jquery-ui-button');
        wp_enqueue_script('jquery-ui-menu');
        wp_enqueue_script('rangy-core', plugins_url('libraries/rangy-core.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('rangy-applier', plugins_url('libraries/rangy-applier.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('rangy-cssclassapplier', plugins_url('libraries/rangy-cssclassapplier.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('rangy-selectionsaverestore', plugins_url('libraries/rangy-selectionsaverestore.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('rangy-serializer', plugins_url('libraries/rangy-serializer.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('rangy-textrange', plugins_url('libraries/rangy-textrange.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('jquery-pnotify', plugins_url('libraries/jquery-pnotify.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('goog-table', plugins_url('libraries/goog-table.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('resizetable', plugins_url('libraries/resizetable.js', dirname(__FILE__)), 'jquery-ui', false, true);
        wp_enqueue_script('raptor', plugins_url('libraries/raptor.js', dirname(__FILE__)), 'jquery-ui', false, true);

        wp_enqueue_style('raptor-wp', plugins_url('assets/raptor-wp.css', dirname(__FILE__)), 'raptor', false, false);
        wp_enqueue_script('raptor-wp', plugins_url('assets/raptor-wp.js', dirname(__FILE__)), 'raptor', false, true);

        wp_localize_script('raptor-wp', 'RaptorWP', array(
            'id' => 'test',
            'url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('raptor'),
            'action' => 'raptor_save',
        ));

        add_filter('the_title', array($this, 'theTitle'));
        add_filter('the_content', array($this, 'theContent'));
    }

    public function theTitle($title) {
        global $post, $wp_list_table;
        if (isset($wp_list_table) || !isset($post) || !$post) {
            return $title;
        }
        $encodedContent = base64_encode($post->title);
        return "<span class='raptor-micro' data-raptor-type='title' data-raptor-id='$post->ID' data-raptor-source='$encodedContent'>$title</span>";
    }

    public function theContent($content) {
        global $post;
        if (!isset($post) || !$post) {
            return $content;
        }
        $encodedContent = base64_encode($post->post_content);
        return "<div class='raptor-content' data-raptor-type='content' data-raptor-id='$post->ID' data-raptor-source='$encodedContent'>$content</div>";
    }

}
