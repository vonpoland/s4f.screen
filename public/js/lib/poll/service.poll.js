import PubSub from '../patterns/pubsub';
import {getComponent} from '../di';
import {getLocal, saveLocal} from '../storage/storage';

const STEP_TIMEOUT = 5000;
var cache = {};

class PollPubSub extends PubSub {
	static get VOTED() {
		return 'on_voted';
	}

	onVoted(callback) {
		return this.on(PollPubSub.VOTED, callback);
	}

	voted(data) {
		this.emit(PollPubSub.VOTED, data);
	}
}

export const pollPubSub = new PollPubSub();

pollPubSub.onVoted(data => {
	cache[data.id] =  Promise.resolve(data);
});

export function calculate(options, data) {
	if (data.id !== options.id) {
		return null;
	}

	var horizontalOrientation = options.orientation === 'horizontal';
	var current = data.votes[options.option] || 0;
	var keys = Object.keys(data.votes);
	var all = keys.reduce((sum, next) => {
		sum += data.votes[next];

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

export function getPoll(id = null) {
	const stateParams = getComponent('stateParams');
	const restangular = getComponent('restangular');

	id = id || stateParams.id;
	var cached = cache[id];

	if (false && cached) {
		return cached;
	} else {
		cache[id] = restangular.one('api/poll/' + (id || stateParams.id)).get();
		return cache[id];
	}
}

export function goToNextStep($state, params, options = {}) {
	const timeout = getComponent('timeout');
	timeout(() => $state.go('pollStep', params), options.timeout || STEP_TIMEOUT);
}

export function vote(pollId, option) {
	const restangular = getComponent('restangular');

	return restangular.one('api/poll/' + pollId + '/vote/' + option).post();
}

export function register(pollId, tempVoteId, accessToken) {
	const restangular = getComponent('restangular');

	return restangular.one('api/poll/' + pollId + '/register/' + tempVoteId + '?access_token=' + accessToken).post();
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

	if(!users) {
		users = {};
		users[user.userId] = [];
	}

	users[user.userId].push(poll.name);

	saveLocal('users', users);
}