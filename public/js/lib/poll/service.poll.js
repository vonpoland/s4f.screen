import PubSub from '../patterns/pubsub';
import {getComponent} from '../di';
import {getLocal, saveLocal} from '../storage/storage';

const STEP_TIMEOUT = 5000;
var cache = {};

class PollPubSub extends PubSub {
	static get VOTED() {
		return 'on_voted';
	}

	static get CHANGE_SCREEN() {
		return 'on_change_screen';
	}

	static get NEW_PARTICIPANT() {
		return 'on_newParticipant';
	}

	onVoted(callback) {
		return this.on(PollPubSub.VOTED, callback);
	}

	onChangeScreen(callback) {
		return this.on(PollPubSub.CHANGE_SCREEN, callback);
	}

	onNewParticipant(callback) {
		return this.on(PollPubSub.NEW_PARTICIPANT, callback);
	}

	voted(data) {
		this.emit(PollPubSub.VOTED, data);
	}

	changeScreen(data) {
		this.emit(PollPubSub.CHANGE_SCREEN, data);
	}

	newParticipant(data) {
		this.emit(PollPubSub.NEW_PARTICIPANT, data);
	}

}

export const pollPubSub = new PollPubSub();

pollPubSub.onVoted(data => {
	cache[data.id] =  Promise.resolve(data);
});

export function calculate(options, poll) {
	if (poll.name !== options.id) {
		return null;
	}

	var horizontalOrientation = options.orientation === 'horizontal';
	var current = poll.data.votes[options.option] || 0;
	var keys = Object.keys(poll.data.votes);
	var all = keys.reduce((sum, next) => {
		sum += poll.data.votes[next];

		return sum;
	}, 0);

	var percentage = (current / all) * 100;
	var display = Math.round(percentage);

	percentage = isNaN(percentage) ? '0%' : percentage + '%';
	display = isNaN(display) ? '0%' : display + '%';

	return {
		percentageWidth: horizontalOrientation ? percentage : 'auto',
		percentageHeight: !horizontalOrientation ? percentage : 'auto',
		display: display
	};
}

export function getPoll(id = null, cacheOk = false) {
	const stateParams = getComponent('stateParams');
	const restangular = getComponent('restangular');

	id = id || stateParams.id;
	var cached = cache[id];

	if (cacheOk && cached) {
		return cached;
	} else {
		cache[id] = restangular.one('api/poll/' + (id || stateParams.id)).get();
		return cache[id];
	}
}

export function goToNextStep($state, params, options = {}) {
	if(!params.step) {
		return;
	}

	const timeout = getComponent('timeout');
	return timeout(() => $state.go('pollStep', params), options.timeout || STEP_TIMEOUT);
}

export function vote(pollId, option) {
	const restangular = getComponent('restangular');

	return restangular.one('api/poll/' + pollId + '/vote/' + option).post();
}

export function register(pollName, tempVoteId, accessToken) {
	const restangular = getComponent('restangular');

	return restangular.one('api/poll/' + pollName + '/register/' + tempVoteId + '?access_token=' + accessToken).post();
}

export function voted(pollName) {
	var users = getLocal('users');
	var user = getLocal('lastUserId');

	if(!users || !user || !user.userId) {
		return false;
	}

	var userVotes = users[user.userId] || [];

	return userVotes.indexOf(pollName) >= 0;
}

export function addLocalVote(poll) {
	var users = getLocal('users');
	var user = getLocal('lastUserId');

	if(!user) {
		return;
	}

	if(!users) {
		users = {};
		users[user.userId] = [];
	}

	users[user.userId].push(poll.name);

	saveLocal('users', users);
}

export function cancelNextStep(step) {
	if(!step) {
		return;
	}

	const timeout = getComponent('timeout');

	timeout.cancel(step);
}

export function getParticipants() {
	const stateParams = getComponent('stateParams');
	const restangular = getComponent('restangular');

	return restangular.all('api/poll/' + stateParams.id + '/participants').getList();
}