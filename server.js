var express = require('express');
var config 	= require('./config.js');
var route 	= require('./router.js');
var server 	= express();

function start(server) {
	config(server);
	route(server);
	server.listen(8080);
	console.log('server started');
}

start(server);