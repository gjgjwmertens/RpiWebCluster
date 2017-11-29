let http = require('http');
let port = 55554;
//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World3!'); //write a response to the client
  res.end(); //end the response
})
.listen(port) //the server object listens on port 8080
.on('listening', function(e) {
	console.log('Listening on port ' + port);
});