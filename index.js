const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('config');
const logger = require('./lib/logger/logger');

app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/public'});
});

var server = http.listen(config.get('server.port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    logger.log('Bootstrap-app listening at http://%s:%s', host, port);
});
