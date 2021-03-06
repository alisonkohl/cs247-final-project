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
	//uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/" + yyyy + "/" + mm + "/" + dd + ".xml?api_key=axk6me7yhdhtzdthbvvyauvc",
	//uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/" + yyyy + "/" + mm + "/" + dd + ".xml?api_key=99xqbvahu2aahct97sqmyzc4",
	//uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/" + yyyy + "/" + mm + "/" + dd + ".xml?api_key=n5rph45tnbk2evqgvf9e3ze7",
	uri: "https://api.sportsdatallc.org/mlb-t4/daily/event/2014/06/04.xml?api_key=n5rph45tnbk2evqgvf9e3ze7",
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
		res.render('MLB', {'games': gamesArr });
	});
};