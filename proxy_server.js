var http = require('http');
var httpProxy = require('http-proxy');
var options = {}
var proxy  = httpProxy.createProxyServer(options)

var redis = require('redis');
var client = redis.createClient(6379, '162.243.204.67', {})

var request = 0;
var prodUrl = ""
var canaryUrl = ""

var server = http.createServer(function(req, res) {
	client.get("alertKey", function(err,value){
		if(value == "false") {	
			if (request < 2) {
				request++;
				proxy.web(req, res, {target: prodUrl}, function(err, data) {});
			} else if (request == 2) {
				request = 0;
				proxy.web(req, res, {target: canaryUrl}, function(err, data) {});
			}
		} else {
			proxy.web(req, res, {target: prodUrl}, function(err, data) {});
		}
	});
});
server.listen(3000);