import {calculateStats, pollPubSub} from './service.poll';

export default class VoteResultCtrl {
	constructor($scope) {
		var off = pollPubSub.onVoted(data => {
			console.info('pubsub');
			this.initStats(data);
			$scope.$digest();
		});

		$scope.$on('$destroy', () => off());
	}

	initStats(poll) {
		this.stats = calculateStats(poll);
	}
}