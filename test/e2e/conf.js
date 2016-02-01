exports.config = {
	//seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['smoke.js'],
	baseUrl: 'http://screen4fans.com:1111',
	suites: {
		vote: 'specs/vote/*.js',
		smoke: 'smoke.js',
		full: 'spec/*.js'
	},
	params: {
		vote: {
			path: 'vote/tychy-konkurs'
		}
	}
};