var highlightedClassName = 'tldr-highlighter-plugin-highlighted-word';

self.port.on('highlight-text', function(queryWord){
  var unallowedElements = 'script',
      $elements = $('body').children().not(unallowedElements);

  $elements.each(function(){ _clearHighlight($(this)); });

  $elements.filter(':contains(' + queryWord + ')').withinviewport().each(function(){
    _highlightElement($(this), queryWord);
  });
});

self.port.on('detach', function(){
  _clearHighlight($('body'));
});




//
// Private Methods
//

var _highlightElement = function($el, queryWord){
  var escapedQueryWord = _escapeRegex(queryWord);

  // Matches everything between '>' and '<' if the queryWord is found.
  var regex = new RegExp('(\\>[^\\<]*' + escapedQueryWord + '([^\\<]*)\\<)', 'g');

  // HACK: add temporary '>' and '<' in elementHtml to match the queryWord
  // directly in the element $el.
  var elementHtml = '>' + $el.html() + '<';

  // This is a temporary placeholder element that is used to replace the
  // queryWord. The absence of the queryWord in this placeholder prevents the
  // regex from infinitely matching this part of the elementHtml.
  var placeholderElement = "<span class='" + highlightedClassName + "'></span>";

  var match = regex.exec(elementHtml);

  while (match != null) {
    var replacedMatch =
      _replaceAll(match[0], escapedQueryWord, placeholderElement);
    elementHtml = elementHtml.replace(match[0], replacedMatch);
    match = regex.exec(elementHtml);
  }

  // Replace the placeholder with the actual wrapped element.
  elementHtml =
    _replaceAll(
      elementHtml,
      placeholderElement,
      "<span class='" + highlightedClassName + "'>" + queryWord + "</span>"
    );

  // Remove the temporary angle brackets.
  $el.html(elementHtml.substring(1, elementHtml.length - 1));
};

var _clearHighlight = function($el){
  var elementHtml = $el.html(),
      regex = new RegExp('<span class="' + highlightedClassName + '">([\\s\\S]+?)</span>');

  var match = regex.exec(elementHtml);
  while (match != null) {
    elementHtml = elementHtml.replace(match[0], match[1]);
    match = regex.exec(elementHtml);
  }

  $el.html(elementHtml);
};

var _replaceAll = function(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
};

var _escapeRegex = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
