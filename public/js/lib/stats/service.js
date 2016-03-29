export function calculatePollOptions() {
    if (this.optionsOriginal.length > 2) {
        var options = Object.assign({}, {options: this.optionsOriginal}).options;
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

        var option1Stats = this.stats[this.option1.option];
        var options2Stats = this.stats[this.option2.option];

        var percentage1 = option1Stats ? option1Stats.percentage : 0;
        var percentage2 = options2Stats ? options2Stats.percentage : 0;

        var value1 = option1Stats ? option1Stats.value : 0;
        var value2 = options2Stats ? options2Stats.value : 0;

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

function createStat(stat, answer) {
    return {
        displayName: answer.name,
        order: answer.order,
        percentageCss: stat ? stat.percentage + '%' : '0%',
        percentage: stat ? stat.percentage : 0
    };
}
export function calculcateSimplePollOptions(options, stats) {
    return options.map(answer => {
        let stat = stats[answer.option];

        return createStat(stat, answer);
    });
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

export function updateResults(results, newResults) {
    results.forEach((stat, index) => {
        Object.assign(stat, newResults[index]);
    });
}