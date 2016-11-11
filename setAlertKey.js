var redis = require('redis')
var client = redis.createClient(6379, '54.203.4.153', {})


client.set("canaryAlertKey", 'true', function(err,data){
	process.exit()
});
