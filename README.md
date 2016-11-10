# HW #3 Proxies, Queues, Cache Fluency

### Setup



* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379

### Files
1. main.js  
   main.js is the main program which takes a port number as input.  
   Initially, an app server listens at the given input port number.  
   Run it as:  **node main.js 3001**
2. package.json
   npm install will install all the required dependencies for the main.js program listed in the package.json file.   
3. img  
   This folder has images which are used in the demo.

### Implementation:

#### Part 1 : set/get
/set sets a new key with the value "this message will self-destruct in 10 seconds"  
Key expires in 10 seconds.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/set.png "Set")  

/get fetches the value of the key and sends it to the client.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/get.png "Get")

#### Part 2 : recent 
/recent stores the most recent 5 sites visited, and returns that to the client.  

![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/recent2.png "recent 2")  
command line:  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/recent1.png "recent 1")


#### Part 3 : upload/meow
/upload stores all the uploaded images in a queue.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/upload.png "upload")  

/meow displays the most recent image to the client and removes the image from the queue.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/meow.png "meow")

#### Part 4 : spawn  
/spawn creates a new app server running on a new port and stores the new app server URL in a list.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/spawn2.png "spawn 2")  

![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/spawn1.png "spawn 1")  

#### Part  5: destroy
/destroy selects a random server from the list of available server and removes it from the list and server is not used to handle any requests.  
If only one server is available in the list of active servers then this server cannot be destroyed.  
![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/destroy.png "destroy")  

#### Part  6: listservers  
All the available servers are stored in redis queue.  
/listservers displays all the servers in this queue.  

![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/listservers.png "listserver") 


#### Part 7 : proxy server
Requests made on the proxy server port is uniformly distributed among all the available servers in a round robin fashion.  

![Alt](https://github.ncsu.edu/psjawale/HW3/blob/master/screenshots/proxy server.png "proxy")

### Screencast :
YouTube [link](https://youtu.be/g3Qnl5Jk0JQ)
