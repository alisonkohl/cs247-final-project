var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.displayBoard = function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query["id"];
	var league = query["league"];

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if(dd<10) dd='0'+dd
	if(mm<10) mm='0'+mm

	if (league === "NBA") {
		
		request({
	      uri: "http://api.sportsdatallc.org/nba-t3/games/"+yyyy+'/'+mm+'/'+dd+'/'+"schedule.xml?api_key=jenn2yh6bygetkxwavkpjwr2",
	      method: "GET",
		}, function(error, response, body) {
			var gamesArr = [];
			var doc = new DOMParser().parseFromString(body, 'text/xml');
			var date = doc.getElementsByTagName("daily-schedule")[0].getAttribute("date");
			var games = doc.getElementsByTagName("game");
			for (var i = 0; i < games.length; i++) {
				var id = games[i].getAttribute("id");
				var away = games[i].getElementsByTagName("away")[0].getAttribute("name");
				var home = games[i].getElementsByTagName("home")[0].getAttribute("name");
				gamesArr.push({'league': "NBA", "id": id, "home": home, "away": away, "date": date});
			}
		var gameInfo = {"league": league, "id": id, "away": query["away"], "home": query["home"], "date": query["date"]};
		console.log(gamesArr);
		res.render('board', { 'gameInfo': gameInfo, 'games': gamesArr, 'NBA': 1 });
		});

	} else {

		request({
	uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/" + yyyy + "/" + mm + "/" + dd + ".xml?api_key=axk6me7yhdhtzdthbvvyauvc",
	  //uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/" + yyyy + "/" + mm + "/" + dd + ".xml?api_key=yb2jhdyd3jjjce5smhsj5f9w",
	//uri: "http://api.sportsdatallc.org/nba-t3/games/2014/05/13/schedule.xml?api_key=jenn2yh6bygetkxwavkpjwr2",
	  method: "GET",
	}, function(error, response, body) {
		var gamesArr = [];
		var doc = new DOMParser().parseFromString(body, 'text/xml');
		var date = mm+dd+yyyy;
		var events = doc.getElementsByTagName("event");
		for (var i = 0; i < events.length; i++) {
			var id = events[i].getAttribute("id");
			var awayName = events[i].getElementsByTagName("visitor")[0].getAttribute("name");
			var awayMarket = events[i].getElementsByTagName("visitor")[0].getAttribute("market");
			var homeName = events[i].getElementsByTagName("home")[0].getAttribute("name");
			var homeMarket = events[i].getElementsByTagName("home")[0].getAttribute("market");
			gamesArr.push({'league': "MLB", "id": id, "homeName": homeName, "awayName": awayName, "homeMarket": homeMarket, "awayMarket": awayMarket, "date": date});
		}

		var gameInfo = {"league": league, "id": id, "away": query["away"], "home": query["home"], "date": query["date"]};
		res.render('board', { 'gameInfo': gameInfo, 'games': gamesArr, 'NBA': 0 });

		});
	}
};