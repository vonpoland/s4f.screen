'use strict';

const service = require('../../../lib/poll/service');
const expect = require('expect.js');
const async = require('async');

describe('poll service tests', function () {
    it.only('should create new poll and get statistics', function (done) {
        const pollId = 'test';
        const user1 = {
            id: 'testUser'
        };
        const vote = {
            option: 'option1'
        };
        const user2 = {
            id: 'testUser2'
        };
        const vote2 = {
            option: 'option2'
        };

        service.create(pollId);

        async.waterfall([
            callback => service.add({
                id: pollId,
                user: user1,
                vote: vote
            }, callback),
            callback => service.add({
                id: pollId,
                user: user2,
                vote: vote2
            }, callback),
            callback => {
                service.add({
                    id: pollId,
                    user: user1,
                    vote: vote
                }, err => {
                    expect(err).to.be('USER ALREADY VOTED');
                    callback(null);
                });
            },
            callback => {
                service.statistics(pollId, (err, statistics) => {
                    expect(err).to.be(null);
                    expect(statistics.votes.option1).to.be(1);
                    expect(statistics.votes.option2).to.be(1);
                    callback(null);
                });
            }
        ], err => {
            expect(err).to.be(null);
            done();
        });
    });
});