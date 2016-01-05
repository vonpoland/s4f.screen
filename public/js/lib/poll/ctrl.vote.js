import {vote, register, voted, addLocalVote} from './service.poll';
import facebook from '../auth/facebook.service';

export default class VotePollCtrl {
	constructor($state, $scope) {
		this.$scope = $scope;
		this.id = $state.params.id;
		this.phase = voted(this.id) ? 'voteRegistered' : 'vote';
	}

	vote(pollId, option) {
		vote(pollId, option).then((result) => {
			this.phase = 'voteDone';
			this.lastVoteId = result.voteId;
		});
	}

	registerVote(pollId, voteId) {
		facebook
			.login()
			.then(register.bind(null, pollId, voteId))
			.then(poll => {
				this.phase = 'voteRegistered';
				addLocalVote(poll);
				this.$scope.$digest();
			})
			.then(() => {},
				error => {
				console.info(error);
			});
	}
}