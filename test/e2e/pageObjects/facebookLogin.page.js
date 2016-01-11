var Page = require('astrolabe').Page;

module.exports = Page.create({
	email : { get: function() { return this.findElement(this.by.id('email')); } },
	password : { get: function() { return this.findElement(this.by.id('pass')); } },
	loginButton : { get: function() { return this.findElement(this.by.css('[name="login"]')); } }
});