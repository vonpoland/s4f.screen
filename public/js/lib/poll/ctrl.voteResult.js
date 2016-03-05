import {calculateStats, pollPubSub} from './service.poll';

export default class VoteResultCtrl {
	constructor($scope) {
		var off = pollPubSub.onVoted(data => {
			this.stats = calculateStats(data.poll);
			$scope.$digest();
		});

		$scope.$on('$destroy', () => off());
	}

	initStats(poll) {
		this.stats = calculateStats(poll);
	}
}