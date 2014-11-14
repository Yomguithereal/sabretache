;(function(undefined) {
  'use strict';

  /**
   * sabretache readability
   * =======================
   *
   * sabretache's version of the old Readability algorithm by
   * Arc90 Labs.
   *
   * This implementation is designed to work with jQuery and only returns
   * the needed information rather than formatting the page for reading.
   *
   * It is thusly more suited to misc tasks needing article extraction
   * from raw html.
   *
   * Please note that the original algorithm has been modified to take HTML5
   * into account. Its behaviour is therefore slightly different.
   */

  // Utilities
  //-----------

  // Main regular expressions used by the algorithm
  var regexps = {
    unlikelyCandidates:    /combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i,
    okMaybeItsACandidate:  /and|article|body|column|main|shadow/i,
    positive:              /article|body|content|entry|hentry|main|page|pagination|post|text|blog|story/i,
    negative:              /combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget/i,
    extraneous:            /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single/i,
    divToPElements:        /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
    replaceBrs:            /(<br[^>]*>[ \n\r\t]*){2,}/gi,
    normalize:             /\s{2,}/g,
    killBreaks:            /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
    videos:                /http:\/\/(www\.)?(youtube|vimeo)\.com/i,
    skipFootnoteLink:      /^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$/i,
    nextLink:              /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
    prevLink:              /(prev|earl|old|new|<|«)/i
  };

  // Should we apply on visible text only?
  function normalizedText($node) {
    return $node.text().trim().replace(regexps.normalize, ' ');
  }


  // Functions
  //-----------

  // Retrieving the article's title
  function getArticleTitle() {
    var curTitle = '',
        origTitle = '';

    curTitle = origTitle = document.title;

    // In case of #title
    if (typeof curTitle !== 'string')
      curTitle = origTitle = normalizedText($('title:first'));

    if (~curTitle.search(/ [\|\-] /)) {
      curTitle = origTitle.replace(/(.*)[\|\-] .*/gi,'$1');

      if (curTitle.split(' ').length < 3)
        curTitle = origTitle.replace(/[^\|\-]*[\|\-](.*)/gi,'$1');
    }
    else if (~curTitle.indexOf(': ')) {
      curTitle = origTitle.replace(/.*:(.*)/gi, '$1');

      if (curTitle.split(' ').length < 3)
        curTitle = origTitle.replace(/[^:]*[:](.*)/gi,'$1');
    }
    else if (curTitle.length > 150 || curTitle.length < 15) {
      var $h1 = sabretache.$('h1');
      if ($h1.length === 1)
        curTitle = normalizedText($h1);
    }

    curTitle = curTitle.trim();

    if(curTitle.split(' ').length <= 4)
      curTitle = origTitle;

    return curTitle;
  }

  // Initialize a node's score
  // TODO: check whether an object is needed here
  function initNode($node, classWeight) {

    // We do not initialize the node if this one is already initialized
    if ($node.data('readability'))
      return;

    var score = 0;

    switch($node.prop('tagName')) {
      case 'ARTICLE':
      case 'DIV':
        score += 5;
        break;

      case 'PRE':
      case 'TD':
      case 'BLOCKQUOTE':
        score += 3;
        break;

      case 'ADDRESS':
      case 'OL':
      case 'UL':
      case 'DL':
      case 'DD':
      case 'DT':
      case 'LI':
      case 'FORM':
        score -= 3;
        break;

      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
      case 'TH':
        score -= 5;
        break;
    }

    if (classWeight)
      score += getClassWeight($node);

    // Assigning data to node
    $node.data('readability', score);
  }

  // Computing a node's class weight
  function getClassWeight($node) {
    var weight = 0,
        classes = $node.attr('class') || '',
        id = $node.attr('id') || '';

    // Look for a special classname
    if (classes) {
      if (~classes.search(regexps.negative))
        weight -= 25;

      if (~classes.search(regexps.positive))
        weight += 25;
    }

    // Look for a special ID
    if (id) {
      if (~id.search(regexps.negative))
        weight -= 25;

      if (~id.search(regexps.positive))
        weight += 25;
    }

    return weight;
  }

  // Compute a node's link density
  function getLinkDensity($node) {
    return (normalizedText($node.find('a')) || '').length /
      (normalizedText($node).length || 1);
  };

  // Retrieving the article
  function grabArticle(flags) {
    flags = flags || {
      classWeight: true,
      stripUnlikelyCandidates: true
    };

    var page = document.body,
        $ = sabretache.$;

    // TODO: grabbing frame or not
    var cacheHtml = page.innerHTML,
        $elements = $('*:visible', page);

    //-- 1) Trashing probably irrelevant nodes
    var $nodesToScore = $();
    $elements.each(function() {
      var $this = $(this);

      // Removing unlikely candidates
      if (flags.stripUnlikelyCandidates) {
        var matchString = ($this.attr('class') + $this.attr('id')) || '';

        if (~matchString.search(regexps.unlikelyCandidates) &&
            !~matchString.search(regexps.okMaybeItsACandidate) &&
            $this.prop('tagName')) {
          $elements = $elements.not(this);
        }

        if (~['P', 'TD', 'PRE'].indexOf($this.prop('tagName')) ||
            ($this.prop('tagName') === 'DIV' && !~$this.html().search(regexps.divToPElements)))
          $nodesToScore = $nodesToScore.add(this);
      }
    });

    //-- 2) Assigning a score to remaining elements
    var $candidates = $();
    $nodesToScore.each(function() {
      var $parent = $(this).parent().not('body, html'),
          $grandParent = $parent.parent().not('body', 'html'),
          txt = normalizedText($(this)),
          score = 0;

      if (!$parent.length || txt.length < 25)
        return;

      // Readability data for parent and grandparent
      initNode($parent, flags.classWeight);
      $candidates = $candidates.add($parent);

      if ($grandParent.length) {
        initNode($grandParent, flags.classWeight);
        $candidates = $candidates.add($grandParent);
      }

      /* Add a point for the paragraph itself as a base. */
      score++;

      /* Add points for any commas within this paragraph */
      score += txt.split(',').length;

      /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
      txt += Math.min(Math.floor(txt.length / 100), 3);

      // Adding full score to parent
      $parent.data('readability',
        ($parent.data('readability') + score));

      // Adding half score for grand parent
      if ($grandParent.length) {
        $grandParent.data('readability',
          ($grandParent.data('readability') + (score / 2)));
      }
    });

    //-- 3) Finding best candidate
    // TODO: optimize
    var $topCandidate = null;
    $candidates.each(function() {
      var $this = $(this);

      // Applying link density metric
      $this.data('readability',
        $this.data('readability') * (1 - getLinkDensity($this)));

      if (!$topCandidate ||
          $this.data('readability') > $topCandidate.data('readability'))
        $topCandidate = $this;
    });

    // If not top candidate is found, we back to BODY
    if (!$topCandidate)
      $topCandidate = $('body');

    //-- 4) Investigating siblings
    return $topCandidate[0];
  }


  // Interface
  //-----------
  sabretache.readability = function() {
    var article = grabArticle();

    return {
      title: getArticleTitle(),
      articleNode: article
    };
  };
}).call(this);
