'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('config');
const logger = require('bigscreen-logger');
const bodyParser = require('body-parser');
const poll = require('./lib/poll/router');
const HttpStatus = require('http-status-codes');
const path = require('path');
const auth = require('./lib/auth/service');
const secure = require('./lib/auth/service').basicAuth;
require('./lib/channel/bootstrap').bootstrap(http);

auth.setupAuth(app);
app.use(bodyParser.json());
app.use('/api/poll', poll);
app.use('/img/users', express.static(path.join(__dirname, config.get('user.storePhotoPath'))));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/partials', express.static(__dirname + '/public/partials'));
app.use('/content/channel.html', function (req, res) {
	res.sendFile('/partials/channel.html', {root: __dirname + '/public'});
});

app.all('/projector/*', function (req, res) {
	res.sendFile(config.get('index.projector'), {root: __dirname + '/public'});
});

app.all('/admin/*', secure, function (req, res) {
	res.sendFile('partials/admin/index.html', {root: __dirname + '/public'});
});

app.all('/favicon.ico', function (req, res) {
	res.sendFile('favicon.ico', {root: __dirname + '/'});
});

app.all('*', function (req, res) {
	res.sendStatus(HttpStatus.BAD_REQUEST);
});

var server = http.listen(config.get('server.port'), function () {
	var host = server.address().address;
	var port = server.address().port;

	logger.info('Big-screen listening at http://%s:%s', host, port);
});