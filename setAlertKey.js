var redis = require('redis')

var client = redis.createClient(6379, '162.243.204.67', {})

client.set('alertKey', 'true',function(err, value){
	process.exit()
});