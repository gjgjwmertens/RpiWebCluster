require('./helpers');
let st = require('./server-test');
let serverList = [
   // 'AZ005.fmg.uva.nl',
   // 'webserver1.fmg.uva.nl',
   // 'webserver2.fmg.uva.nl',
   // 'webserver6.fmg.uva.nl',
   // 'webserver11.fmg.uva.nl',
   // 'webserver12.fmg.uva.nl',
   'webserver13.fmg.uva.nl'
];
let cluster = '145.18.151.162';

let tstManager = {
   runStIntVal: null,
   runCtIntVal: null,
   processWsCommand: (obj) => {
      // console.info(obj);
      if (obj.command) {
         switch(obj.command) {
            case 'serverTest':
               tstManager.testServers(obj.ws);
               break;
            case 'clusterTest':
               tstManager.testCluster(obj.ws);
               break;
         }
         // postCommand(obj);
      }
   },
   testServers: (cc) => {
      serverList.forEach((server) => {
         let t = [server, Date.now()];
         cc.send(new Date().formattedTime() + ' ' + config.rpi + ' ***************' +
                 '\n\tStarting testServers on ' + server);
         st.runServerTest(server).then((r) => {
            if (DEBUG) {
               console.log(r);
            }
            cc.send(new Date().formattedTime() + ' ' + config.rpi + ' ***************' +
                    '\n\tResult from testServers:' +
                    '\n\t' + r +
                    '\n\t' + t[0] + ' took ' + (Date.now() - t[1]));
         }, (e) => {
            cc.send(new Date().formattedTime() + ' ' + config.rpi + ' ***************' +
                    '\n\tError from testServers:' +
                    '\n\t' + e +
                    '\n\t' + t[0] + ' took ' + (Date.now() - t[1]));
         });
         // cc.send('\n' + new Date().formattedTime() + ' Server test on ' + server + ' ended.');
      });
   },
   testCluster: (cc) => {
      let server = cluster;
      let t = [server, Date.now()];
      cc.send(new Date().formattedTime() + ' ' + config.rpi + ' starting testCluster on ' + server);
      st.runServerTest(server).then((r) => {
         if (DEBUG) {
            console.log(r);
         }
         cc.send(new Date().formattedTime() + ' ' + config.rpi + ' ***************' +
                 '\n\tResult from testCluster:' +
                 '\n\t' + r +
                 '\n\t' + t[0] + ' took ' + (Date.now() - t[1]));
      }, (e) => {
         cc.send(new Date().formattedTime() + ' ' + config.rpi + ' ***************' +
                 '\n\tError from testCluster:' +
                 '\n\t' + e +
                 '\n\t' + t[0] + ' took ' + (Date.now() - t[1]));
      });
   }

};

module.exports = tstManager;