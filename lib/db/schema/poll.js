module.exports = function (Schema) {
	return {
		options: ['string'],
		name: {type: 'string', require: true},
		templateVote: 'string',
		templateResults: 'string',
		data: Schema.Types.Mixed,
		votes: [{
			option: 'string',
			tempId: { type: Schema.Types.ObjectId },
			userId: {type: 'objectId', ref: 'User'}
		}]
	};
};