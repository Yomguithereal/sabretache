;(function(undefined) {
  'use strict';

  /**
   * sabretache misc jQuery plugins
   * ===============================
   *
   * Compilation of minor but useful jQuery plugins.
   */

  function _classes($) {
    $.fn.classes = function() {
      var index = {},
          cls;

      $(this).each(function() {
        cls = ($(this).attr('class') || '').trim().replace(/\s+/g, ' ');
        if (cls)
          cls.split(' ').forEach(function(c) {
            index[c] = true;
          });
      });

      return Object.keys(index);
    };
  }

  function _attributes($) {
    $.fn.attributes = function(blackList) {
      blackList = blackList || [];

      var $e = $(this).first(),
          attrs = {},
          i,
          l,
          a,
          n,
          v;

      if (!$e[0])
        throw Error('jquery.attributes: trying to access attributes ' +
                    'of no element.');

      // Short exit
      if (!$e[0].attributes)
        return attrs;

      for (i = 0, l = $e[0].attributes.length; i < l; i++) {
        a = $e[0].attributes[i];
        n = a.name || a.nodeName;

        if (~blackList.indexOf(n))
          continue;

        v = $e.attr(n);

        if (v !== undefined && v !== false)
          attrs[n] = v;
      }

      return attrs;
    };
  }

  function _sameAs($) {
    $.fn.sameAs = function(compareTo) {
      var $c = $(compareTo);

      return $c &&
             this.length === $c.length &&
             this.length === this.filter($c).length;
    };
  }

  function _nodeText($) {
    $.fn.nodeText = function() {
      return $(this).contents().filter(function() {
        return this.nodeType === 3;
      }).text();
    };
  }

  function _visibleText($) {
    $.fn.visibleText = function() {
      return $.map($(this).contents(), function(e) {
        if (e.nodeType === 3)
          return $(e).text();
        if ($(e).is(':visible:parent'))
          return $(e).visibleText();
      }).join('');
    };
  }

  // Exporting
  sabretache.plugins.push(_classes);
  sabretache.plugins.push(_attributes);
  sabretache.plugins.push(_sameAs);
  sabretache.plugins.push(_nodeText);
  sabretache.plugins.push(_visibleText);
}).call(this);
