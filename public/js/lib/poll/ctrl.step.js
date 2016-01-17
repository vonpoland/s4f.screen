import {getPoll, goToNextStep, pollPubSub, cancelNextStep} from './service.poll';

export default class StepCtrl {
	constructor($scope, $stateParams, $state, $location) {
		getPoll(null, !$location.search().stay)
			.then(poll =>  this.poll = poll)
			.then(() => {
				let step = this.poll.data.stepTemplates[$stateParams.step];
				let pollId = $stateParams.id;
				this.template = step.template;

				if ($location.search().stay) {
					return;
				}

				this.goToNextStep = goToNextStep($state, {
					id: pollId,
					step: step.next
				}, {
					timeout: step.timeout
				});
			});

		var changeScreenOff = pollPubSub.onChangeScreen(step => {
			cancelNextStep(this.goToNextStep);
			goToNextStep($state, {
				id: $stateParams.id,
				step: step.screen,
				stay: step.stay
			}, {
				timeout: 1
			});
			$scope.$digest();
		});

		$scope.$on('$destroy', () => {
			this.poll = null;
			this.template = null;
			changeScreenOff();
		});
	}
}