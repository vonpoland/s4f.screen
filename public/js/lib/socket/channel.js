import IO from 'socket.io-client';
import {pollPubSub} from '../poll/service.poll';

let socket = null;

export default function bootstrapSocketChannel() {
    socket = new IO();

    socket.on('chat', (msg) => {
        console.info(msg);
    });

    socket.on('vote', statistics => {
        console.info(statistics);
        pollPubSub.voted(statistics);
    });

    window.send = function(msg) {
        socket.emit('vote', msg);
    };
}

