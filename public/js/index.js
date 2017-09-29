/**
 * Created by G on 4-3-2017.
 */

// Basic websocket code
var ws = new WebSocket('ws://20.0.0.108:3030');

function processWsMessage(data) {
   $('#websocket_message_field_id').append(data);
   $('#websocket_message_container_id').animate(
      {scrollTop: (
         $('#websocket_message_container_id')[0].scrollHeight -
         $('#websocket_message_container_id')[0].clientHeight
      )}, 1000);
}

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
      processWsObject(data);
      console.log('index.js::ws.onmessage:object: ' + data);
   } else {
      processWsMessage(data);
      console.log('index.js::ws.onmessage: ' + data);
   }
};

$(function () {
   console.log('Index loaded');

   $('#ws_close_btn_id').on('click', function (e) {
      ws.send('exit');
   });

   $('.api-btn').on('click', e => {
      // console.log($(e.target).data('api-cmd'));
      $.post('api', {
         command: $(e.target).data('api-cmd'),
         value: 150
      }, updateCommandFeedback);
   })

});


function updateCommandFeedback(data) {
   console.log({location: 'index.js::updateCommandFeedback (data): ', msg: data});
   $('#command_feedback_field_id').text(data.msg);
}
