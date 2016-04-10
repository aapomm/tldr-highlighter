var highlightedClassName = 'tldr-highlighter-plugin-highlighted-word';

self.port.on('highlight-text', function(queryWord){
  var unallowedElements = 'script',
      $elements = $('body').children().not(unallowedElements).withinviewport();

  $elements.each(function(){
    clearHighlight($(this));

    highlightElement($(this), queryWord);
  });
});

var highlightElement = function($el, queryWord){
  var elementHtml = $el.html();

  if (elementHtml.indexOf(queryWord) < 0) return 'continue';

  elementHtml =
    replaceAll(
      elementHtml,
      queryWord,
      "<span class='" + highlightedClassName + "'>" + queryWord + "</span>"
    );

  $el.html(elementHtml);
};

var clearHighlight = function($el){
  var elementHtml = $el.html(),
      regex = new RegExp('<span class="' + highlightedClassName + '">([\\s\\S]+?)</span>');

  console.log(elementHtml);

  var match = regex.exec(elementHtml);
  while (match != null) {
    console.log(match);
    elementHtml = elementHtml.replace(match[0], match[1]);
    console.log(elementHtml);
    match = regex.exec(elementHtml);
  }

  $el.html(elementHtml);
};


var replaceAll = function(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
};
