import {calculatePollOptions} from '../stats/service';

class PollController {
	constructor($element) {
		this.optionsOriginal = Object.assign({}, { options : this.options }).options;
		this.options.sort((a, b) => a.order - b.order);
		this.sorted = true;
		calculatePollOptions.call(this);
		this.$element = $element;
	}

	rotate(option) {
		var element = angular.element(this.$element[0].querySelector(option === 'first' ? '.image--option1' : '.image--option2'));

		if (element.hasClass('animation--rotate')) {
			element.removeClass('animation--rotate');
		} else {
			element.addClass('animation--rotate');
		}
	}

	get stats() {
		return this._stats;
	}

	set stats(data) {
		this._stats = data;

		if (this.sorted) {
			calculatePollOptions.call(this);
		}
	}
}

export class PollDirective {
	constructor() {
		this.template = `<div class="container container-row container--space-between">
                <div class="container container-row container--content-to-end ui-relative">
                    <span class="ui-position--absolute ui-text--white font2 ui-text-shadow">{{Poll.option1.name}}</span>
                    <span class="ui-position--absolute ui-text--white font--big ui-text-shadow" style="bottom:0px;left:3px">{{Poll.option1.number}}</span>
                    <img width="{{Poll.width}}" height="{{Poll.height}}" ng-src="{{Poll.option1.picture}}" class="image--option1 animation" />
                    <div style="height:100px;" class="container container--content-to-end">
                        <div class="margin-horizontal--small  ui-text--white poll__option poll__option--first container container--content-to-end container--center container--transition"
                             ng-style="{ height: Poll.percentage1 + '%'}">
                             <span class="font--large">{{Poll.percentage1}}<br/>%</span>
                        </div>
                    </div>
                </div>

                <div class="container container-row container--content-to-end ui-relative">
                    <span class="ui-position--absolute ui-text--white font2" style="right:7px;">{{Poll.option2.name}}</span>
                                        <span class="ui-position--absolute ui-text--white font--big ui-text-shadow" style="bottom:0px;right:3px">{{Poll.option2.number}}</span>
                    <div style="height:100px;" class="container container--content-to-end">
                        <div class="margin-horizontal--small ui-text--white poll__option poll__option--second container container--content-to-end container--center container--transition"
                        ng-style="{ height: Poll.percentage2 + '%'}">
                        <span class="font--large">{{Poll.percentage2}}<br/>%</span>
                        </div>
                    </div>
                    <img width="{{Poll.width}}" height="{{Poll.height}}" class="animation image--option2" ng-src="{{Poll.option2.picture}}" />
                </div>
            </div>`;
		this.scope = {
			options: '=',
			stats: '=',
			width: '@',
			height: '@'
		};
		this.controller = PollController;
		this.bindToController = true;
		this.controllerAs = 'Poll';
		this.replace = true;
	}
}

export class BestTeamPollDirective extends PollDirective {
	constructor() {
		super();
		this.template = `<div class="container container-row container--space-between">
                <div class="container container-row container--vertical-center">
                    <img width="{{Poll.width}}" height="{{Poll.height}}" ng-src="{{Poll.option1.picture}}" class="image--option1 animation" />
                    <div style="height:100px;" class="container container--content-to-end">
                        <div class="ui-text--white poll__option poll__option--first container container--content-to-end container--center container--transition"
                        ng-style="{ height: Poll.percentage1 + '%'}">
                        <span class="font--large">{{Poll.percentage1}}<br/>%</span>
                        </div>
                    </div>
                </div>
                <div class="container container-row">
                    <div style="height:100px;" class="container container--content-to-end">
                        <div class="margin-horizontal--small ui-text--white poll__option poll__option--second container container--content-to-end container--center container--transition"
                        ng-style="{ height: Poll.percentage2 + '%'}">
                        <span class="font--large">{{Poll.percentage2}}<br/>%</span>
                        </div>
                    </div>
                    <img width="{{Poll.width}}" height="{{Poll.height}}" class="margin-vertical--small animation image--option2" ng-src="{{Poll.option2.picture}}" />
                </div>
            </div>`;
	}
}