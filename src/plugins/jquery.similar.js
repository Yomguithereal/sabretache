;(function(undefined) {
  'use strict';

  /**
   * sabretache similar elements finder
   * ===================================
   *
   * Experimental plugin designed to find similar elements relevant to the one
   * selected.
   */

  // Helpers
  // TODO: apply some weight to compare more finely
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

  // Main function
  // TODO: don't test the same node twice
  function _similar($) {
    $.fn.similar = function() {

      // Selectors
      var $node = $(this).first(),
          $similar = $node,
          $parent = $node.parent();

      // Footprint
      var footprint = $node.footprint();

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

      return $similar;
    };
  }

  // Exporting
  sabretache.plugins.push(_similar);
}).call(this);
