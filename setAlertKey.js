var redis = require('redis')
var client = redis.createClient(6379, '54.245.30.181', {})


client.set("alertKey", 'true', function(err,data){
	process.exit()
});