'use strict';

const R = require('ramda');

let polls = {};

function create(id, callback) {
    polls[id] = {
        votes: []
    };

    callback(null);
}

function add(options, callback) {
    var poll = polls[options.id];
    var user = options.user;
    var vote = options.vote;

    if (typeof (poll) === 'undefined') {
        return callback('VOTE NOT FOUND');
    }

    if (poll.votes.some(vote => vote.user.id === user.id)) {
        return callback('USER ALREADY VOTED');
    }

    poll.votes.push({
        vote: vote,
        user: user
    });

    callback(null);
}

function statistics(id, callback) {
    var poll = polls[id];

    if (typeof (poll) === 'undefined') {
        return callback('VOTE NOT FOUND');
    }

    var grouped = R.groupBy(vote => vote.vote.option)(poll.votes);
    R.forEach(key => grouped[key] = grouped[key].length)
    (R.keys(grouped));

    callback(null, {
        id: id,
        votes: grouped
    });
}

exports.add = add;
exports.create = create;
exports.statistics = statistics;

create('ksw33', () => {});