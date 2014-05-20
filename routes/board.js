var request = require("request");
var DOMParser = require('xmldom').DOMParser;

exports.displayBoard = function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query["id"];
	var league = query["league"];
	var gameInfo = {"league": league, "id": id, "away": query["away"], "home": query["home"], "date": query["date"]};
	res.render('board', { 'gameInfo': gameInfo });
};