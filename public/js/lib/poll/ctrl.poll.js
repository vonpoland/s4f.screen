import {getPoll, edit} from './service.poll';

export default class PollCtrl {
	constructor($state) {
        this.$state = $state;
		getPoll().then(poll => this.poll = poll);
	}

	edit(pollName, poll) {
        edit(pollName, poll)
        .then(() => this.$state.go('poll', { parent: 'tychy' }));
    }
}