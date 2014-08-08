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
    $: {},
    plugins: [],
    settings: {
      footprint: {
        memoize: false,
        identity: []
      }
    }
   };

   // Generic methods
   sabretache.bootstrap = function($) {

    // Storing jQuery reference
    sabretache.$ = $;

    // Applying jQuery plugins to the given instance
    sabretache.plugins.forEach(function(p) {
      p($);
    });
   };

   // Exporting to main scope
   this.sabretache = sabretache;
}).call(this);
