describe("NewsParser", function() {
  var NewsParser = require("../../bbcnewsparser.js");  
    
  describe("parseMostReadArticles", function() {
	it("known body, returns expected result", function(done) {
	  // arrange 
	  var requestWithKnownValidResponse = function(url, callback) {
		var error = null,
		  response = { statusCode: 200 },
		  body = `
              <div id="comp-most-popular-page" class="most-popular-page">
                  <h1 class="most-popular-page__title">Most Read</h1>
                  <ul class="most-popular-page__list">
                      <li class="most-popular-page-list-item">
                          <a href="/news/uk-38663322" class="most-popular-page-list-item__link">
                              <span class="most-popular-page-list-item__rank">1</span>
                              <span class="most-popular-page-list-item__headline">'Wheelchair v buggy': Disabled man wins Supreme Court case</span>
                          </a>
                      </li>
                      <li class="most-popular-page-list-item">
                          <a href="/news/uk-england-38663331" class="most-popular-page-list-item__link">
                              <span class="most-popular-page-list-item__rank">2</span>
                              <span class="most-popular-page-list-item__headline">Southern rail 'full service' to resume next week</span>
                          </a>
                      </li>
                      <li class="most-popular-page-list-item">
                          <a href="/news/world-us-canada-38656271" class="most-popular-page-list-item__link">
                              <span class="most-popular-page-list-item__rank">3</span>
                              <span class="most-popular-page-list-item__headline">Trump inauguration boycott escalates</span>
                          </a>
                      </li>
                  </ul>
              </div>
		  `;
		callback(error, response, body);
	  }
	  
	  var newsParser = new NewsParser(requestWithKnownValidResponse);
	  
	  // act
	  newsParser.parseMostReadArticles(function(result) {
		  
		// assert
  		expect(result.length).toEqual(3);
		expect(result[0].url).toEqual("http://www.bbc.co.uk/news/uk-38663322");
		expect(result[0].title).toEqual("'Wheelchair v buggy': Disabled man wins Supreme Court case");
		expect(result[1].url).toEqual("http://www.bbc.co.uk/news/uk-england-38663331");
		expect(result[1].title).toEqual("Southern rail 'full service' to resume next week");
		expect(result[2].url).toEqual("http://www.bbc.co.uk/news/world-us-canada-38656271");
		expect(result[2].title).toEqual("Trump inauguration boycott escalates");
		done();
	  });
    });  
	
    it("response with ampersand, returns expected result", function(done) {
	  // arrange 
	  var requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle = function(url, callback) {
		var error = null,
		  response = { statusCode: 200 },
		  body = `
              <div id="comp-most-popular-page" class="most-popular-page">
                  <h1 class="most-popular-page__title">Most Read</h1>
                  <ul class="most-popular-page__list">
                      <li class="most-popular-page-list-item">
                          <a href="/news/blogs-the-papers-38565081" class="most-popular-page-list-item__link">
                              <span class="most-popular-page-list-item__rank">1</span>
                              <span class="most-popular-page-list-item__headline">Newspaper headlines: 'Broken' A&E and Streep takes on Trump</span>
                          </a>
                      </li>
                  </ul>
              </div>
		  `;
		callback(error, response, body);
	  }
	  
	  var newsParser = new NewsParser(requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle);
	  
	  // act
	  newsParser.parseMostReadArticles(function(result) {
		  
		// assert
  		expect(result.length).toEqual(1);
		expect(result[0].url).toEqual("http://www.bbc.co.uk/news/blogs-the-papers-38565081");
		expect(result[0].title).toEqual("Newspaper headlines: 'Broken' A&E and Streep takes on Trump");
		done();
	  });
    }); 
	
    it("bad status code, returns empty array", function(done) {
	  // arrange 
	  var requestThatAlwaysReturnsBadStatusCode = function(url, callback) {
		var error = null,
		  response = { statusCode: 500 },
		  body = "";
		callback(error, response, body);
	  }
	  
	  var newsParser = new NewsParser(requestThatAlwaysReturnsBadStatusCode);
	  
	  // act
	  newsParser.parseMostReadArticles(function(result) {  
		  
		// assert
  		expect(result).toEqual([]);
		done();
	  });
    }); 
  });
});