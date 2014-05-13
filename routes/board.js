var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.displayBoard = function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query["id"];

	request({

		uri: "https://api.sportsdatallc.org/nba-t3/games/" + id + "/pbp.xml?api_key=jenn2yh6bygetkxwavkpjwr2",
	  //uri: "https://api.sportsdatallc.org/nba-t3/games/" + id + "/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j",
	  method: "GET",
	}, function(error, response, body) {
		var descriptions = [];
		var doc = new DOMParser().parseFromString(body, 'text/xml');
		descriptions = doc.getElementsByTagName("description");
		var numPlays = descriptions.length;
		var play = descriptions[numPlays-1].lastChild.nodeValue;
		//events = doc.getElementsByTagName("event");
		//console.log(events);
		/*for (var i = 0; i < events.length; i++) {
			var description = events[i].getElementsByTagName("description")[0];
			console.log(description);
		}*/
		/*var numEvents = events.length;
		console.log(numEvents);
		var play = events[numEvents - 1].getElementsByTagName("description")[0];*/
		//var date = doc.getElementsByTagName("daily-schedule")[0].getAttribute("date");
		//var games = doc.getElementsByTagName("game");
		/*for (var i = 0; i < games.length; i++) {
			var id = games[i].getAttribute("id");
			var away = games[i].getElementsByTagName("away")[0].getAttribute("name");
			var home = games[i].getElementsByTagName("home")[0].getAttribute("name");
			gamesArr.push({"id": id, "home": home, "away": away, "date": date});
		}
		res.render('NBA', { 'games': gamesArr });*/

		var gameInfo = {"play": play, "id": id, "away": query["away"], "home": query["home"], "date": query["date"]};
		res.render('board', { 'gameInfo': gameInfo });
	});
};