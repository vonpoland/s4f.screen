import PubSub from '../patterns/pubsub';
import {saveLocal} from '../storage/storage';

var cachedResponse = null;

class FacebookPubSub extends PubSub {
	static get AUTH() {
		return 'on_auth_change';
	}

	onAuth(callback) {
		return this.on(FacebookPubSub.AUTH, callback);
	}

	authChange(data) {
		this.emit(FacebookPubSub.AUTH, data);
	}
}

const facebookPubSub = new FacebookPubSub();

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
			facebookPubSub.authChange(response.authResponse.accessToken);
			saveLocal('lastUserId',  { userId : response.authResponse.userID });
		}
	});

	FB.Event.subscribe('auth.statusChange', (status) => {
		console.info('ssss statusChange', status);
	});

	FB.Event.subscribe('auth.authResponseChange', (status) => {
		console.info('ssss authResponseChange', status);
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

function getUser(token) {
	FB.api(
		'/me',
		'GET',
		{"fields":"name,email,favorite_teams,first_name,last_name,picture"},
		function(response) {
			console.info(response.last_name);
			console.info(response.picture);
			console.info(response.email);
		}
	);
}

function login() {
	facebookPubSub.events[FacebookPubSub.AUTH] = [];
	if(cachedResponse) {
		return Promise.resolve(cachedResponse.authResponse.accessToken);
	}

	return new Promise((resolve, reject) => {
		FB.login(function (response) {
			if (response.authResponse) {
				return resolve(response.authResponse.accessToken);
			} else {
				return reject('no access');
			}
		}, {scope: 'email'});
	});
}

const facebook = {
	init : init,
	login: login,
	pubSub: facebookPubSub
};

export default facebook;