'use strict';

var voteService = require('./.././voteService');

var limit = parseInt(process.argv[2]);

if (!isNaN(limit)) {
	voteService.voteMany(limit, () => {});
}