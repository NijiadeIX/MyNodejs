var fs = require('fs');
var config = require(__dirname + '/config.json');

function commentModule(content, moduleName) {
	var ret = null;
	var commented = '<!--<load module="' + moduleName + '"/>-->';
	var uncommented = '<load module="' + moduleName + '"/>';

	if (content.indexOf(commented) == -1) {
		ret = content.replace(uncommented, commented);
	}

	return ret;
}

function uncommentModule(content, moduleName) {
	var ret = null;
	var commented = '<!--<load module="' + moduleName + '"/>-->';
	var uncommented = '<load module="' + moduleName + '"/>';

	if (content.indexOf(commented) != -1) {	
		ret = content.replace(commented, uncommented);
	}

	console.log(content);
	return ret;
}

function route(server) {
	server.route('/conf/autoload_configs/modules')
	.post(function(req, res) {
		if (!req.body || (!req.body.load && !req.body.unload)) {
			res.status(400).json({"message" : "input error"});
			return;
		}

		if (!config.path || !fs.existsSync(config.path)) {
			res.status(500).json({"message" : "no modules.conf.xml"});
			return;
		}

		fs.readFile(config.path + '/modules.conf.xml', {"encoding" : "utf8"}, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).json({"message" : "server error"});
				return;
			}	

			var dirty = false;
			if (req.body.load) {
				var loadList = req.body.load;
				if (loadList instanceof Array) {
					loadList.forEach(function(moduleName) {
						if (typeof(moduleName) == 'string') {
							var ret = uncommentModule(data, moduleName);
							if (ret) {
								data = ret;
								dirty = true;
							}
						}
					});
				}
			}

			if (req.body.unload) {
				var unloadList = req.body.unload;
				if (unloadList instanceof Array) {
					unloadList.forEach(function(moduleName) {
						if (typeof(moduleName) == 'string') {
							var ret = commentModule(data, moduleName);
							if (ret) {
								data = ret;
								dirty = true;
							}
						}
					});
				}
			}

			if (dirty) {
				fs.writeFile(config.path + '/modules.conf.xml', data, function(err) {
					if (err) {
						console.log(err);
						res.status(500).json({"message" : "modify fail"});
						return;
					}

					res.status(200).json({"result" : "success"});
					return;
				});
			} 
		});
	})

	
}

module.exports = route;