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
  var r = sabretache.readability();
  $(r.articleNode).css('border', '2px solid red');
  window.d = r.articleNode;
  console.log(r);
}).call(this, artoo.$);
