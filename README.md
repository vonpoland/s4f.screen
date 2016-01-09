# boostrap-node-angular-jspm 
# fix port ubuntu http://stackoverflow.com/questions/18947356/node-js-app-cant-run-on-port-80-even-though-theres-no-other-process-blocking-t

#http://milanos.pl/vid-141270-Masakra-Kalisza---zapomnial-o-swoim.html
# https://www.youtube.com/watch?v=QZXc39hT8t4
https://www.youtube.com/watch?v=iR9nE5JhdFQ

#animations 
https://github.com/daneden/animate.css
#watch

z folderu public
browser-sync start --files="*.html,*.js,**/.*html,**/*.js"


	var getVotesWithUsers = callback => Poll
		.aggregate([
			{$match: {name: pollName}},
			{$unwind: '$votes'},
			{$match: {'votes.userId': {$exists: true}}},
			{$group: {_id: '$_id', votes: {$push: '$votes.userId'}}}
		])
		.exec(callback);