import {calculcateSimplePollOptions, updateResults} from '../stats/service';

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
            var results = calculcateSimplePollOptions(this.options, this.stats);
            updateResults(this.results, results);
        }
    }
}

export class SimplePollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-between">
                <div class="container container-column container--vertical-center simple-radio-question__container radio-question__container" ng-repeat="result in Poll.results">
                    <div style="height:80px;" class="container container--content-to-end ">
                        <div class="ui-text--white poll__option poll__option--first container container--content-to-end container--center container--transition"
                        ng-style="{ height: result.percentageCss}">
                        <span class="font--big ui-text-shadow ui-text--white radio-question__percentage">{{result.percentage}}</br>%</span>
                        </div>
                    </div>
                    <span class="font--big ui-text-shadow ui-text--white radio-question__displayName">{{result.displayName}}</span>
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

class ZuzelTorunPollController {
    constructor($element) {
        this.calculateOptions = () => calculcateSimplePollOptions(this.options, this.stats)
            .filter(result => result.percentage > 0)
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0,4);
        this.optionsOriginal = Object.assign({}, { options : this.options }).options;
        this.options.sort((a, b) => a.order - b.order);
        this.sorted = true;
        this.results = this.calculateOptions();
        this.$element = $element;
    }

    get stats() {
        return this._stats;
    }

    set stats(data) {
        this._stats = data;

        if (this.sorted) {
            this.results = this.calculateOptions();
        }
    }
}

export class ZuzelTorunPollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-around">
                <div class="container container-column"
                    ng-repeat="result in Poll.results">
                    <div class="container container-column radio-question__container">
                        <div class="ui-text--center"><img ng-src="{{'/projector/' + result.picture}}"/></div>
                        <div class="ui-text--white radio-question__displayName1 ui-text--center">{{result.firstName}}</div>
                        <div class="ui-text--white radio-question__displayName2 ui-text--center">{{result.lastName}}</div>
                    </div>
                    <div class="radio-question__percentage ui-text--center">{{result.percentage}}%</div>
                </div>
            </div>`;
        this.scope = {
            options: '=',
            stats: '=',
            width: '@',
            height: '@'
        };
        this.controller = ZuzelTorunPollController;
        this.bindToController = true;
        this.controllerAs = 'Poll';
        this.replace = true;
    }
}

export class DemoPollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-between">
                <div class="container container-column container--vertical-center radio-question__container" ng-repeat="result in Poll.results">
                    <div style="height:200px;" class="container container--content-to-end ">
                        <div class="ui-text--white poll__option poll__option--first container--transition"
                        ng-style="{ height: result.percentageCss}">
                        <div class="font--big ui-text--white radio-question__percentage ui-text--center ui-max-width">{{result.percentage}}%</div>
                        <div class="cool-gradient"></div>
                        <div class="font--big ui-text--white radio-question__displayName ui-text--center">{{result.displayName}}</div>
                        </div>
                    </div>
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
