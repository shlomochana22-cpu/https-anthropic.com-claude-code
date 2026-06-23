<?php
/**
 * Child functions and definitions.
 */

/**
 * Process single location
 *
 * @return void
 */
function cb_child_process_location( $location = null ) {

    if ( ! function_exists( 'jet_theme_core' ) ) {
        return false;
    }
    if( ! defined( 'ELEMENTOR_VERSION' ) ) {
        return false;
    }

    $done = jet_theme_core()->locations->do_location( $location );

    return $done;

}

function get_current_term_name_by_taxonomy_shortcode($atts) {
    // Get the taxonomy slug from shortcode attributes
    $atts = shortcode_atts(
        array(
            'taxonomy' => '', // The taxonomy slug (e.g., 'category', 'product_type')
        ),
        $atts,
        'current_term_name' // Shortcode name
    );

    // Ensure that a taxonomy slug is provided
    if (empty($atts['taxonomy'])) {
        return 'Taxonomy slug is missing';
    }

    // Check if we are on a term archive page for the given taxonomy
    if (is_tax($atts['taxonomy'])) {
        // Get the current term object
        $term = get_queried_object();

        // Check if the term object is valid
        if ($term && !is_wp_error($term)) {
            // Return the current term's name
            return (int)$term->name;
        }
    }

    // Return a fallback message if not on a valid term archive page
    return 'Not on a valid term archive page';
}
add_shortcode('current_term_name',
'get_current_term_name_by_taxonomy_shortcode');

function post_title_shortcode() {
    // Get the current post title
    return get_the_title();
}
add_shortcode('post_title', 'post_title_shortcode');

// Function to set featured image for posts with a specific taxonomy term ID
function set_featured_image_for_posts_with_taxonomy_id( $attachment_id, $taxonomy, $term_id ) {
    // Ensure the attachment is valid
    if ( ! get_post( $attachment_id ) ) {
        return; // Exit if the attachment doesn't exist
    }

    // Query for posts that have the specific taxonomy term by ID
    $args = array(
        'post_type'      => 'accumulators',      // You can change 'post' to any custom post type
        'posts_per_page' => -1,                  // Get all posts (you can limit this by changing -1)
        'tax_query'      => array(
            array(
                'taxonomy' => $taxonomy,
                'field'    => 'term_id', // Change from 'slug' to 'term_id'
                'terms'    => $term_id,
            ),
        ),
    );

    $query = new WP_Query( $args );

    // Loop through the posts
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();

            // Set the featured image for the post
            set_post_thumbnail( get_the_ID(), $attachment_id );
        }
    }

    // Reset post data after the loop
    wp_reset_postdata();
}

add_filter(
    'the_seo_framework_breadcrumb_list',
    function( $list, $args ) {

        if ( ! is_singular() ) {
            return $list;
        }

        $post_id = get_queried_object_id();
        if ( ! $post_id ) {
            return $list;
        }

        $custom_label = get_post_meta( $post_id, 'ac_breadcrumb_title', true );
        if ( ! $custom_label ) {
            return $list;
        }

        $last_key = array_key_last( $list );
        if ( null === $last_key ) {
            return $list;
        }

        if ( isset( $list[ $last_key ]['name'] ) ) {
            $list[ $last_key ]['name'] = $custom_label;
        }

        return $list;
    },
    10,
    2
);
