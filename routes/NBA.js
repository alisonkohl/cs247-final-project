var request = require("request");

exports.loadGames = function(req, res){
	request({
	  uri: "http://api.sportsdatallc.org/nba-t3/games/2014/04/12/schedule.xml?api_key=jenn2yh6bygetkxwavkpjwr2",
	  method: "GET",
	}, function(error, response, body) {
		var gamesArr = [];
		gamesArr.push({"home": "Oklahoma City Thunder", "away": "Los Angeles Clippers", "date": "5-5-2014"});
		gamesArr.push({"home": "Indiana Pacers", "away": "Washington Wizards", "date": "5-5-2014"});
		res.render('NBA', { 'games': gamesArr });
		//res.render('NBA', { 'xmlData': body });
	});
};