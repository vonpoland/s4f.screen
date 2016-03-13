import {getAnswers, getPoll} from '../poll/service.poll';

export default class ResultsCtrl {
    constructor() {
        getAnswers()
        .then(answers => this.answers = answers);

        getPoll()
        .then(poll => {
            this.pollName = poll.name;
            this.votes = Object.keys(poll.data.votes)
                .map(key => ({ option: key, value: poll.data.votes[key]}))
                .sort((option1, option2) => option2.value - option1.value);
        });
    }
}