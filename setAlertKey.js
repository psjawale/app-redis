var redis = require('redis')
var client = redis.createClient(6379, '54.203.4.153', {})


client.set("alertKey", 'true', function(err,data){
	process.exit()
});