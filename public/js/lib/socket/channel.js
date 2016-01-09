import IO from 'socket.io-client';
import {pollPubSub} from '../poll/service.poll';

let socket = null;

export default function bootstrapSocketChannel() {
    socket = new IO();

    socket.on('vote', pollPubSub.voted.bind(pollPubSub));
    socket.on('changeScreen', pollPubSub.changeScreen.bind(pollPubSub));
	socket.on('newParticipant', pollPubSub.newParticipant.bind(pollPubSub));

}

