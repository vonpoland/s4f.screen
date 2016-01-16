import {pollPubSub, calculate, getPoll} from './service.poll';

function getPollResults(data) {
	return calculate({
		id: this.pollClass,
		option: this.option,
		orientation: this.orientation
	}, data);
}

export default class PollClassDirective {
	constructor() {
		this.scope = {
			pollClass: '@',
			option: '@'
		};
	}

	link(scope, element) {
		var last = null;
		var circle = element.find('[apply-results]');
		var showResults = (result) => {
			if(last) {
				circle.removeClass(last);
			}

			last = 'p' + result.percentage;
			circle.addClass(last);
		};

		getPoll()
			.then(getPollResults.bind(scope))
			.then(showResults);
		var off = pollPubSub.onVoted(data => {
			showResults(getPollResults.bind(scope)(data));
		});

		scope.$on('$destroy', () =>  off());
	}
}