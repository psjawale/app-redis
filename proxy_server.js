var http = require('http');
var httpProxy = require('http-proxy');
var options = {}
var proxy  = httpProxy.createProxyServer(options)

var redis = require('redis');
var client = redis.createClient(6379, '162.243.204.67', {})

var request = 0;

var server = http.createServer(function(req, res) {
	client.get("alertKey", function(err,value){
		if(value == "false") {	
			if (request < 2) {
				request++;
				proxy.web(req, res, {target: 'http://54.213.155.181:3001'}, function(err, data) {
					console.log("Fetching request from production");
				});
			} else if (request == 2) {
				request = 0;
				proxy.web(req, res, {target: 'http://54.201.124.64:3001'}, function(err, data) {
					console.log("Fetching request from canary");
				});
			}
		} else {
			proxy.web(req, res, {target: 'http://54.213.155.181:3001'}, function(err, data) {
				console.log("Fetching request from production");
			});
		}
	});
});
server.listen(3000);