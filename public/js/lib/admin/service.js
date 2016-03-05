import {getComponent} from '../di';

export function changeScreen(parent, pollName, step, stay = false) {
	const restangular = getComponent('restangular');

	return restangular.one('api/poll/' + parent).post('screen', { pollName: pollName, step: step, stay: stay});
}

export function lotWinner() {
	const restangular = getComponent('restangular');
	const stateParams = getComponent('stateParams');

	return restangular.one('api/poll/' + stateParams.id + '/winner').post();
}