import {getPoll, getActiveByParent, goToNextStep, pollPubSub, cancelNextStep, setPollOptions, getStep} from './service.poll';
import bootstrapSocketChannel from '../socket/channel';
import TimeMaster from 'screen4fans-time-master';
import moment from 'moment';

var timeMaster = new TimeMaster();

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
                checkInteractionStatus(this.poll, params => {
                    cancelNextStep(this.goToNextStep);
                    goToNextStep($state, params, { timeout: 1 }); // timeout 1 go immediately
                });
			});

		var changeScreenOff = pollPubSub.onChangeScreen(step => {
			cancelNextStep(this.goToNextStep);
			goToNextStep($state, step, { timeout: 1 }); // timeout 1 go immediately
			$scope.$digest();
		});

		$scope.$on('$destroy', () => {
			this.poll = null;
			this.template = null;
            timeMaster.clear();
			changeScreenOff();
		});
	}
}

function checkInteractionStatus(currentInteraction, handleStepChange) {
    let finishDate = moment(currentInteraction.editable.finishDate);

    timeMaster.addEvent(TimeMaster.createEvent('pollEvent', finishDate, () => {
        getActiveByParent(currentInteraction.parent)
            .then(interactions => {
                if(interactions.some(interaction => interaction.id === currentInteraction.id) || interactions.length == 0) {
                    return;
                }

                handleStepChange({
                    pollName: interactions[0].name,
                    step: ''
                });
            })
    }));
}