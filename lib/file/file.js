'use strict';

const fs = require('fs');

function uploadFile(req, res, callback) {
	res.setTimeout(0);

	var dataUrl = req.body.picture;
	var buffer = new Buffer(dataUrl.split(",")[1], 'base64');
	fs.writeFileSync('uploads/data.png', buffer);

	callback();
}

exports.uploadFile = uploadFile;