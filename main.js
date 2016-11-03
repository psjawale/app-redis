var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var exec = require('child_process').exec;
var request = require("request");

var http = require('http')
var httpProxy = require('http-proxy')
var options = {}
var proxy  = httpProxy.createProxyServer(options)

var args = process.argv.slice(2);
var PORT = args[0];
port = 3010;

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{   
   	console.log(req.method, req.url);
    client.lpush("RecentQueue", req.url, function(err, reply) {
   // console.log(reply)
  })
    client.ltrim("RecentQueue", 0, 4);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/recent', function(req, res) {
  client.lrange("RecentQueue", 0, 4, function(err, message) {
      res.send(message);
      console.log(message);
  })
})

app.get('/', function(req, res) {
  res.send('hello world')
})

app.get('/set', function(req, res) { 
  var message = "this message will self-destruct in 10 seconds"
  client.set("key1", message);
  client.expire("key1", 10);
  var str = "Key1 was set with the value: 'this message will self-destruct in 10 seconds'"
  res.send(str);
})

app.get('/get',function(req, res){
	client.get("key1",function(err, value){
		console.log(value);
		res.send(value);	
	})
})


app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		//console.log(img);
	  		client.lpush('ImageQueue',img);
		});
	}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
	client.lpop("ImageQueue", function(err,imagedata)
    {
      if (err) throw err;
      res.writeHead(200, {'content-type':'text/html'});
      res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
      res.end();
    });
})

//Launch new server
// app.get('/spawn', function(req, res){
//   exec('forever start main.js '+port, function(err, out, code) 
//     {
//       console.log("attempting to launch new server");
//       if (err instanceof Error)
//            throw err;
//       if( err )
//         {
//           console.error( err );
//         }
//       var serverURL = "http://localhost:"+port;
//       port = port +1
//       console.log(serverURL)
//       client.lpush('ServersQueue',serverURL,function(err, reply) {
//         //console.log(reply)
//       })
//       var serverURL = "http://localhost:"+port;
//       var str = "Spawning new server at "+serverURL;
//       res.send(str)
//     });
// })

//Launch new server
app.get('/spawn', function(req, res){

	var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
    var serverURL = "http://localhost:"+port;
    client.lpush('ServersQueue',serverURL,function(err, reply) {
      //console.log(reply)
    })
    var str = "Spawning new server at "+serverURL;
    res.send(str)
	})
    port = port + 1
})

//Listing server
app.get('/listservers', function(req, res) {
  client.lrange('ServersQueue', 0, -1, function(err, message) {
      res.send(message);
      console.log(message);
  })
})

//Destroy Server
app.get('/destroy',function(req,res) {

  client.llen('ServersQueue',function(err,data1){
    if (data1 == 1){
       var str = "Server cannot be destroyed as only one server is running"
       console.log(str)
       res.send(str)
    }else {
      var randomPortIndex = Math.floor(Math.random()*data1)
      console.log(randomPortIndex)
      client.lindex('ServersQueue', randomPortIndex, function(err, data2) {
        console.log(data2)
        client.lrem('ServersQueue',0,data2,function(err,data3){
          var str = "Destroying server at "+data2;
          res.send(str)
      })
    })
    }
  })
}) 

//delete List
app.get('/deleteList', function(req, res) {
  client.del('ServersQueue',function(err,message){
    var str = "ServersQueue is now empty"
    res.send(str)
  })
})

//HTTP Server
var server = app.listen(PORT, function () {

  var host = server.address().address
  var port = server.address().port
  var serverURL = "http://localhost:"+port;
  //console.log(serverURL)
  client.lpush('ServersQueue',serverURL,function(err, reply) {})
  console.log('Example app listening at http://%s:%s', host, port)
})

//PROXY SERVER
//client.lpush(['serverPorts',3001,3002],function(){});	
var proxyServer = http.createServer(function(req, res) {

			client.rpoplpush('ServersQueue','ServersQueue',function(err,data){
        console.log("\nRequest routed to server: %s",data);

			  proxy.web(req, res, { target: data});
		});
	  
});
proxyServer.listen(3000);
