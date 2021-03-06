//function makeServer() {
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var cookieParser = require('cookie-parser');
var fs      = require('fs')
var app = express()
var exec = require('child_process').exec;
var request = require("request");

var http = require('http')
var httpProxy = require('http-proxy')
var options = {}
var proxy  = httpProxy.createProxyServer(options)

var router = express.Router();
// REDIS
var client = redis.createClient(6379, '54.187.14.98', {})
app.use(cookieParser());

var port = 3010;

app.use(function (req, res, next) {
  var cookie = req.headers.cookie;
  if (cookie == undefined)
  {
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie("cookieName",randomNumber, { maxAge: 900000, httpOnly: true });
    client.lpush('cookies','cookieName='+randomNumber)
    // console.log('cookie set')
  } 
  else
  {
    client.lrange('cookies', 0, -1, function(err, message) {
    })
    console.log('cookie exists', cookie);
  } 
  next();
});



router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next(); 
});

// home page route (http://localhost:8080)
router.get('/login/:name', function(req, res) {
    var start = Date.now();
    client.set(req.params.name,start);
    res.send('Hello ' + req.params.name + '!'+' You are logged in to variant B website');
  //  res.send('im the login page!');  
});

// about page route (http://localhost:8080/about)
router.get('/logout/:name', function(req, res) {
    //res.send('im the logout page!'); 
    var end = Date.now();
    client.get(req.params.name,function(err,data){
    var spent = end-data;
    client.set(req.params.name,spent);
    client.get('current_server',function(err,data){
        client.incrby(data,spent);
    })
    res.send('Bye ' + req.params.name + '!' +" Time spent: "+spent);
  }); 
});

// apply the routes to our application
app.use('/', router);


// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{   
   	console.log(req.method, req.url);
    client.lpush("RecentQueue", req.url, function(err, reply) {
    //console.log(reply)
  })
   client.ltrim("RecentQueue", 0, 4);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/recent', function(req, res) {
  client.get("featureflag",function(err, value){
    if(value === 'true'){
        client.lrange("RecentQueue", 0, 4, function(err, message) {
        res.send(message);
        console.log(message);
        })
    }
    else
    {
        var str = "This feature is not yet available";
        res.send(str);
    }
  })
})

// app.get('/', function(req, res) {
//   res.send('variant B')
// })

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
var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port
  var serverURL = "http://localhost:3001";
  //console.log(serverURL)
 // client.lpush('ProductionQueue',serverURL,function(err, reply) {})
  console.log('Example app listening at http://%s:%s', host, port)
})
