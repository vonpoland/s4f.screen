import {getPoll} from './service.poll';

export default class PollCtrl {
	constructor($state) {
        this.$state = $state;
		getPoll().then(poll => this.poll = poll);
	}
}