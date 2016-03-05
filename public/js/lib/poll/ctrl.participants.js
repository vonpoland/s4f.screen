import {getAnswers, pollPubSub, rotateAnswers} from './service.poll';

const ROTATE_TIME = 12000;

function handleIntervalChange($timeout, answerContent, newAnswers) {
		answerContent.addClass('opacity--off');
		var image = answerContent.find('img');

		$timeout(() => {
			var newAnswer = newAnswers.pop();

			if (newAnswer) {
				this.answer = newAnswer;
				this.answers.push(newAnswer);
			} else {
				this.answer = rotateAnswers(this.answers);
			}

			if(!this.answer) {
				return;
			}

			image.removeAttr('src');
			image.attr('src', this.answer.user.photo);
			answerContent.removeClass('opacity--off');
		}, 1000);
}

export default class ParticipantsCtrl {
	constructor($scope, $timeout) {
		var answerContent = angular.element(document.querySelector('.fadeable'));
		var intervalId;
		var newAnswers = [];
		getAnswers()
			.then(answers => {
				if (!answers) {
					return;
				}
				this.answers = answers;

				var onAnswerChange = handleIntervalChange.bind(this, $timeout, answerContent, newAnswers);

				onAnswerChange();
				intervalId = setInterval(onAnswerChange, ROTATE_TIME);
			}, () => this.answers = []);

		var pubSubOff = pollPubSub.onNewParticipant(data => {
			data.vote.user = data.user;
			data.vote.user.photo  = 'img/users/' + data.user._id + '/profile.png';
			newAnswers.push(data.vote);
		});

		$scope.$on('$destroy', () => {
			window.clearInterval(intervalId);
			answerContent = null;
			pubSubOff();
		});
	}
}