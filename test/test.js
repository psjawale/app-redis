var request = require('supertest');

describe('loading express', function() {
	var server;

	beforeEach(function() {
		server = require('../main')();
	});

	afterEach(function(done) {
		server.close(done);
	});

	it('Server should respond to a request', function testMain (done) {
		request("http://localhost:3001").get('/').expect(200, done);
	});

	// it('responds to /recent', function testRecent (done) {
	// 	request("http://localhost:3001").get('/recent').expect(200, done);
	// });

	// it('responds to /set', function testGet (done) {
	// 	request("http://localhost:3001").get('/set').expect(200, done);
	// });

	// it('should not respond to /random', function testNoResponse (done) {
	// 	request("http://localhost:3001").get('/random').expect(404, done);
	// });

})

