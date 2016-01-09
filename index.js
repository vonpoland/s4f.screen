'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('config');
const logger = require('./lib/logger/logger');
const bodyParser = require('body-parser');
const poll = require('./lib/poll/router');

require('./lib/channel/bootstrap').bootstrap(http);
require('./lib/auth/auth').setupPassport(app);

app.use(bodyParser.json());
app.use('/api/poll', poll);
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/partials', express.static(__dirname + '/public/partials'));
app.use('/content/channel.html', function (req, res) {
	res.sendFile('/partials/channel.html', {root: __dirname + '/public'});
});

app.all('/projector/*', function (req, res) {
	res.sendFile('index-projector.html', {root: __dirname + '/public'});
});

app.all('/admin/*', function (req, res) {
	res.sendFile('partials/admin/index.html', {root: __dirname + '/public'});
});

app.all('*', function (req, res) {
	res.sendFile('index.html', {root: __dirname + '/public'});
});

var server = http.listen(config.get('server.port'), function () {
	var host = server.address().address;
	var port = server.address().port;

	logger.info('Bootstrap-app listening at http://%s:%s', host, port);
});