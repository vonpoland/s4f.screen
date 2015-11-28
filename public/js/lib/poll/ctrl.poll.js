import {vote} from './service.poll';
import {getComponent} from '../di';

export default class VotePollCtrl {
    vote(options) {
        vote(options).then(() => {
            getComponent('state').go('poll', {id: 'ksw33'});
        });
    }
}