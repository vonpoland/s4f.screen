var votePage = require('../../pageObjects/vote.page');
var facebookLoginpage = require('../../pageObjects/facebookLogin.page');

var random = require('random-js')();
describe('should vote in the poll', function () {
	it('should go to facebook login', function() {
		browser.ignoreSynchronization = true;
		browser.get('https://www.facebook.com/dialog/oauth/?scope=email&client_id=538291453008493&redirect_uri=http://192.168.1.207:8085/vote/tychy-konkurs&response_type=token')
	});

	it('should open vote page', function () {
		browser.ignoreSynchronization = false;
		votePage.go();
	});

	it('should vote page', function () {
		var vote = random.integer(0, 1) ? votePage.tychyOption : votePage.kluczborkOption;
		vote.click();
		votePage.voteButton.click();
		votePage.registerButton.click();
	});

	it('should switch to facebook window', function () {
		browser.ignoreSynchronization = true;
		facebookLoginpage.email.sendKeys('dusrijx_schrockman_1452007570@tfbnw.net');
		facebookLoginpage.password.sendKeys('Kurwamac6');
		facebookLoginpage.loginButton.click();
		browser.sleep(5000);
	});

	it('go back to vote page', function () {
		browser.ignoreSynchronization = false;
		expect(element(by.css('.vote-thank-you')).getText()).toContain('');
	});
});