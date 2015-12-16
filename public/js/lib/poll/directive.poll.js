import {pollPubSub, calculate, getPoll} from './service.poll';

function getPollResults(data) {
    var result = calculate(this.poll, this.options, data);
    if(result) {
        this.result = result;
    }
}

export default class PollDirective {
    constructor() {
        this.template = '<div class="poll" ng-style="{height: result.percentage}"><div class="padding-horizontal--small padding-vertical--small ui-text--center">{{result.display}}</div></div>';
        this.scope = {
            poll: '@',
            options: '@'
        };
        this.replace = true;
    }

    link(scope) {
        getPoll().then(getPollResults.bind(scope));

        scope.percentage = '0%';
        var off = pollPubSub.onVoted(data => {
            getPollResults.bind(scope)(data);
            scope.$digest();
        });

        scope.$on('$destroy', () => off());
    }
}