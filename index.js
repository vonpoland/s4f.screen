'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('config');
const logger = require('./lib/logger/logger');
const io = require('socket.io')(http);
const pollService = require('./lib/poll/service');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');

app.use(bodyParser.json());
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/partials', express.static(__dirname + '/public/partials'));
app.post('/api/poll/:id/vote/:option', (req, res) => {
    var pollId = req.params.id;
    var option = req.params.option;

    pollService.add({
        user: {
            id: Math.round(Math.random() * 1000)
        },
        id: pollId,
        vote: {
            option: option
        }
    }, err => {
        if (err) {
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        pollService.statistics(pollId, (err, data) => {
            if (err) {
                return;
            }

            io.emit('vote', data);
        });

        res.sendStatus(HttpStatus.OK);
    });
});
app.get('/api/poll/:id', (req, res) => {
    var pollId = req.params.id;
    pollService.statistics(pollId, (err, data) => {
        if (err) {
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.json(data);
    });
});

app.all('/*', function (req, res) {
    res.sendFile('index.html', {root: __dirname + '/public'});
});

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat', msg);
    });
});

var server = http.listen(config.get('server.port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    logger.info('Bootstrap-app listening at http://%s:%s', host, port);
});
