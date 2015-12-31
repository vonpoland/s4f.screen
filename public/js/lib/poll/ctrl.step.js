import {getPoll, goToNextStep} from './service.poll';

export default class StepCtrl {
	constructor($scope, $stateParams, $state, $location) {
		getPoll()
			.then(poll =>  this.poll = poll)
			.then(() => {
				let step = this.poll.stepTemplates[$stateParams.step];
				let pollId = $stateParams.id;

				this.template = step.template;

				if($location.search().skip) {
					return;
				}
				goToNextStep($state, {
					id: pollId,
					step: step.next
				}, {
					timeout: step.timeout
				});
			});

		$scope.$on('$destroy', () => {
			this.poll = null;
			this.template = null;
			console.info('destroy!!!!')
		})
	}
}