var multiparty = require('multiparty');
var fs = require('fs');
function route(server) {
	//upload demo
	server.post('/script/upload', function(req, res, next) {
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files) {
			if (err) {
			    res.status(400).send('err');
			    return;
		    }
		    console.log(fields);
		    console.log(files);

		    fs.rename(files.file[0].path, './a.xml', function (err) {
		    	if (err) {
		    		console.log(err);
		    	} else {
		    		console.log('save file');
		    	}
		    })

		    res.status(200).send('ok');

		});
	});

};

module.exports = route;