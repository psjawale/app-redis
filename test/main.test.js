var  request = require("request");
var  assert = require('assert');
var  http = require('http');


describe("hello world", function() {

  it('should return a 200 status code', function (done){
    http.get({ host: '0.0.0.0', port: 3001 }, function(res) {
      assert.deepEqual(res.statusCode, 200)
      done();
    }).on('error', function(e) {
      throw new Error(e);
    });
  });

})
