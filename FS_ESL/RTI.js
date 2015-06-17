var net = require('net');
var config = require(__dirname + '/config.json');

//RTI means  freeswitch real-time information
var RTI = {
	socket : null,
	eventHandlers : {},
	state : 'closed'
}

/**
 * start RTI object
 * @return {[type]} [description]
 */
function start() {
	RTI.socket = net.connect(config.port, config.host);
	RTI.socket.setEncoding('utf8');
	RTI.state = 'auth';
	console.log(RTI.socket);

	RTI.socket.on('data', dataHandler);
}

/**
 * stop RTI object
 * @return {[type]} [description]
 */
function stop() {
	if (RTI.socket && RTI.socket.destroy) {
		RTI.socket.destroy();
	}
}

/**
 * add event handler
 * @param  {string} eventName [description]
 * @param  {function} handler   [description]
 * @return {[type]}           [description]
 */
function onEvent(eventName, handler) {
	if (typeof eventName == 'string' && eventName != '') {
		if (!RIT.eventHandlers[event]) {
			RIT.eventHandlers[event] = [];
		}
		RIT.eventHandlers[event].append(handler);
	}
}


function dataHandler(data) {
	var event = eventParser(data);

	switch(RTI.state) {
		case 'auth': authStateHandler(event); break;
		case 'work' : workStateHandler(event); break;
	}
}

function eventParser(data) {
	var event = {};
	data = data.replace(/(^\n*)|(\n*$)/g, '');
	var lines = data.split('\n');
	console.log(lines);
	lines.forEach(function(line) {
		console.log(line);
		var words = line.split(':');
		console.log(words);
		if (words[0] && words[1]) {
			var key = words[0].replace(/(^\s*)|(\s*$)/g, '');
			var value = words[1].replace(/(^\s*)|(\s*$)/g, '');
			if (key != '')
			{
				event[key] = value;
			}
		}
	});

	return event;
}


function authStateHandler(event) {
	if (event['Content-Type']) {
		if(event['Content-Type'] == 'auth/request') {
			console.log('try to login');
			login();
		} else if (event['Content-Type'] == 'command/reply') {
			if (event['Reply-Text'] && event['Reply-Text'] == '+OK accepted') {
				console.log('login success');
				subscribe();
				RTI.state = 'work';
			}
		}
	}
}

function login() {
	if (RTI.socket) {
		var authStr = 'auth ' + config.auth + '\n\n';
		RTI.socket.write(authStr);
	}
}

function subscribe() {
	if (RTI.socket) {
		RTI.socket.write('event plain CHANNEL_CREATE CHANNEL_ANSWER CHANNEL_DESTROY\n\n');
	}
}


function workStateHandler(event) {
	if (event['Event-Name']) {
		var eventName = event['Event-Name'];
		var handlerList = RTI.eventHandlers[eventName];
		if (handlerList) {
			handlerList.forEach(function(handler) {
				handler(event);
			});
		}
	}
}



module.exports.start = start;
module.exports.stop = stop;
module.exports.onEvent = onEvent;