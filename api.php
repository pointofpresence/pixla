<?php

class Input
{
    /**
     * Fetch an item from the GET array
     *
     * @access   public
     * @param    string
     * @param bool $default
     * @return   string
     */
    public static function get($index = NULL, $default = FALSE)
    {
        // Check if a field has been provided
        if ($index === NULL && !empty($_GET)) {
            $get = [];

            // loop through the full _GET array
            foreach (array_keys($_GET) as $key) {
                $get[$key] = self::_fetchFromArray($_GET, $key);
            }

            return $get;
        }

        $result = self::_fetchFromArray($_GET, $index);

        if ($result === FALSE) {
            $result = $default;
        }

        return $result;
    }

    /**
     * Fetch an item from either the GET array or the POST
     *
     * @access   public
     * @param    string $index The index key
     * @param bool $default
     * @return string
     */
    public static function getPost($index = '', $default = FALSE)
    {
        if (!isset($_POST[$index])) {
            return self::get($index, $default);
        } else {
            return self::post($index, $default);
        }
    }

    /**
     * @return bool
     */
    public static function isAjaxRequest()
    {
        return (self::server('HTTP_X_REQUESTED_WITH') === 'XMLHttpRequest');
    }

    /**
     * Is cli Request?     *
     * Test to see if a request was made from the command line
     *
     * @return    bool
     */
    public static function isCliRequest()
    {
        return (php_sapi_name() === 'cli' || defined('STDIN'));
    }

    /**
     * @return bool
     */
    public static function isPostRequest()
    {
        return (strtolower(self::server('REQUEST_METHOD')) == 'post');
    }

    /**
     * Parse cli arguments     *
     * Take each command line argument and assume it is a URI segment.
     *
     * @return    string
     */
    public static function parseCliArgs()
    {
        $args = array_slice(self::server('argv'), 1);
        return $args ? '/' . implode('/', $args) : '';
    }

    /**
     * Fetch an item from the POST array
     *
     * @access   public
     * @param    string
     * @param bool $default
     * @return   string
     */
    public static function post($index = NULL, $default = FALSE)
    {
        // Check if a field has been provided
        if ($index === NULL && !empty($_POST)) {
            $post = [];

            // Loop through the full _POST array and return it
            foreach (array_keys($_POST) as $key) {
                $post[$key] = self::_fetchFromArray($_POST, $key);
            }

            return $post;
        }

        $result = self::_fetchFromArray($_POST, $index);

        if ($result === FALSE) {
            $result = $default;
        }

        return $result;
    }

    /**
     * редирект на страницу сайта. путь указывать относительно сайта
     * $header - 301 или 302 редирект
     *
     * @param string $url
     * @param bool $refresh
     * @param bool|int $header
     */
    public static function redirect($url = NULL, $refresh = FALSE, $header = 301)
    {
        if (!$url) {
            $url = self::server('HTTP_REFERER') ? self::server('HTTP_REFERER') : "/";
        }

        $url = strip_tags($url);
        $url = str_replace(['%0d', '%0a'], '', $url);

        if ($header == 301)
            header('HTTP/1.1 301 Moved Permanently');
        elseif ($header == 302)
            header('HTTP/1.1 302 Found');

        if ($refresh) {
            header("Refresh: 0; url={$url}");
        } else {
            header("Location: {$url}");
        }

        exit();
    }

    /**
     * @param string $index
     * @return bool|mixed
     */
    public static function server($index = '')
    {
        return self::_fetchFromArray($_SERVER, $index);
    }

    /**
     * @param $array
     * @param string $index
     * @return bool|mixed
     */
    private static function _fetchFromArray(&$array, $index = '')
    {
        if (!isset($array[$index])) {
            return FALSE;
        }

        return $array[$index];
    }
}

error_reporting(0);
ini_set('display_errors', 0);

if (Input::get('url') && Input::isAjaxRequest()) {
    $url    = Input::get('url');
    $url    = str_replace('https://', 'http://', $url);
    $scheme = parse_url($url, PHP_URL_SCHEME);

    if ($scheme != 'http') {
        die(json_encode(['error' => 400]));
    }

    $ext = pathinfo($url, PATHINFO_EXTENSION);

    if (!in_array(strtolower($ext), ['png', 'jpeg', 'jpg', 'svg', 'bmp', 'gif'])) {
        die(json_encode(['error' => 400]));
    }

    $name = pathinfo($url, PATHINFO_BASENAME);

    $mime = $ext;

    if ($mime == 'jpg') {
        $mime = 'jpeg';
    }

    $content = @file_get_contents($url);

    if(!$content) {
        die(json_encode(['error' => 400]));
    }

    $data = 'data:image/' . $mime . ";base64," . base64_encode($content);

    die(json_encode(['error' => 0, 'data' => $data, 'name' => $name]));
}