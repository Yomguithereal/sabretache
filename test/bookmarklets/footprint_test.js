;(function($, undefined) {
  'use strict';

  /**
   * Footprint test
   * ===============
   *
   * A test bookmarklet to tune footprints.
   */

  // Bootstrapping
  sabretache.bootstrap($);

  // Click on anything
  $('*:not(html,body)').click(function(e) {

    // Stop
    e.stopPropagation();
    e.preventDefault();

    // Footprint sandbox
    var footprint = $(this).footprint();

    console.log(footprint);
  });
}).call(this, artoo.$);
