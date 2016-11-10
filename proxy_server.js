var http = require('http');
var httpProxy = require('http-proxy');
var options = {}
var proxy  = httpProxy.createProxyServer(options)
var fs = require('fs');
var redis = require('redis');
var client = redis.createClient(6379, '162.243.204.67', {})

var request = 0;


var server = http.createServer(function(req, res) {
	client.get("alertKey", function(err,value){
		if(value == "false") {	
			if (request < 2) {
				request++;
				proxy.web(req, res, {target: "http://162.243.204.67:3020"}, function(err, data) {});
			} else if (request == 2) {
				client.rpoplpush('CanaryQueue','CanaryQueue',function(err,canaryUrl){
        			console.log("\nRequest routed to canary server: %s",canaryUrl);
        			proxy.web(req, res, {target: canaryUrl}, function(err, data) {}); 
				});
				request = 0;				
			}
		} else {
			proxy.web(req, res, {target: "http://162.243.204.67:3020"}, function(err, data) {});
		}
	});
});
server.listen(3010);

var server = http.createServer(function(req, res) {
	client.rpoplpush('ProductionQueue','ProductionQueue',function(err,data){
    console.log("\nRequest routed to production server: %s",data);
    proxy.web(req, res, { target: data});
	});
});
server.listen(3020);