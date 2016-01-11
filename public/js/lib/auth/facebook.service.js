import PubSub from '../patterns/pubsub';
import {saveLocal} from '../storage/storage';

class FacebookPubSub extends PubSub {
	static get AUTH_CHANGE() {
		return 'on_auth_change';
	}

	authChange(data) {
		return this.emit(FacebookPubSub.AUTH_CHANGE, data);
	}

	onAuthChange(callback) {
		return this.on(FacebookPubSub.AUTH_CHANGE, callback);
	}
}

const facebookPubSub = new FacebookPubSub();
var cachedResponse = null;
var requireFullRedirect = false;
var fullRedirectUrl = 'https://www.facebook.com/dialog/oauth/?scope=PERMISSIONS&client_id=CLIENT_ID&redirect_uri=MY_CANVAS_URL&response_type=token';
const appId = '538291453008493';

function fullFacebookRedirect() {
	setTimeout(() => {
		window.location.href = fullRedirectUrl
			.replace('PERMISSIONS', 'email')
			.replace('CLIENT_ID', appId)
			.replace('MY_CANVAS_URL', 'http://192.168.1.207:8085/vote/tychy-konkurs');
	});

}
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

	//FB.Event.subscribe('auth.statusChange', (status) => {
	//	console.info('ssss statusChange', status);
	//});
	//
	//FB.Event.subscribe('auth.authResponseChange', (status) => {
	//	console.info('ssss authResponse' +
	//		'ange', status);
	//});

	FB.getLoginStatus(function(response) {
		console.info(response);
		if (response.status === 'connected') {
			cachedResponse = response;
			facebookPubSub.authChange();
		} else if(response.status === 'unknown') {
			requireFullRedirect = true;
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

	if(requireFullRedirect) {
		fullFacebookRedirect();
		return Promise.reject();
	}
	return new Promise((resolve, reject) => {
		FB.login(function (response) {
			if (response.authResponse) {
				saveLocal('lastUserId',  { userId : response.authResponse.userID });
				return resolve(response.authResponse.accessToken);
			} else {
				return reject('no access');
			}
		}, {scope: 'email', display : 'touch', redirect_url: 'http://192.168.1.207:8085/vote/tychy-konkurs'});
	});
}

const facebook = {
	init : init,
	login: login,
	pubSub: facebookPubSub
};

export default facebook;
