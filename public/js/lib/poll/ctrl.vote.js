import {vote, register, voted, addLocalVote, saveLastVote, getLastVote} from './service.poll';
import facebook from '../auth/facebook.service';

function isFromLoginRedirect($location) {
	var accessToken = /access_token=(.+)&/;
	var tokens = $location.hash().match(accessToken);

	return tokens && tokens.length === 2;
}

export default class VotePollCtrl {
	constructor($state, $scope, $location) {
		this.$scope = $scope;
		this.id = $state.params.id;
		var lastVote = getLastVote();

		if (lastVote && isFromLoginRedirect($location)) {
			var off = facebook.pubSub.onAuthChange(() => {
				this
					.registerVote(lastVote.poll, lastVote.vote)
					.then(() => {},
						() => {
							this.phase = 'vote';
							$scope.$digest();
						});
				off();
			});
		} else {
			this.phase = voted(this.id) ? 'voteRegistered' : 'vote';
		}
	}

	vote(pollName, option) {
		vote(pollName, option)
			.then(() => {
				this.phase = 'voteDone';
				saveLastVote(pollName, option);
			});
	}

	registerVote(pollName, vote) {
		facebook
			.login()
			.then(register.bind(null, pollName, vote))
			.then(() => {
				this.phase = 'voteRegistered';
				addLocalVote({name: pollName});
				this.$scope.$digest();
			})
			.then(() => {
				},
				error => {
					console.info(error);
				});
	}
}