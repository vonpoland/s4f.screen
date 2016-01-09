import {vote, register, voted, addLocalVote} from './service.poll';
import facebook from '../auth/facebook.service';

export default class VotePollCtrl {
	constructor($state, $scope) {
		this.$scope = $scope;
		this.id = $state.params.id;
		this.phase = voted(this.id) ? 'voteRegistered' : 'vote';
	}

	vote(pollName, option) {
		vote(pollName, option).then(() => this.phase = 'voteDone');
	}

	registerVote(pollName, vote) {
		facebook
			.login()
			.then(register.bind(null, pollName, vote))
			.then(() => {
				this.phase = 'voteRegistered';
				addLocalVote({ name : pollName});
				this.$scope.$digest();
			})
			.then(() => {},
				error => {
				console.info(error);
			});
	}
}