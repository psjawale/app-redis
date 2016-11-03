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
   
3. img  
   This folder has images which are used in the demo.

### Implementation:

#### Part 1 : set/get
/set sets a new key with the value "this message will self-destruct in 10 seconds"  
Key expires in 10 seconds.  
/get fetches the value of the key and sends it to the client.

#### Part 2 : recent 
/recent stores the most recent 5 sites visited, and returns that to the client.

#### Part 3 : upload/meow
/upload stores all the uploaded images in a queue.  
/meow displays the most recent image to the client and removes the image from the queue.

#### Part 6 :

#### Part 7 : Proxy server
Uniformly delivers request to all available servers.





