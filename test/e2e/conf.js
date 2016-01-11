exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['smoke.js'],
	baseUrl: 'http://192.168.1.207:8085',
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