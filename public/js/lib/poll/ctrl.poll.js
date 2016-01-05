import {getPoll} from './service.poll';

export default class PollCtrl {
	constructor() {
		getPoll().then(poll => this.poll = poll);
	}
}