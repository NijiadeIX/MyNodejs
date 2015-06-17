var net = require('net');
var config = require(__dirname + '/config.json');


function apiProxy(command, callback) {
	var _command = command + '\n\n';
	var socket = net.connect(config.port, config.host);
	socket.setEncoding('utf8');

	socket.on('data', function(data) {
		if (data == 'Content-Type: auth/request\n\n') {
			socket.write('auth ' + config.auth + '\n\n');
		} else if (data == 'Content-Type: command/reply\nReply-Text: +OK accepted\n\n') {
			socket.write(_command);
		} else {
			console.log(data);
			callback(data);
			socket.destroy();
		}
	});
};


module.exports = apiProxy;