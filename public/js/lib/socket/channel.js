import IO from 'socket.io-client';
import {pollPubSub} from '../poll/service.poll';

let socket = null;

export default function bootstrapSocketChannel(pollId) {
	if(socket !== null) {
		return;
	}
    socket = IO.connect(window.conf.socketChannel);

    socket.on(pollId + ':vote', pollPubSub.voted.bind(pollPubSub));
    socket.on(pollId + ':changeScreen', pollPubSub.changeScreen.bind(pollPubSub));
	socket.on(pollId + ':newParticipant', pollPubSub.newParticipant.bind(pollPubSub));
}

