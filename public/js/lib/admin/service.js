import {getComponent} from '../di';

export function changeScreen(key, stay) {
	const restangular = getComponent('restangular');
	const stateParams = getComponent('stateParams');

	return restangular.one('api/poll/' + stateParams.id + '/screen').post(key , {
		stay: stay
	});
}

export function lotWinner() {
	const restangular = getComponent('restangular');
	const stateParams = getComponent('stateParams');

	return restangular.one('api/poll/' + stateParams.id + '/winner').post();
}