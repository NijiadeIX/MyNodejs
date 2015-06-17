var multiparty = require('multiparty');
var fs = require('fs');
var config = require(__dirname + '/config.json');

function route(server) {
	//upload demo
	server.route('/scripts/:filename')
	.post(function(req, res) {
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files) {
			if (err) {
			    res.status(400).json({"message" : "can not get file"});
			    return;
		    }

		    if (!files || files.file[0].originalFilename == '') {
		    	res.status(400).json({"message" : "file is null"});
		    	return;
		    }

		    var filename = req.param('filename');
		    var path = config.path + '/scripts/' + filename;  
		    fs.rename(files.file[0].path, path, function (err) {
		    	if (err) {
		    		console.log(err);
		    	} else {
		    		console.log('save file');
		    	}
		    })

		    res.status(200).json({"message" : "success"});

		});
	})
	.get(function(req, res) {
		var filename = req.param('filename');
		var path = config.path + '/scripts/' + filename;
		debugger;
		if (fs.existsSync(path)) {
			fs.readFile(path, {encoding : "utf8"}, function(err, data) {
				if (err) {
					res.status(500).json({"message" : "can not read file"});
					return;
				}

				res.status(200).json({"file_content" : data});
				return;
			});
		} else {
			res.status(400).json({"message" : "file not exists"});
			return;
		}
	})
	.delete(function(req, res) {
		var filename = req.param('filename');
		var path = config.path + '/scripts/' + filename;
		if (fs.existsSync(path)) {
			fs.unlink(path, function(err) {
				if (err) {
					res.status(500).json({"message" : "del file fail"});
					return;
				}

				res.status(200).json({"result" : "success"});
				return;
			});
		} else {
			res.status(400).json({"message" : "file not exists"});
			return;
		}
	});

};

module.exports = route;