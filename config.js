var bodyParser = require('body-parser');
var express = require('express');

function errorsHandler(err, req, res, next) {
	switch (err.name) {
		case 'SyntaxError':
			res.status(err.status).json({"message" : "syntax error"});
			break;
		default:
			res.status(500).json({"message" : "server go mad"});

	}
};

function config(server) {
	server.use('/conf', bodyParser.json());
	server.use(express.static(__dirname + '/test'));
	//errors handle
	server.use(errorsHandler);
};

module.exports = config;