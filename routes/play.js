var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.displayPlay = function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query["id"];
	var league = query["league"];

	if (league === "NBA") {
		request({
		  uri: "https://api.sportsdatallc.org/nba-t3/games/" + id + "/pbp.xml?api_key=rqukdyxzrs73sp4zrgg3v98j",
		  method: "GET",
		}, function(error, response, body) {
			var descriptions = [];
			var doc = new DOMParser().parseFromString(body, 'text/xml');
			descriptions = doc.getElementsByTagName("description");
			var numPlays = descriptions.length;
			var play;
			if (numPlays > 0) play = descriptions[numPlays-1].lastChild.nodeValue;
			else play = "No current play";
			res.render('play', {'play': play});
		});
	} else if (league === "MLB") {
		request({
		  //uri: "https://api.sportsdatallc.org/mlb-t4/pbp/" + id + ".xml?api_key=yb2jhdyd3jjjce5smhsj5f9w",
		  //uri: "https://api.sportsdatallc.org/mlb-t4/pbp/" + id + ".xml?api_key=axk6me7yhdhtzdthbvvyauvc",
		  //uri: "https://api.sportsdatallc.org/mlb-t4/pbp/" + id + ".xml?api_key=99xqbvahu2aahct97sqmyzc4",
		  uri: "https://api.sportsdatallc.org/mlb-t4/pbp/" + id + ".xml?api_key=n5rph45tnbk2evqgvf9e3ze7",
		  method: "GET",
		}, function(error, response, body) {
			var descriptions = [];
			var doc = new DOMParser().parseFromString(body, 'text/xml');
			descriptions = doc.getElementsByTagName("description");
			var numPlays = descriptions.length;
			var play;
			if (numPlays > 0) play = descriptions[numPlays-1].lastChild.nodeValue;
			else play = "No current play";
			res.render('play', {'play': play});
		});
	}

	
};