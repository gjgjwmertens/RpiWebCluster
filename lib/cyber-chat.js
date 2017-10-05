let cc = {
   wss: null,
   start: function () {
      this.wss = new require('ws').Server({port: 3030});
      this.wss.on('connection', function (ws) {
         ws.send('Welcome to cyber chat3');
         ws.on('message', function (msg) {
            if (msg == 'exit') {
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
