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
        option: answer.option,
        value: stat ? stat.value : 0,
        displayName: answer.nameAlt || answer.name,
        firstName: answer.firstName,
        lastName: answer.lastName,
        order: answer.order,
        picture: answer.picture,
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
    var allowedOptions = poll.data.options.filter(option => option.enabled).map(option => option.option);
    var options = Object.keys(poll.data.votes).filter(key => allowedOptions.indexOf(key) >= 0);
    var votesSum = options.reduce((sum, key) => sum + poll.data.votes[key], 0);
    var votes = {};
    options.forEach(key => {
        var value = poll.data.votes[key];
        var percentage = Math.floor((value / votesSum) * 100);

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

export function calculcateDifference(previousValues, newValues) {
    previousValues = previousValues || [];

    return newValues.reduce((acc, nextValue, index) => {
        var wasPresent = previousValues.filter(previousValue => previousValue.option === nextValue.option).pop();

        if ((typeof wasPresent === 'undefined') || (nextValue.value !== wasPresent.value) || (nextValue.percentage !== wasPresent.percentage)) {
            acc.push(index);
        }

        return acc;
    }, []);
}