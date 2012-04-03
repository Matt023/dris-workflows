var assert = require('chai').assert;
var request = require('request');

/**
 * Module dependencies.
 */
var express = require('express');
var appRoutes = require('../app-routes');
var appConfig = require('../app-config');
var app = module.exports = express.createServer();

appConfig.configure(app);
appRoutes.createRoutes(app);
app.listen(7000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

describe('My Server', function() {
	describe('GET /home', function() {
		it("should respond with the home site", function(done) {
			request('http://localhost:7000/home', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>DRIS Workflows</title>');
				done();
			});
		});
	});
	describe('GET /all', function() {
		it("should respond with the all site", function(done) {
			request('http://localhost:7000/all', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>All</title>');
				done();
			});
		});
	});
	describe('GET /create', function() {
		it("should respond with the create site", function(done) {
			request('http://localhost:7000/create', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>Create</title>');
				done();
			});
		});
	});
	describe('GET /edit', function() {
		it("should respond with the edit site", function(done) {
			request('http://localhost:7000/edit', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>Edit</title>');
				done();
			});
		});
	});
	describe('GET /admin', function() {
		it("should respond with the admin site", function(done) {
			request('http://localhost:7000/admin', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'Admin - DRIS Workflows</title>');
				done();
			});
		});
	});
	describe('POST /object/:type/:id/:command', function() {
		it("should respond with the create site", function(done) {
			request({
				method:'POST',
				uri: 'http://localhost:7000/object/collection/c/post',
				body: '{"Title":"RoutesAutobot"}'
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'create');
				done();
			});
		});
	});
});
