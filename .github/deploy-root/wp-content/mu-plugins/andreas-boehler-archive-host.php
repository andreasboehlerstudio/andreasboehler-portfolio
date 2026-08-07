<?php
/**
 * Keep the former WordPress installation isolated on the archive hostname.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function andreas_boehler_is_archive_host() {
	$host = isset( $_SERVER['HTTP_HOST'] ) ? strtolower( (string) $_SERVER['HTTP_HOST'] ) : '';
	$host = preg_replace( '/:\d+$/', '', $host );

	return 'archiv.andreasboehler.com' === $host;
}

if ( ! andreas_boehler_is_archive_host() ) {
	return;
}

function andreas_boehler_archive_url() {
	return 'https://archiv.andreasboehler.com';
}

add_filter( 'pre_option_home', 'andreas_boehler_archive_url' );
add_filter( 'pre_option_siteurl', 'andreas_boehler_archive_url' );

function andreas_boehler_archive_replace_url( $value ) {
	return str_replace(
		array( 'https://andreasboehler.com', 'http://andreasboehler.com' ),
		andreas_boehler_archive_url(),
		$value
	);
}

add_filter( 'the_content', 'andreas_boehler_archive_replace_url', 99 );
add_filter( 'the_excerpt', 'andreas_boehler_archive_replace_url', 99 );
add_filter( 'wp_redirect', 'andreas_boehler_archive_replace_url', 99 );

function andreas_boehler_archive_robots( $robots ) {
	$robots['noindex'] = true;
	$robots['nofollow'] = true;
	$robots['noarchive'] = true;

	return $robots;
}

add_filter( 'wp_robots', 'andreas_boehler_archive_robots', 99 );

function andreas_boehler_archive_headers() {
	header( 'X-Robots-Tag: noindex, nofollow, noarchive', true );
}

add_action( 'send_headers', 'andreas_boehler_archive_headers', 0 );
