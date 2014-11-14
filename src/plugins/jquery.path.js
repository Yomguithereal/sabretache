;(function(undefined) {
  'use strict';

  /**
   * sabretache path retrieval jQuery plugin
   * ========================================
   *
   * Experimental plugin designed to retrieved the css path of selected
   * DOM elements.
   */

  // Helpers
  function homogeneous(a) {
    var f = a[0];

    return a.every(function(i) {
      return i === f;
    });
  }

  function collect($sel, fn) {
    var acc = [];

    $sel.each(function() {
      acc.push(fn.apply(this));
    });

    return acc;
  }

  function _path($) {

    // Single item
    function single(optimal) {
      optimal = (optimal === false) ? false : true;

      var $e = $(this),
          $c = $e,
          $a,
          path = [],
          sel,
          i;

      while (($c.prop('tagName') || '').toLowerCase() !== 'body') {

        // If the current selector is already optimal, we break
        if (optimal) {
          $a = $(path.join(' > '));
          if ($a.length === 1 && $a.get(0) === $e.get(0))
            break;
        }

        // Phase initialization
        sel = $c.prop('tagName').toLowerCase();
        i = '';

        // Getting an id
        if ($c.attr('id')) {
          sel += '#' + $c.attr('id');
        }

        // Getting a relevant classes
        else if ($c.attr('class') && optimal) {
          $c.classes().forEach(function(c) {
            if ($c.parent().children('.' + c).length === 1)
              sel += '.' + c;
          });
        }

        // Getting a nth-child if nothing else works
        if ($c.parent().children(sel).length > 1)
          i = ':nth-child(' + ($c.index() + 1) + ')';

        path.unshift(sel + i);

        // Next
        $c = $c.parent();
      }

      // Returning the path
      return path.join(' > ') || 'body';
    }

    // Multiple items
    function multiple(optimal) {
      optimal = (optimal === false) ? false : true;

      var $sel = $(this),
          $parent = $sel.first().parent(),
          path = '',
          i,
          l;

      //-- 1) Trying to find a common parent
      while ($parent.prop('tagName') !== 'BODY' &&
             $parent.find($sel).length !== $sel.length) {
        $parent = $parent.parent();
      }

      if ($parent.prop('tagName') !== 'BODY')
        path += $parent.path() + ' ';

      //-- 2) Trying to find common ground on tag names
      var tags = collect($sel, function() {
        return $(this).prop('tagName').toLowerCase();
      });

      if (homogeneous(tags))
        path += tags[0];

      if ($(path).sameAs($sel))
        return path;

      //-- 3) Trying to find common ground on classes
      var classes = $sel.classes();

      for (i = 0, l = classes.length; i < l; i++) {
        if ($(path + '.' + classes[i]).sameAs($sel))
          return path + '.' + classes[i];
      }

      //-- 4) Filtering by visible
      if ($(path + ':visible').sameAs($sel))
        return path + ':visible';

      //-- 5) Returning a selector mess as a fallback
      return collect($sel, function() {
        return $(this).path();
      }).join(', ');
    }

    $.fn.path = function(optimal) {

      // Single item or more?
      if ($(this).length === 1)
        return single.call(this, optimal);
      else if ($(this).length > 1)
        return multiple.call(this, optimal);

      throw Error('jquery.path: cannot apply on an empty selection.');
    };
  }

  // Exporting
  sabretache.plugins.push(_path);
}).call(this);
