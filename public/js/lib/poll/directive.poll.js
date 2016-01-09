import {pollPubSub, calculate, getPoll} from './service.poll';

function getPollResults(data) {
    var result = calculate({
	    id: this.poll,
	    option: this.option,
	    orientation: this.orientation
    }, data);

    if(result) {
        this.result = result;
    }
}

export default class PollDirective {
    constructor() {
        this.template = '<div class="poll" ng-style="{height: result.percentageHeight, width: result.percentageWidth}"><div class="poll_result__text"><span ng-transclude></span>{{result.display}}</div></div>';
        this.transclude = true;
        this.scope = {
            poll: '@',
            option: '@',
	        orientation: '@'
        };
        this.replace = true;
    }

    link(scope) {
        getPoll().then(getPollResults.bind(scope));

        var off = pollPubSub.onVoted(data => {
            getPollResults.bind(scope)(data);
            scope.$digest();
        });

        scope.$on('$destroy', () =>  off());
    }
}