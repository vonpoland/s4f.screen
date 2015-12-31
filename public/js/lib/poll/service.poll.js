import PubSub from '../patterns/pubsub';
import {getComponent} from '../di';

const STEP_TIMEOUT = 5000;

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
var cache = {};

export function getPoll(id = null) {
	const stateParams = getComponent('stateParams');
	const restangular = getComponent('restangular');

	id = id || stateParams.id;
	var cached = cache[id];

	if (false && cached) {
		console.info('cached', cached)
		return cached;
	} else {
		console.info('not cached')
		cache[id] = restangular.one('api/poll/' + (id || stateParams.id)).get();
		return cache[id];
	}
}

export function goToNextStep($state, params, options = {}) {
	const timeout = getComponent('timeout');
	timeout(() => $state.go('pollStep', params), options.timeout || STEP_TIMEOUT);
}
export function vote(option) {
	const stateParams = getComponent('stateParams');
	const restangular = getComponent('restangular');
	var id = stateParams.id;

	return restangular.one('api/poll/' + id + '/vote/' + option).post();
}