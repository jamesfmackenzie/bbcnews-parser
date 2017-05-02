describe("NewsParser", function () {
	var NewsParser = require("../../bbcnewsparser.js");

	describe("parseMostReadArticles", function () {
		it("known body, returns expected result", function (done) {
			// arrange 
			var requestWithKnownValidResponse = function (url, callback) {
				var error = null,
					response = {
						statusCode: 200
					},
					body = `
<div class="nw-c-most-read__items gel-layout gel-layout--no-flex">
    <ol class="gel-layout__item">
        <li data-entityid="most-popular-read-1" class="gel-layout__item gs-o-faux-block-link gs-u-mb+ gel-1/2@m gel-1/5@xxl gs-u-float-left@m gs-u-clear-left@m gs-u-float-none@xxl"><span class="gs-o-media"><span class="nw-c-most-read__rank gs-o-media__img gel-canon gel-1/12@xs gel-1/8@m gel-1/10@l gel-2/12@xxl gs-u-align-center">1</span>
            <a class="gs-c-promo-heading nw-o-link gs-o-bullet__text gs-o-faux-block-link__overlay-link gel-pica-bold gs-u-pl-@xs gs-o-media__body"
                href="/news/uk-39779256"><span class="gs-c-promo-heading__title gel-pica-bold">Madeleine questioning shocked suspect</span></a>
            </span>
        </li>
        <li data-entityid="most-popular-read-2" class="gel-layout__item gs-o-faux-block-link gs-u-mb+ gel-1/2@m gel-1/5@xxl gs-u-float-left@m gs-u-clear-left@m gs-u-float-none@xxl"><span class="gs-o-media"><span class="nw-c-most-read__rank gs-o-media__img gel-canon gel-1/12@xs gel-1/8@m gel-1/10@l gel-2/12@xxl gs-u-align-center">2</span>
            <a class="gs-c-promo-heading nw-o-link gs-o-bullet__text gs-o-faux-block-link__overlay-link gel-pica-bold gs-u-pl-@xs gs-o-media__body"
                href="/news/uk-39781013"><span class="gs-c-promo-heading__title gel-pica-bold">Six on trial over topless duchess photos</span></a>
            </span>
        </li>
        <li data-entityid="most-popular-read-3" class="gel-layout__item gs-o-faux-block-link gs-u-mb+ gel-1/2@m gel-1/5@xxl gs-u-float-left@m gs-u-clear-left@m gs-u-float-none@xxl"><span class="gs-o-media"><span class="nw-c-most-read__rank gs-o-media__img gel-canon gel-1/12@xs gel-1/8@m gel-1/10@l gel-2/12@xxl gs-u-align-center">3</span>
            <a class="gs-c-promo-heading nw-o-link gs-o-bullet__text gs-o-faux-block-link__overlay-link gel-pica-bold gs-u-pl-@xs gs-o-media__body"
                href="/news/uk-politics-39784170"><span class="gs-c-promo-heading__title gel-pica-bold">PM: I&#x27;ll be bloody difficult to Juncker</span></a>
            </span>
        </li>
    </ol>
</div>
		  `;
				callback(error, response, body);
			}

			var newsParser = new NewsParser(requestWithKnownValidResponse);

			// act
			newsParser.parseMostReadArticles(function (result) {

				// assert
				expect(result.length).toEqual(3);
				expect(result[0].url).toEqual("http://www.bbc.co.uk/news/uk-39779256");
				expect(result[0].title).toEqual("Madeleine questioning shocked suspect");
				expect(result[1].url).toEqual("http://www.bbc.co.uk/news/uk-39781013");
				expect(result[1].title).toEqual("Six on trial over topless duchess photos");
				expect(result[2].url).toEqual("http://www.bbc.co.uk/news/uk-politics-39784170");
				expect(result[2].title).toEqual("PM: I'll be bloody difficult to Juncker");
				done();
			});
		});

		it("response with ampersand, returns expected result", function (done) {
			// arrange 
			var requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle = function (url, callback) {
				var error = null,
					response = {
						statusCode: 200
					},
					body = `
<div class="nw-c-most-read__items gel-layout gel-layout--no-flex">
    <ol class="gel-layout__item">
        <li data-entityid="most-popular-read-1" class="gel-layout__item gs-o-faux-block-link gs-u-mb+ gel-1/2@m gel-1/5@xxl gs-u-float-left@m gs-u-clear-left@m gs-u-float-none@xxl"><span class="gs-o-media"><span class="nw-c-most-read__rank gs-o-media__img gel-canon gel-1/12@xs gel-1/8@m gel-1/10@l gel-2/12@xxl gs-u-align-center">1</span>
            <a class="gs-c-promo-heading nw-o-link gs-o-bullet__text gs-o-faux-block-link__overlay-link gel-pica-bold gs-u-pl-@xs gs-o-media__body"
                href="/news/blogs-the-papers-38565081"><span class="gs-c-promo-heading__title gel-pica-bold">Newspaper headlines: 'Broken' A&E and Streep takes on Trump</span></a>
            </span>
        </li>      
    </ol>
</div>
		  `;
				callback(error, response, body);
			}

			var newsParser = new NewsParser(requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle);

			// act
			newsParser.parseMostReadArticles(function (result) {

				// assert
				expect(result.length).toEqual(1);
				expect(result[0].url).toEqual("http://www.bbc.co.uk/news/blogs-the-papers-38565081");
				expect(result[0].title).toEqual("Newspaper headlines: 'Broken' A&E and Streep takes on Trump");
				done();
			});
		});

		it("bad status code, returns empty array", function (done) {
			// arrange 
			var requestThatAlwaysReturnsBadStatusCode = function (url, callback) {
				var error = null,
					response = {
						statusCode: 500
					},
					body = "";
				callback(error, response, body);
			}

			var newsParser = new NewsParser(requestThatAlwaysReturnsBadStatusCode);

			// act
			newsParser.parseMostReadArticles(function (result) {

				// assert
				expect(result).toEqual([]);
				done();
			});
		});
	});
});