import {getPoll, goToNextStep, pollPubSub, cancelNextStep, setPollOptions, getStep} from './service.poll';
import bootstrapSocketChannel from '../socket/channel';

export default class StepCtrl {
	constructor($scope, $stateParams, $state) {
		bootstrapSocketChannel($stateParams.parent);
		getPoll()
			.then(poll => this.poll = poll)
			.then(() => {
				setPollOptions(this.poll);
                let step = getStep(this.poll, $stateParams.step);
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