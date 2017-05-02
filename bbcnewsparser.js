// bbcnewsparser.js
var request,
	htmlparser = require('htmlparser2');

var NewsParser = function (request) {
	this.request = request;
};

NewsParser.prototype.parseMostReadArticles = function (callback) {
	this.request('http://www.bbc.co.uk/news/0', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			callback(parseMostReadArticlesFromHtml(body));
		} else {
			console.error(response, error);
			callback([]);
		}
	});
}

function parseMostReadArticlesFromHtml(html) {
	var parsedArticles = [],
		linkText = "",
		insideMostReadSection = false,
		insideHeadlineSection = false,
		tagCount = 0,
		parser = new htmlparser.Parser({
			onopentag: function (name, attribs) {
				if (name == "div" && attribs.class && attribs.class.includes("nw-c-most-read__items")) {
					insideMostReadSection = true;
				}
				if (insideMostReadSection) {
					tagCount++;
				}
				if (insideMostReadSection && name === "a") {
					insideHeadlineSection = true;
					parsedArticles.push(attribs.href);
				}

			},
			ontext: function (text) {
				if (insideHeadlineSection) {
					linkText = linkText + text;
				}
			},
			onclosetag: function (tagname) {
				if (insideMostReadSection) {
					tagCount--;
				}
				if (tagCount <= 0) {
					insideMostReadSection = false;
				}
				if (insideHeadlineSection && tagname === "a") {
					var url = parsedArticles.pop();
					parsedArticles.push({
						url: 'http://www.bbc.co.uk' + url,
						title: linkText.replace(/\s\s+/g, ' ').trim()
					});
					linkText = "";
					insideHeadlineSection = false;
				}
			}
		}, {
			decodeEntities: true
		});
	parser.write(html);
	parser.end();

	return parsedArticles;
}

module.exports = NewsParser;