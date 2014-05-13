var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.loadGames = function(req, res){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if(dd<10) dd='0'+dd
	if(mm<10) mm='0'+mm
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
			gamesArr.push({"id": id, "home": home, "away": away, "date": date});
		}
		res.render('NBA', { 'games': gamesArr });
	});
};