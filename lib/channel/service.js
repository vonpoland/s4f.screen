const SocketClient = require('socket.io-client');
const channelUrl = require('config').bigscreenChannel;
const socketClient = new SocketClient(channelUrl);

exports.getIo = function() {
    return socketClient;
};