var highlightedClassName = 'tldr-highlighter-plugin-highlighted-word';

self.port.on('highlight-text', function(queryWord){
  var unallowedElements = 'script',
      $elements = $('body').children().not(unallowedElements);

  $elements.each(function(){ _clearHighlight($(this)); });

  $elements.filter(':contains(' + queryWord + ')').withinviewport().each(function(){
    _highlightElement($(this), queryWord);
  });
});

var _highlightElement = function($el, queryWord){
  var elementHtml = '>' + $el.html() + '<',
      regex = new RegExp('(\\>[^\\<]*' + queryWord + '([^\\<]*)\\<)', 'gi'),
      placeholderElement =
        "<span class='" + highlightedClassName + "'></span>";

  var match = regex.exec(elementHtml);

  while (match != null) {
    var replacedMatch = _replaceAll(match[0], queryWord, placeholderElement);
    elementHtml = elementHtml.replace(match[0], replacedMatch);
    match = regex.exec(elementHtml);
  }

  elementHtml =
    _replaceAll(
      elementHtml,
      placeholderElement,
      "<span class='" + highlightedClassName + "'>" + queryWord + "</span>"
    );

  $el.html(elementHtml.substring(1, elementHtml.length - 2));
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
