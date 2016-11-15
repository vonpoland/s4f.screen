'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('config');
const logger = require('bigscreen-logger');
const bodyParser = require('body-parser');
const poll = require('./lib/poll/router');
const HttpStatus = require('http-status-codes');;
const staticFiles = require('./lib/static/router');

app.use(bodyParser.json());
app.use('/api/poll', poll);
app.use('/', staticFiles);
app.all('*', function (req, res) {
	res.sendFile(config.get('index.projector'), {root: __dirname + '/public'});
});

app.all('/favicon.ico', function (req, res) {
	res.sendFile('favicon.ico', {root: __dirname + '/'});
});


var server = http.listen(config.get('server.port'), function () {
	var host = server.address().address;
	var port = server.address().port;

	logger.info('Big-screen listening at http://%s:%s', host, port);
});