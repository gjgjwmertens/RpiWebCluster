let cc = {
   wss: null,
   start: function (rpi) {
      this.wss = new require('ws').Server({port: 3030});
      this.wss.on('connection', function (ws) {
         ws.send('Welcome to cyber chat on ' + rpi + '\r\n');
         ws.on('message', function (msg) {
            if (msg == 'exit') {
               ws.send('Goodbye from ' + rpi);
               ws.close();
            } else {
               this.send(msg);
            }
         })
      });
   },
   send: function (msg) {
      this.wss.clients.forEach(function each(client) {
         client.send(msg);
      });
   }
};

module.exports = cc;
