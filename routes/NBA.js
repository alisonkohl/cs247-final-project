var request = require("request");

exports.loadGames = function(req, res){
	request({
	  uri: "http://api.sportsdatallc.org/nba-t3/games/2014/04/12/schedule.xml?api_key=jenn2yh6bygetkxwavkpjwr2",
	  method: "GET",
	}, function(error, response, body) {
		/*var gamesArr = {
			games: []
		};
		gamesArr.games.push({"home": "Oklahoma City Thunder", "away": "Los Angeles Clippers", "date": "5_5_2014"});
		gamesArr.games.push({"home": "Indiana Pacers", "away": "Washington Wizards", "date": "5_5_2014"});*/
		var gamesArr = [];
		gamesArr.push({"home": "Oklahoma City Thunder", "away": "Los Angeles Clippers", "date": "5-5-2014"});
		gamesArr.push({"home": "Indiana Pacers", "away": "Washington Wizards", "date": "5-5-2014"});
		//console.log(games);
		/*var gamesXML = new xmldoc.XmlDocument(response);
		var games = gamesXML.childNamed("games");
		var gamesArr = gamesXML.childrenNamed("game");*/
		res.render('NBA', { 'games': gamesArr });
	});
	//res.render('main', {'body': body});
};