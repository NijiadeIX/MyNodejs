var fs = require('fs');
var path = require('path');

var routerDirName = 'router';

function route(server) {
	var dir = fs.readdirSync(__dirname + '/router');
	dir.forEach(function(dir) {
		var files = fs.readdirSync(__dirname + '/' + routerDirName + '/' + dir);
		files.forEach(function(file) {
			if (path.extname(file) == '.js') {
				try {
					require(__dirname + '/' + routerDirName + '/' + dir + '/' + file)(server);
				} catch (err) {
					console.log(err);
				}
			}
		});
	});
}

module.exports = route;