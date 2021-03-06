'use strict';

const R = require('ramda');
const webDb = require('../db/db').Web;
const Poll = webDb.Poll;
const User = webDb.User;
const Vote = webDb.Vote;
const async = require('async');
const random = require('random-js')();

function lot(users) {
    var value = random.integer(0, users.length - 1);

    return users[value];
}
function lotWinner(votes, callback) {
    if (!votes) {
        return callback('not found');
    }

    var user = R.pipe(
        R.map(vote => vote.user.toString()),
        R.uniq,
        lot)
    (votes);

    callback(null, user);
}

function getDbPoll(name, callback) {
    Poll.findOne({name: {$regex: new RegExp(name + '$', 'i')}}).exec((err, poll) => {
        if (err || !poll) {
            return callback(err || 'poll not found');
        }

        callback(null, poll);
    });
}

function saveWinner(pollName, winner, callback) {
    Poll.findOne({name: {$regex: new RegExp(pollName + '$', 'i')}}, (err, poll) => {
        if (err || !poll) {
            return callback(err || 'poll not found cannot save');
        }

        if (!poll.winner) {
            poll.winner = winner;
        }

        poll.save(err => callback(err, poll.winner));
    });
}

function getWinner(pollName, callback) {
    async.waterfall([
        Vote.find.bind(Vote, {pollName: {$regex: new RegExp(pollName + '$', 'i')}}),
        lotWinner,
        User.findById.bind(User),
        saveWinner.bind(null, pollName)
    ], callback);
}

function add(options, callback) {
    Poll.findOne({name: {$regex: new RegExp(pollName + '$', 'i')}}, (err, poll) => {
        if (err || !poll) {
            return callback(err || 'poll not found');
        }

        poll.addVote(options.vote, err => callback(err, poll));
    });
}

function getStatistics(pollName, callback) {
    Vote.find({pollName: {$regex: new RegExp(pollName + '$', 'i')}})
        .lean()
        .exec((err, votes) => {
            if (err || !votes) {
                return callback(err || 'VOTE NOT FOUND');
            }

            var grouped = R.groupBy(vote => vote.option)(votes);

            R.forEach(key => grouped[key] = grouped[key].length)(R.keys(grouped));
            callback(null, grouped);
        });
}

function toWebPoll(poll) {
    return {
        id: poll._id,
        name: poll.name,
        templateVote: poll.templateVote,
        templateResults: poll.templateResults,
        templateWon: poll.templateWon,
        data: poll.data,
        editable: poll.editable,
        parent: poll.parent,
        winner: poll.winner,
        last: poll.last
    };
}

function getPolls(parent, callback) {
    Poll.find({parent: parent})
        .lean()
        .exec((err, polls) => callback(err, polls ? polls.map(toWebPoll) : null));
}

function saveLastScreenOnPoll(lastScreen, poll, callback) {
    if (!poll) {
        return callback('poll not found');
    }

    if (!poll.data.stepTemplates[lastScreen]) {
        return callback('step not found;');
    }

    poll.last = lastScreen;
    poll.save(callback);
}

function saveLastScreen(data, callback) {
    async.waterfall([
        getDbPoll.bind(null, data.pollName),
        saveLastScreenOnPoll.bind(null, data.lastScreen)
    ], callback);
}

function getPoll(name, callback) {
    Poll.findOne({name: {$regex: new RegExp(name + '$', 'i')}}).lean().exec((err, poll) => {
        if (err || !poll) {
            return callback(err || 'poll not found');
        }

        callback(null, toWebPoll(poll));
    });
}

function voted(user, pollName, callback) {
    Poll.findOne({name: pollName + '$'}, (err, poll) => {
        if (err) {
            return callback(err);
        }

        var result = poll.votes.filter(vote => vote.userId && (vote.userId.toString() === user.id)).pop();

        callback(null, !!result);
    });
}

function getParticipants(pollName, callback) {
    Vote.find({pollName: {$regex: new RegExp(pollName + '$', 'i')}})
        .populate('user')
        .lean()
        .then(votes => votes.map(vote => vote.user))
        .then(users => callback(null, users), callback);
}

function getAnswers(pollName, callback) {
    Vote.find({pollName: pollName + '$'})
        .populate('user')
        .lean()
        .exec(callback);
}

function edit(pollName, data, callback) {
    Poll.findOneAndUpdate({name: {$regex: new RegExp(pollName + '$', 'i')}}, data, (err, poll) => {
        if (err || !poll) {
            return callback(err || 'poll not found cannot save');
        }

        callback(null);
    });
}

function isStarted(poll) {
    if (!poll.editable || !poll.editable.startDate) {
        return true;
    }

    return new Date() > poll.editable.startDate;
}


function isFinished(poll) {
    return poll && poll.editable && poll.editable.finishDate && poll.editable.finishDate < new Date();
}

var isActive = poll => !isFinished(poll) && isStarted(poll);

function getActiveByParent(parent, callback) {
    Poll
        .find({parent: parent})
        .lean()
        .then(polls => polls
            .filter(isActive)
            .map(toWebPoll))
        .then(polls => callback(null, polls))
        .catch(callback)
}

exports.voted = voted;
exports.add = add;
exports.getPoll = getPoll;
exports.getStatistics = getStatistics;
exports.lotWinner = getWinner;
exports.getParticipants = getParticipants;
exports.getAnswers = getAnswers;
exports.getPolls = getPolls;
exports.saveLastScreen = saveLastScreen;
exports.edit = edit;
exports.getActiveByParent = getActiveByParent;