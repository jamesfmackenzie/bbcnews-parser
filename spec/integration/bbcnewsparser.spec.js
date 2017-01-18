describe("NewsParser", function() {
  var request = require("request"),
  NewsParser = require("../../bbcnewsparser.js");  
  
  describe("parseMostReadArticles", function() {
	it("returns expected results", function(done) {
	  // arrange 
	  var newsParser = new NewsParser(request);
	  
	  // act
	  newsParser.parseMostReadArticles(function(result) {
		console.log(result);  
		  
		// assert
  		expect(result.length).toBeGreaterThan(0);
		for (var i = 0; i < result.length; i++) {
		  var singleResult = result[i];
		  expect(singleResult.url).toEqual(jasmine.any(String));
		  expect(singleResult.title).toEqual(jasmine.any(String));
        }
		done();
	  });
    });  
  });
});