export function calculatePollOptions() {
	if (this.optionsOriginal.length > 2) {
		var options = Object.assign({}, { options : this.optionsOriginal }).options;
		this._stats = Object.keys(this.stats)
			.map(key => this.stats[key])
			.sort((a, b) => b.value - a.value)
			.slice(0, 2)
			.reduce((acc, next) => {
				acc[next.option] = next;
				return acc;
			}, {});

		this.options = options
			.filter(option => option.enabled && this._stats[option.option])
			.sort((a, b) => this.stats[b.option].value - this.stats[a.option].value);
	}

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

export function calculateStats(poll = {}) {
	if (!poll && !poll.data || !poll.data.votes) {
		return;
	}

	var options = Object.keys(poll.data.votes);
	var votesSum = options.reduce((sum, key) => sum + poll.data.votes[key], 0);
	var votes = {};

	options.forEach(key => {
		var value = poll.data.votes[key];
		var percentage = Math.round((value / votesSum) * 100);

		votes[key] = {
			option: key,
			value: value,
			percentage: isNaN(percentage) ? 0 : percentage
		};
	});

	return votes;
}
