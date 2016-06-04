import {pollPubSub} from './service.poll';
import {calculateStats} from '../stats/service';

export default class VoteResultCtrl {
	constructor($scope, $stateParams) {
		var off = pollPubSub.onVoted(data => {
			return;
            if(data.poll.name !== $stateParams.pollName) {
                return;
            }

			this.stats = calculateStats(data.poll);
			this.statsEmpty = Object.keys(this.stats).length < 2;
			$scope.$digest();
		});

		$scope.$on('$destroy', () => off());
	}

	initStats(poll) {
		this.stats = calculateStats(poll);
		this.statsEmpty = Object.keys(this.stats).length < 2;
	}
}