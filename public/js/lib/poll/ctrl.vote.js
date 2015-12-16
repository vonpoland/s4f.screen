import {vote, getPoll} from './service.poll';
import {getComponent} from '../di';

export default class VotePollCtrl {
    constructor($state) {
        this.id = $state.params.id;
    }
    vote(options) {
        vote(options).then(() => {
            getComponent('state').go('poll', {id: this.id});
        });
    }
}