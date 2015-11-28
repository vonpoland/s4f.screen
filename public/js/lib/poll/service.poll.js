import PubSub from '../patterns/pubsub';
import {getComponent} from '../di';

class PollPubSub extends  PubSub
{
    static get VOTED() {
        return 'on_voted';
    }

    onVoted(callback) {
        this.on(PollPubSub.VOTED, callback);
    }

    voted(data) {
        this.emit(PollPubSub.VOTED, data);
    }
}

export const pollPubSub = new PollPubSub();

export function calculate(id, options, data) {
    if(data.id !== id) {
        return null;
    }

    var current = data.votes[options] || 0;
    var keys = Object.keys(data.votes);
    var all = keys.reduce((sum, next) => {
        sum += data.votes[next];

        return sum;
    }, 0);

    var percentage = (current / all)*100;
    var display = Math.round(percentage);

    percentage = isNaN(percentage) ? 'auto' : percentage + '%';
    display = isNaN(display) ? '0%' : display + '%';
    return {
        percentage: percentage,
        display: display
    };
}

export function getPoll(id = null) {
    const stateParams = getComponent('stateParams');
    const restangular = getComponent('restangular');

    return restangular.one('api/poll/' + (id || stateParams.id)).get();
}

export function vote(option) {
    const stateParams = getComponent('stateParams');
    const restangular = getComponent('restangular');
    var id = stateParams.id;

    return restangular.one('api/poll/' + id + '/vote/' + option).post();
}