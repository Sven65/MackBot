var request = require('request');
var parser = require("simple-xml2json");
var helper = require("../util/Helper.js");

var misc = {
	"15": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "15 15 15 15 15 15 15 15 15 15 15");
		},
		"desc": "Prints 15",
		"usage": "15",
		"cooldown": 10
	},
	"cat": {
		process: function(args, message, bot, settings){
			request('http://thecatapi.com/api/images/get?format=xml&results_per_page=1', function(error, response, body){
				if(!error && response.statusCode == 200){
				    var data = parser.parser(body);
				    bot.sendMessage(message.channel, data["response"]["data"]["images"]["image"]["url"]);
			  	}
			});
		},
		"desc": "Sends a random cat",
		"usage": "cat",
		"cooldown": 10
	},
	"cri": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "*cris evritim*");
		},
		"desc": "Cri",
		"usage": "cri",
		"cooldown": 10
	},
	"fuck": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "Wow...dont fucking say fuck you fucking fucktard dont fucking make me fucking come over there and fuck you (fucking metaphorically of course) Thats right, dont fucking fuck with the fucking fucker");
		},
		"desc": "Fuuuuckkkk",
		"usage": "fuck",
		"cooldown": 10
	},
	"hue": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "huehuhuehuehuehuhuehuhuehuhuehuhuehuhuehuhuehuhuehuhuehu");
		},
		"desc": "hue",
		"usage": "hue",
		"cooldown": 10
	},
	"lenny": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "( ͡° ͜ʖ ͡°)");
		},
		"desc": "( ͡° ͜ʖ ͡°)",
		"usage": "lenny",
		"cooldown": 10
	},
	"lod": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "ಠ_ಠ");
		},
		"desc": "ಠ_ಠ",
		"usage": "lod",
		"cooldown": 10
	},
	"meme": {
		process: function(args, message, bot, settings){
			request('http://infinigag.k3min.eu/meme', function(error, response, body){
				if(!error && response.statusCode == 200){
				    var memes = JSON.parse(body)["data"];
				    var meme = memes[helper.rInt(0, memes.length)];
				    if(meme !== undefined){
				    	bot.sendMessage(message.channel, meme["images"]["normal"]);
				    }
				  }
			});
		},
		"desc": "Sends a random meme",
		"usage": "meme",
		"cooldown": 10
	},
	"no": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "http://i2.kym-cdn.com/entries/icons/original/000/007/423/untitle.JPG");
		},
		"desc": "No.",
		"usage": "no",
		"cooldown": 10
	},
	"pana": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "Pana is orange master.");
		},
		"desc": "Orange",
		"usage": "pana",
		"cooldown": 10
	},
	"pink": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "Mirelle Nutella Adele Pinkie Chrysalis Islandmountain Glitterhead The 15th is the pinkest girl ever");
		},
		"desc": "Pink",
		"usage": "pink",
		"cooldown": 10
	},
	"potato": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "POTATO");
		},
		"desc": "Potato.",
		"usage": "potato",
		"cooldown": 10
	}
};

exports.misc = misc;