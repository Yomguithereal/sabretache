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

  // Helpers
  // TODO: apply some weights to footprint components
  function compare(f1, f2) {
    var errors = 0;

    f1.forEach(function(i) {
      if (!~f2.indexOf(i))
        errors++;
    });

    f2.forEach(function(i) {
      if (!~f1.indexOf(i))
        errors++;
    });

    return errors < 2;
  }

  // Click on anything
  // TODO: try one more step or enable user to expand the selection by
  // ascending the tree
  $('*:not(html,body)').click(function(e) {

    // Removing precedent highlight
    $('.sabretache').removeClass('sabretache');

    // Selectors
    // TODO: don't test the same node twice
    // TODO: optimize comparisons
    var $node = $(this),
        $similar = $node,
        $parent = $node.parent();

    // Stop
    e.stopPropagation();
    e.preventDefault();

    // Footprint sandbox
    var footprint = $node.footprint();
    console.log(footprint);

    // Iterating back to parents
    while ($parent.prop('tagName') !== 'BODY') {

      // Finding similar elements in downright nodes
      $parent.find('*:visible').each(function() {
        if (compare($(this).footprint(), footprint))
          $similar = $similar.add(this);
      });

      if ($similar.length > 2)
        break;

      // Go to next parent
      $parent = $parent.parent();
    }

    // Highlighting
    console.log($similar.length + ' elements found!');
    $similar.addClass('sabretache');
  });
}).call(this, artoo.$);
