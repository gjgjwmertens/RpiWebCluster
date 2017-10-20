/**
 * Created by G on 4-3-2017.
 */

// Basic websocket code
var ws = new WebSocket('ws://20.0.0.108:3030');
var ws2 = null;
var wsList = {
   'Rpi_003': 'ws://20.0.0.103:3030',
   'Rpi_004': 'ws://20.0.0.104:3030',
   'Rpi_005': 'ws://20.0.0.105:3030',
   'Rpi_007': 'ws://20.0.0.107:3030',
   'Rpi_008': 'ws://20.0.0.108:3030',
   'Rpi_009': 'ws://20.0.0.109:3030',
   'Rpi_010': 'ws://20.0.0.110:3030',
   'Rpi_011': 'ws://20.0.0.111:3030',
}

function processWsMessage(data) {
   $('#websocket_message_field_id').append(data + '\r\n');
   $('#websocket_message_container_id').animate(
      {scrollTop: (
         $('#websocket_message_container_id')[0].scrollHeight -
         $('#websocket_message_container_id')[0].clientHeight
      )}, 1000);
}

function processWsObject(obj) {
   console.info(obj);
   if(obj.command) {
      postCommand(obj);
   }
}

function processWs2Message(data) {
   $('#websocket_2_message_field_id').append(data + '\r\n');
   $('#websocket_2_message_container_id').animate(
      {scrollTop: (
         $('#websocket_2_message_container_id')[0].scrollHeight -
         $('#websocket_2_message_container_id')[0].clientHeight
      )}, 1000);
}

ws.onopen = function () {
   $('#websocket_status_led_id').removeClass('websocket-not-connected');
   $('#websocket_status_led_id').addClass('websocket-connected');
};

ws.onclose = function () {
   $('#websocket_status_led_id').removeClass('websocket-connected');
   $('#websocket_status_led_id').addClass('websocket-not-connected');
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
      // processWsObject(data);
      processWsMessage(data.at + ' Got command: ' + data.command + ' from ' + data.rpi);
      console.log('index.js::ws.onmessage:object: ' + data);
   } else {
      processWsMessage(data);
      console.log('index.js::ws.onmessage: ' + data);
   }
};

function wsOnOpen () {
   $('#websocket_2_status_led_id').removeClass('websocket-not-connected');
   $('#websocket_2_status_led_id').addClass('websocket-connected');
};

function wsOnClose () {
   $('#websocket_2_status_led_id').removeClass('websocket-connected');
   $('#websocket_2_status_led_id').addClass('websocket-not-connected');
};

function wsOnMessage (payload) {
   var data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      // processWs2Object(data);
      processWs2Message(data.toString());
      console.log('index.js::ws.onmessage:object: ' + data);
   } else {
      processWs2Message(data);
      console.log('index.js::ws.onmessage: ' + data);
   }
};

function postCommand(cmd) {
   $.post('api', cmd, updateCommandFeedback);

}

$(function () {
   console.log('Index loaded');

   $('#ws_close_btn_id').on('click', function (e) {
      ws.send('exit');
   });

   Object.keys(wsList).forEach((key) => {
      let mnu_item = $('<a class="ws-conn-select dropdown-item" href="#" data-conn="' +
                       wsList[key] + '">' + key + '</a>');
      mnu_item.insertBefore($('#websocket_conn_dropdown_divider_id'));
   });

   $('.ws-conn-select').on('click', (e) => {
      console.log($(e.target).data('conn'));
      if(ws2) {
         ws2.send('exit');
      }
      ws2 = new WebSocket($(e.target).data('conn'));
      ws2.onopen = wsOnOpen;
      ws2.onclose = wsOnClose;
      ws2.onmessage = wsOnMessage;
   });

   $('.api-btn').on('click', e => {
      // console.log($(e.target).data('api-cmd'));
      postCommand({
         command: $(e.target).data('api-cmd'),
         value: 150
      });
   })

});


function updateCommandFeedback(data) {
   console.log({location: 'index.js::updateCommandFeedback (data): ', msg: data});
   $('#command_feedback_field_id').text(data.msg);
}
