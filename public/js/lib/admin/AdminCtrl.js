import {getPolls} from '../poll/service.poll';
import {changeScreen, lotWinner} from './service';

export default class AdminCtrl {
	constructor($stateParams) {
		this.parent = $stateParams.parent;
		getPolls($stateParams.parent).then(polls => this.polls = polls);
	}

	changeScreen(screen, stay) {
		this.saving = true;
		changeScreen(this.parent, this.pollName, screen, stay)
			.then(() => this.saving = false);
	}

	lotWinner() {
		this.winnerLot = true;
		lotWinner()
		.then(winner =>  {
			this.poll.winner = winner;
			this.winnerLot = false;
		});
	}
}