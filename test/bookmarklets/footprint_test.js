;(function($, undefined) {
  'use strict';

  /**
   * Footprint test
   * ===============
   *
   * A test bookmarklet to tune footprints.
   */

  // IMPROVE: jquery homepage bottom, why does not match?
  // IMPROVE: jquery homepage top nav, why does not match?
  // IMPROVE: hacker news find way to detect patterns in urls?

  // Being a sassy droid...
  artoo.beep.sassy();

  // Bootstrapping
  sabretache.bootstrap($);

  // Adding class
  var style = document.createElement('style');
  style.innerHTML = '.sabretache {color: red !important;}';
  document.head.appendChild(style);

  // Click on anything
  // TODO: try one more step or enable user to expand the selection by
  // ascending the tree
  $('*:not(html,body)').click(function(e) {

    // Stop
    e.stopPropagation();
    e.preventDefault();

    // Removing precedent highlight
    $('.sabretache').removeClass('sabretache');

    // Finding similar elements
    var $similar = $(this).similar();

    // Trying to get a relevant path
    console.log('\nCollection path:', $similar.path());

    // Highlighting
    console.log($(this).footprint());
    console.log($similar.length + ' elements found!');
    $similar.addClass('sabretache');
  });
}).call(this, artoo.$);
