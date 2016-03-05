function setOptions() {
	if (this.options.length === 2) {
		this.option1 = this.options[0];
		this.option2 = this.options[1];
		var percentage1 = this.stats[this.option1.option].percentage;
		var percentage2 = this.stats[this.option2.option].percentage;
		var value1 = this.stats[this.option1.option].value;
		var value2 = this.stats[this.option2.option].value;

		if (this.value1 && (this.value1 !== value1)) {
			this.rotate('first');
		}

		if (this.value2 && (this.value2 !== value2)) {
			this.rotate('second');
		}

		this.value1 = value1;
		this.value2 = value2;
		this.percentage1 = percentage1;
		this.percentage2 = percentage2;
	}
}

class PollController {
	constructor($scope, $element) {
		this.options.sort((a, b) => a.order - b.order);
		this.sorted = true;
		setOptions.call(this);
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
			setOptions.call(this);
		}
	}
}
export default class PollDirective {
	constructor() {
		this.template = `<div class="container container-row container--space-between">
                <div class="container container-row container--vertical-center">
                    <img width="80" height="80" ng-src="{{Poll.option1.picture}}" class="image--option1 animation" />
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
                    <img width="80" height="80" class="margin-vertical--small animation image--option2" ng-src="{{Poll.option2.picture}}" />
                </div>
            </div>`;
		this.scope = {
			options: '=',
			stats: '='
		};
		this.controller = PollController;
		this.bindToController = true;
		this.controllerAs = 'Poll';
		this.replace = true;
	}
}