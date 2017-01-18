// vergeparser.js
var request,
htmlparser = require('htmlparser2');

var NewsParser = function (request) {
	this.request = request;
};

NewsParser.prototype.parseMostReadArticles = function (callback) {
  this.request('http://www.bbc.co.uk/news/popular/read', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	callback(parseMostReadArticlesFromHtml(body));
      }
	  else {
		console.error(response, error);
        callback([]);
	  }
    });
}

function parseMostReadArticlesFromHtml(html) {
	var parsedArticles = [],
	linkText = "",
	insideHeadlineTag = false,
	parser = new htmlparser.Parser({
   		onopentag: function(name, attribs){
       		if(name === "a" && attribs.class === "most-popular-page-list-item__link"){
          			parsedArticles.push(attribs.href);
       		}
			if (name == "span" && attribs.class === "most-popular-page-list-item__headline") {
				insideHeadlineTag = true;	
			}
   		},
   		ontext: function(text){
			if (insideHeadlineTag) {
				linkText = linkText + text;
			}
   		},
   		onclosetag: function(tagname){
			if (insideHeadlineTag && tagname === "span") {
				var url = parsedArticles.pop();
				parsedArticles.push({ url: 'http://www.bbc.co.uk' + url, title: linkText.replace(/\s\s+/g, ' ').trim() });
				linkText = "";
				insideHeadlineTag = false;
			}	
       	}
	}, {decodeEntities: true});
	parser.write(html);
	parser.end();

	return parsedArticles;
}

module.exports = NewsParser;
