require('./helpers');
let st = require('./server-test');
let runStIntVal = null;
let runCtIntVal = null;
let cc = null;
let serverList = [
   'AZ005.fmg.uva.nl',
   'webserver1.fmg.uva.nl',
   'webserver2.fmg.uva.nl',
   'webserver6.fmg.uva.nl',
   'webserver12.fmg.uva.nl',
   'webserver13.fmg.uva.nl'
];
let cluster = '145.18.151.162';

// async function rst(srv) {
//    let result = await st.runServerTest(srv);
//    return 'Server tested: ' + srv + ' with result: ' +  result;
// };

// function testServers() {
//    serverList.forEach((server) => {
//       let t = [server, Date.now()];
//       cc.send('\n' + new Date().formattedTime() + ' Starting test on ' + server);
//       st.runServerTest(server).then((r) => {
//          if (DEBUG) {
//             console.log(r);
//          }
//          cc.send('\n' + new Date().formattedTime() +
//                  ' Result from server test: \r\n             ' + r +
//                  '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
//       }, (e) => {
//          cc.send('\n' + new Date().formattedTime() +
//                  ' Result from server test: \r\n             ' + e +
//                  '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
//       });
//       // cc.send('\n' + new Date().formattedTime() + ' Server test on ' + server + ' ended.');
//    });
// }


let tstManager = {
   processWsCommand: (obj) => {
      // console.info(obj);
      if (obj.command) {
         switch(obj.command) {
            case 'serverTest':
               tstManager.testCluster(obj.ws);
               break;
         }
         // postCommand(obj);
      }
   },
   testCluster: (cc) => {
      let server = cluster;
      let t = [server, Date.now()];
      cc.send(new Date().formattedTime() + ' ' + config.rpi + ' starting test on ' + server);
      st.runServerTest(server).then((r) => {
         cc.send(new Date().formattedTime() +
                 ' Result from server test on ' + config.rpi + ': \r\n             ' + r +
                 '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
      }, (e) => {
         cc.send(new Date().formattedTime() +
                 ' Result from server test on \' + config.rpi + \': \r\n             ' + e +
                 '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
      });
   }

};

module.exports = tstManager;