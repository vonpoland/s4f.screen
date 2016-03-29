import {calculcateSimplePollOptions} from '../stats/service';

class SimplePollController {
    constructor($element) {
        this.optionsOriginal = Object.assign({}, { options : this.options }).options;
        this.options.sort((a, b) => a.order - b.order);
        this.sorted = true;
        this.results = calculcateSimplePollOptions(this.options, this.stats);
        this.$element = $element;
    }

    get stats() {
        return this._stats;
    }

    set stats(data) {
        this._stats = data;

        if (this.sorted) {
            this.results = calculcateSimplePollOptions(this.options, this.stats);
        }
    }
}

export default class SimplePollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-between">
                <div class="container container-column container--vertical-center" ng-repeat="result in Poll.results">
                    <div style="height:80px;" class="container container--content-to-end">
                        <div class="ui-text--white poll__option poll__option--first container container--content-to-end container--center container--transition"
                        ng-style="{ height: result.percentageCss}">
                        <span class="font--big ui-text-shadow ui-text--white  radio-question__percentage">{{result.percentage}}</br>%</span>
                        </div>
                    </div>
                    <span class="font--big ui-text-shadow ui-text--white">{{result.displayName}}</span>
                </div>
            </div>`;
        this.scope = {
            options: '=',
            stats: '=',
            width: '@',
            height: '@'
        };
        this.controller = SimplePollController;
        this.bindToController = true;
        this.controllerAs = 'Poll';
        this.replace = true;
    }
}
