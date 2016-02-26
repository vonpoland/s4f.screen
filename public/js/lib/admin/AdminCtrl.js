import {getPoll} from '../poll/service.poll';
import {changeScreen, lotWinner} from './service';

export default class AdminCtrl {
	constructor() {
		getPoll().then(poll => this.poll = poll);
	}

	changeScreen(screen, stay) {
		this.saving = true;
		changeScreen(screen, stay)
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