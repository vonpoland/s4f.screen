var Page = require('astrolabe').Page;

module.exports = Page.create({
	url: { value: browser.params.vote.path },

	tychyOption : { get: function() { return this.findElement(this.by.css('[value="tychy"]')); } },
	kluczborkOption : { get: function() { return this.findElement(this.by.css('[value="kluczbork"]')); } },
	voteButton: { get: function() { return this.findElement(this.by.css('[ng-click="Vote.vote(poll.poll.name, Vote.selection)"]')); } },
	registerButton: { get: function() { return this.findElement(this.by.css('[ng-click="Vote.registerVote(poll.poll.name, Vote.selection)"]')); } }
});