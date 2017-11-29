let s = require('ws');
let cc = {
   wss: null,
   start: function (rpi) {
      this.wss = new s.Server({port: 55556});
      this.wss.on('connection', function (ws) {
         ws.send('Welcome to cyber chat on ' + rpi);
         ws.on('message', function (msg) {
            if (DEBUG) {
               console.log(msg);
            }
            if (msg === 'exit') {
               ws.send('Goodbye from ' + rpi); // send message to the client sending the message
               ws.close();           // close the connection with the client sending the message
            } else {
               cc.send(msg); // relay the message to all clients
            }
         })
      });
   },
   send: function (msg) {
      this.wss.clients.forEach(function each(client) {
         // console.log(client);
         client.send(msg);
      });
   }
};

module.exports = cc;
