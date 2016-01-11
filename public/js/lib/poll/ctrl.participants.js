import {getParticipants, pollPubSub} from './service.poll';

export default class ParticipantsCtrl {
	constructor($scope) {
		getParticipants()
			.then(participants => {
				this.users = participants.slice(0, 3);
			}, () => {
				this.votes = [];
			});

		pollPubSub.onNewParticipant(participant => {
			var user = this.users.filter(user => user._id === participant._id).pop();

			if (!user) {
				if(this.users.length >= 3) {
					this.users.pop();
				}

				this.users.push(participant);
				$scope.$digest();
			}
		});
	}
}