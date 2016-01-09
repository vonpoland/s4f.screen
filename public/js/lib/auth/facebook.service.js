import {saveLocal} from '../storage/storage';

var cachedResponse = null;

window.fbAsyncInit = function () {
	FB.init({
		appId: '538291453008493',
		cookie: true,
		xfbml: true,
		version: 'v2.5'
	});

	FB.Event.subscribe('auth.login', function(response) {
		if(response.status === 'connected') {
			cachedResponse = response;
			saveLocal('lastUserId',  { userId : response.authResponse.userID });
		}
	});

	FB.Event.subscribe('auth.statusChange', (status) => {
		console.info('ssss statusChange', status);
	});

	FB.Event.subscribe('auth.authResponseChange', (status) => {
		console.info('ssss authResponseChange', status);
	});

	FB.getLoginStatus(function(response) {
		console.info(response);
		if (response.status === 'connected') {
			cachedResponse = response;
		}
	});
};


function init() {
	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}

function login() {
	if(cachedResponse) {
		return Promise.resolve(cachedResponse.authResponse.accessToken);
	}

	return new Promise((resolve, reject) => {
		FB.login(function (response) {
			if (response.authResponse) {
				saveLocal('lastUserId',  { userId : response.authResponse.userID });
				return resolve(response.authResponse.accessToken);
			} else {
				return reject('no access');
			}
		}, {scope: 'email'});
	});
}

const facebook = {
	init : init,
	login: login
};

export default facebook;