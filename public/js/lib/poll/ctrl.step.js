import {getPoll, goToNextStep, pollPubSub, cancelNextStep} from './service.poll';
import bootstrapSocketChannel from '../socket/channel';

export default class StepCtrl {
	constructor($scope, $stateParams, $state) {
		bootstrapSocketChannel($stateParams.parent);
		getPoll(null, $stateParams.stay !== 'true')
			.then(poll => this.poll = poll)
			.then(() => {
				let step = this.poll.data.stepTemplates[$stateParams.step];
				this.template = step.template;

				if ($stateParams.stay === 'true') {
					return;
				}

				this.goToNextStep = goToNextStep($state, step.next, { timeout: step.timeout });
			});

		var changeScreenOff = pollPubSub.onChangeScreen(step => {
			cancelNextStep(this.goToNextStep);
			goToNextStep($state, step, { timeout: 1 });
			$scope.$digest();
		});

		$scope.$on('$destroy', () => {
			this.poll = null;
			this.template = null;
			changeScreenOff();
		});
	}
}