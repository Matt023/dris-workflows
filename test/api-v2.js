var assert = require('chai').assert;
var request = require('request');
var express = require('express');
var appRoutes = require('../app-routes');
var appConfig = require('../app-config');
var app = module.exports = express.createServer();

appConfig.configure(app);
appRoutes.createRoutes(app);
app.listen(7002);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

describe('APIv2 tests', function() {

	describe('GET /documents/collections', function() {
		it("should respond with a list with all the collections", function(done) {
			request({
				method : 'GET',
				uri : 'http://localhost:7000/documents/collections'
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '"type":"collection"');
				done();
			});
		});
	});
});
