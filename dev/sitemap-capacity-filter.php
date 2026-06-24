<?php
/**
 * APPENDED to Hello Elementor Child functions.php on 2026-06-23.
 * This is a RECORD of the snippet added live via Theme File Editor (append-only).
 * It is NOT loaded from this file — the live copy lives in the child theme.
 *
 * Block 2 of 2 on the_seo_framework_sitemap_additional_urls:
 * Adds indexed capacity taxonomy term pages to the TSF XML sitemap.
 * Only terms with real term_content (>200 chars stripped) are included —
 * the curated/indexable ones; empty/noindex capacity terms are skipped
 * to avoid adding thin or noindex URLs to the sitemap.
 *
 * (Block 1, added earlier, adds all non-empty manufacturer terms — see
 *  backups/functions.php.backup-2026-06-23.php for the pre-filter baseline.)
 */
add_filter( 'the_seo_framework_sitemap_additional_urls', function ( $urls ) {
    $cap_terms = get_terms( array(
        'taxonomy'   => 'capacity',
        'hide_empty' => false,
    ) );
    if ( ! is_wp_error( $cap_terms ) ) {
        foreach ( $cap_terms as $term ) {
            $content = get_term_meta( $term->term_id, 'term_content', true );
            if ( ! empty( $content ) && strlen( wp_strip_all_tags( $content ) ) > 200 ) {
                $link = get_term_link( $term );
                if ( ! is_wp_error( $link ) ) {
                    $urls[ $link ] = array( 'lastmod' => null );
                }
            }
        }
    }
    return $urls;
}, 11 );
