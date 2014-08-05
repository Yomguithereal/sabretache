;(function(undefined) {
  'use strict';

  /**
   * sabretache core
   * ================
   *
   * The main sabretache namespace.
   */

   // Main object
   var sabretache = {
    plugins: [],
    settings: {
      footprint: {

        // TODO: by default, we could memoize when more than x nodes exist
        memoize: false,
        identity: []
      }
    }
   };

   // Methods
   sabretache.bootstrap = function($) {

    // Applying jQuery plugins to the given instance
    sabretache.plugins.forEach(function(p) {
      p($);
    });
   };

   // Exporting to main scope
   this.sabretache = sabretache;
}).call(this);
