;(function($, undefined) {
  'use strict';

  /**
   * Readability test
   * =================
   *
   * A test bookmarklet to tune article extraction.
   */

  // Welcoming
  artoo.beep.hello();

  // Bootstraping
  sabretache.bootstrap($);

  // Extracting
  console.log(sabretache.readability());
}).call(this, artoo.$);
