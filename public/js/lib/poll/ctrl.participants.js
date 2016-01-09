import {getParticipants, pollPubSub} from './service.poll';

export default class ParticipantsCtrl {
	constructor($scope) {
		getParticipants()
			.then(participants => {
				this.users = participants;
			}, () => {
				this.votes = [];
			});

		pollPubSub.onNewParticipant(participant => {
			var user = this.users.filter(user => user._id === participant._id).pop();

			if (!user) {
				this.users.push(participant);
				$scope.$digest();
			}
		});
	}
}