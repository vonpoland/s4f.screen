import {calculcateSimplePollOptions, updateResults, calculcateDifference} from '../stats/service';

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
            calculcateDifference(this.results, results).forEach(this.rotate.bind(this));
            updateResults(this.results, results);
        }
    }

    rotate(index) {
        var element = angular.element(document.querySelectorAll('.animation')[index]);

        if (element.hasClass('animation--rotate')) {
            element.removeClass('animation--rotate');
        } else {
            element.addClass('animation--rotate');
        }
    }
}

export class SimplePollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-between">
                <div class="container container-column container--vertical-center simple-radio-question__container radio-question__container" ng-repeat="result in Poll.results">
                    <div style="height:80px;" class="container container--content-to-end ">
                        <div class="ui-text--white poll__option poll__option--first container container--content-to-end container--center"
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

export class SluzewiecQuestionPollDirective extends SimplePollDirective {
    constructor() {
        super();
        this.template = `<div class="simple-radio-question__container ">
                <div class="radio-question__container" ng-repeat="result in Poll.results">
                    <div class="radio-question__percentage">{{result.percentage}}<span class="percentage">%</span></div>
                    <div class="radio-question__displayName animation"><span class="text">{{result.displayName}}</span></div>
                </div>
            </div>`;
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

    rotate(index) {
        var element = angular.element(document.querySelectorAll('.animation')[index]);

        if (element.hasClass('animation--rotate')) {
            element.removeClass('animation--rotate');
        } else {
            element.addClass('animation--rotate');
        }
    }

    set stats(data) {
        this._stats = data;

        if (this.sorted) {
            var results = this.calculateOptions();
            calculcateDifference(this.results, results).forEach(this.rotate.bind(this));
            this.results = results;
        }
    }
}

class SluzewiecLottoPollController {
    constructor($element) {
        this.calculateOptions = () => calculcateSimplePollOptions(this.options, this.stats)
            .filter(result => result.percentage > 0)
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0,5);
        this.optionsOriginal = Object.assign({}, { options : this.options }).options;
        this.options.sort((a, b) => a.order - b.order);
        this.sorted = true;
        this.results = this.calculateOptions();
        this.$element = $element;
    }

    get stats() {
        return this._stats;
    }

    rotate(index) {
        var element = angular.element(document.querySelectorAll('.animation')[index]);

        if (element.hasClass('animation--rotate')) {
            element.removeClass('animation--rotate');
        } else {
            element.addClass('animation--rotate');
        }
    }

    set stats(data) {
        this._stats = data;

        if (this.sorted) {
            var results = this.calculateOptions();
            calculcateDifference(this.results, results).forEach(this.rotate.bind(this));
            this.results = results;
        }
    }
}


export class ZuzelTorunPollDirective {
    constructor() {
        this.template = `<div class="container container-row container--space-around">
                <div class="container container-column"
                    ng-repeat="result in Poll.results track by $index">
                    <div class="container container-column radio-question__container animation">
                        <div class="ui-text--center"><img ng-src="{{'/projector/' + result.picture}}"/></div>
                        <div class="ui-text--white radio-question__displayName1 ui-text--center">{{result.firstName}}</div>
                        <div class="ui-text--white radio-question__displayName2 ui-text--center">{{result.lastName}}</div>
                    </div>
                    <div class="radio-question__percentage ui-text--center">{{result.percentage}}<span style="font-size:100px">%</span></div>
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

export class SluzewiecLottoPollDirective {
    constructor() {
        this.template = `<div class="container container-column container--content-to-start font--third">
                <div ng-repeat="result in Poll.results track by $index" class="ui-full--width">
                    <div class="container container-row ui-full--width">
                        <div class="width--1-of-2 padding-vertical--medium">
                            <div class="container radio-question__container margin-horizontal--big ui-text--right">
                                <div class="number margin-horizontal--big">{{result.number}}</div>
                                <div class="width-8-of-10 ui-text--left radio-question__displayName1 ui-display--inline-block"><span class="animation ui-display--inline-block">{{result.displayName}}</span></div>
                            </div>
                        </div>
                        <div class="width--1-of-2 container container-row padding-vertical--medium">
                            <div class="ui-text--white background--primary padding-horizontal--small">{{$index + 1}}.</div>
                            <div class="background--primary container--transition" ng-style="{width: result.percentage + '%'}"/>
                            <div class="radio-question__percentage">{{result.percentage}}<span>%</span></div>
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
        this.controller = SluzewiecLottoPollController;
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
