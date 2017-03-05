/**
 * Created by G on 4-3-2017.
 */

// Basic websocket code
var ws = new WebSocket('ws://20.0.0.108:3030');

ws.onopen = function () {
   $('#websocket_conn_status_container_id').removeClass('websocket-not-connected');
   $('#websocket_conn_status_container_id').addClass('websocket-connected');
};

ws.onclose = function () {
   $('#websocket_conn_status_container_id').removeClass('websocket-connected');
   $('#websocket_conn_status_container_id').addClass('websocket-not-connected');
};

ws.onmessage = function (payload) {
   var data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      // updateStatus(data);
      console.log('index.js::ws.onmessage:object: ' + data);
   } else {
      console.log('index.js::ws.onmessage: ' + data);
   }
};

$(function () {
   console.log('Index loaded');

   $('#ws_close_btn_id').on('click', function (e) {
      ws.send('exit');
   });

   $('#test_api_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'test',
         value: 150
      }, updateCommandFeedback);
   });

});


function updateCommandFeedback(data) {
   console.log({location: 'index.js::updateCommandFeedback (data): ', msg: data});
   $('#command_feedback_field_id').text(data.msg);
}
