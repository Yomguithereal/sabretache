;(function(undefined) {
  'use strict';

  /**
   * sabretache jquery footprint plugin
   * ===================================
   *
   * Experimental plugin designed to compute the footprint of a given
   * DOM element.
   */

  function _footprint($) {
    var blacklists = {
      classes: [
        'active',
        'activated',
        'disabled',
        'enabled',
        'even',
        'first',
        'hidden',
        'last',
        'odd',
        'selected'
      ],
      attributes: [
        'class',
        'href',
        'id',
        'name',
        'src',
        'style',
        'value'
      ],
      children: [
        'br',
        'hr',
        'iframe',
        'script',
        'style'
      ]
    }

    // TODO: customize identity
    // TODO: find another for tables and such
    // TODO: choose a blurry way
    // TODO: consider nth-child and such
    // TODO: provide a full memoization through jquery.data
    $.fn.footprint = function(recur) {
      var $e = $(this).first(),
          $children,
          $parent,
          fp = [],
          attrs;

      //-- 1) Getting element tag name
      fp.push('+' + $e.prop('tagName'));

      //-- 2) Retrieving relevant classes
      $e.classes().forEach(function(c) {

        // Getting class usage
        // TODO: find a finer statistical way
        if (!~blacklists.classes.indexOf(c) && $('.' + c).length > 2)
          fp.push('.' + c);
      });

      //-- 3) Retrieving attributes
      attrs = $e.attributes(blacklists.attributes);
      Object.keys(attrs).forEach(function(n) {
        fp.push('[' + n + ']');
      });

      //-- 4) Computing parent
      var $parent = $e.parent();
      if ($parent.prop('tagName') !== 'BODY' &&
          $parent.prop('tagName') !== 'HTML' &&
          recur !== false)
        fp.push('*parent(' + $parent.footprint(false).join(',') + ')');

      //-- 5) Computing children
      if (recur !== false) {
        $children = $e.children(':not(' + blacklists.children.join(',') + ')');

        // Iterating through children
        $children.each(function() {
          fp.push('*child(' + $(this).footprint(false).join(',') + ')');
        });
      }

      //-- 6) Tagging
      // TODO: define whether a tagging utility is useful or not
      if (true && recur !== false) {
        var txt = $e.text();
        if (~txt.search(/\w/))
          fp.push('@letters');
        if (~txt.search(/\d/))
          fp.push('@numbers');
        if (~txt.split(/\s/).length > 1)
          fp.push('@words');
      }

      return fp;
    };
  }

  // Exporting
  sabretache.plugins.push(_footprint);
}).call(this);
