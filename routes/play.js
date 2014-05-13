var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.displayPlay = function(req, res){
	/*var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query["id"];

	request({
	  //uri: "https://api.sportsdatallc.org/nba-t3/games/" + id + "/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j",
	  uri: "https://api.sportsdatallc.org/nba-t3/games/00450af1-266c-47aa-b9e1-66991c8f7431/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j",
	  method: "GET",
	}, function(error, response, body) {
		while (true) {
			var events = [];
			var doc = new DOMParser().parseFromString(body, 'text/xml');
			events = doc.getElementsByTagName("event");
			//console.log(events);
			var numEvents = events.length;
			if (numEvents > 0) break;
		}
		console.log(numEvents);
		var play = events[numEvents - 1].getElementsByTagName("description")[0];
		//console.log(play.nodeValue);
		//console.log(play.nodeValue);
		//var date = doc.getElementsByTagName("daily-schedule")[0].getAttribute("date");
		//var games = doc.getElementsByTagName("game");
		/*for (var i = 0; i < games.length; i++) {
			var id = games[i].getAttribute("id");
			var away = games[i].getElementsByTagName("away")[0].getAttribute("name");
			var home = games[i].getElementsByTagName("home")[0].getAttribute("name");
			gamesArr.push({"id": id, "home": home, "away": away, "date": date});
		}
		res.render('NBA', { 'games': gamesArr });*/

		//res.render('play');//{ 'play': play });
		res.render('play', {'play': play});
	//});

	
};