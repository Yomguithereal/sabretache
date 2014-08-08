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
          fp = $e.data('footprint') || [],
          attrs;

      // Do we already have the footprint stored?
      if (fp.length)
        return fp;

      //-- 1) Getting element tag name
      fp.push('+' + $e.prop('tagName'));

      //-- 2) Retrieving relevant classes
      $e.classes().forEach(function(c) {

        // Getting class usage
        // TODO: find a finer statistical way
        // TODO: define whether the third parent is ok
        if (!~blacklists.classes.indexOf(c) &&
            $e.parent().parent().parent().find('.' + c).length > 2)
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
      if (false && recur !== false) {
        var txt = $e.text();
        if (~txt.search(/\w/))
          fp.push('@letters');
        if (~txt.search(/\d/))
          fp.push('@numbers');
        if (~txt.split(/\s/).length > 1)
          fp.push('@words');
      }

      //-- 7) Position (if relevant because of table)
      if (recur !== false) {
        if ($e.parents('table').length &&
            !$e.closest('th').length)
          fp.push('!' + $e.closest('td').index());
      }

      //-- 8) Experimental href pattern recognition
      // TODO: memoize in some way
      var href = $e.attr('href'),
          baseUrl;

      if (href) {
        baseUrl = href.split('?')[0];
        if ($('[href^="' + baseUrl + '?"]').length > 2)
          fp.push('[href^="' + baseUrl + '?"]');
      }

      // Should we memoize?
      if (sabretache.settings.footprint.memoize)
        $e.data('footprint', fp);

      return fp;
    };
  }

  // Exporting
  sabretache.plugins.push(_footprint);
}).call(this);
