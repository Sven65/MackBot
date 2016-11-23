var request = require('request');
var parser = require("simple-xml2json");
var helper = require("../util/Helper.js");
var urlencode = require('urlencode');
var bluebird = require("bluebird");
var redis = require("redis");
var client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var misc = {
	"cat": {
		process: function(args, message, bot){
			request('http://thecatapi.com/api/images/get?format=xml&results_per_page=1', function(error, response, body){
				if(!error && response.statusCode == 200){
				    var data = parser.parser(body);
				    message.channel.sendMessage(data["response"]["data"]["images"]["image"]["url"]);
			  	}
			});
		},
		"desc": "Sends a random cat",
		"usage": "cat",
		"cooldown": 10
	},
	"cri": {
		process: function(args, message, bot){
			message.channel.sendMessage("*cris evritim*");
		},
		"desc": "Cri",
		"usage": "cri",
		"cooldown": 10
	},
	"fuck": {
		process: function(args, message, bot){
			message.channel.sendMessage("Wow...dont fucking say fuck you fucking fucktard dont fucking make me fucking come over there and fuck you (fucking metaphorically of course) Thats right, dont fucking fuck with the fucking fucker");
		},
		"desc": "Fuuuuckkkk",
		"usage": "fuck",
		"cooldown": 10
	},
	"hue": {
		process: function(args, message, bot){
			message.channel.sendMessage("huehuhuehuehuehuhuehuhuehuhuehuhuehuhuehuhuehuhuehuhuehu");
		},
		"desc": "hue",
		"usage": "hue",
		"cooldown": 10
	},
	"lenny": {
		process: function(args, message, bot){
			message.channel.sendMessage("( ͡° ͜ʖ ͡°)");
		},
		"desc": "( ͡° ͜ʖ ͡°)",
		"usage": "lenny",
		"cooldown": 10
	},
	"lod": {
		process: function(args, message, bot){
			message.channel.sendMessage("ಠ_ಠ");
		},
		"desc": "ಠ_ಠ",
		"usage": "lod",
		"cooldown": 10
	},
	"meme": {
		process: function(args, message, bot){
			request('http://infinigag.k3min.eu/meme', function(error, response, body){
				if(!error && response.statusCode == 200){
				    var memes = JSON.parse(body)["data"];
				    var meme = memes[helper.rInt(0, memes.length)];
				    if(meme !== undefined){
				    	message.channel.sendMessage(meme["images"]["normal"]);
				    }
				  }
			});
		},
		"desc": "Sends a random meme",
		"usage": "meme",
		"cooldown": 10
	},
	"no": {
		process: function(args, message, bot){
			message.channel.sendMessage("http://i2.kym-cdn.com/entries/icons/original/000/007/423/untitle.JPG");
		},
		"desc": "No.",
		"usage": "no",
		"cooldown": 10
	},
	"potato": {
		process: function(args, message, bot){
			message.channel.sendMessage("POTATO");
		},
		"desc": "Potato.",
		"usage": "potato",
		"cooldown": 10
	},
	"dance": {
		process: function(args, message, bot){
			message.channel.sendMessage("*Dances* \\o\\ \\o/ /o/");
		},
		"desc": "Dance.",
		"usage": "dance",
		"cooldown": 10
	},
	"text": {
		process: function(args, message, bot){
			if(args.length >= 2){
				if(args[1].substring(0, 2) == "-f"){
					var f = args[1].replace("-f", "");

					message.channel.sendMessage("http://res.discorddungeons.me/gen/"+urlencode(args.splice(2, args.length).join(" "))+"&f="+f+".png");
					return;
				}
				message.channel.sendMessage("http://res.discorddungeons.me/gen/"+urlencode(args.splice(1, args.length).join(" "))+".png");
			}
		},
		"desc": "Text.",
		"usage": "text ``text``",
		"cooldown": 10
	},
	"add": {
		process: function(args, message, bot){
			client.getAsync("mackbot:i").then((reply) => {
				var i = Number(reply);
				client.incr("mackbot:i");
				message.channel.sendMessage("Count is now "+(i+1));
			});
		},
		"desc": "Adds 1",
		"usage": "add",
		"cooldown": 10
	},
	"rem": {
		process: function(args, message, bot){
			client.getAsync("mackbot:i").then((reply) => {
				var i = Number(reply);
				client.decr("mackbot:i");
				message.channel.sendMessage("Count is now "+(i-1));
			});
		},
		"desc": "Removes 1",
		"usage": "remove",
		"cooldown": 10
	},
	"vapor": {
		process: function(args, message, bot){
			message.channel.sendMessage(args.splice(1, args.length).join(" ").split("").join(" "));
		},
		"desc": "V A P O R W A V E",
		"usage": "vapor ``text``",
		"cooldown": 10
	},
	"joinfilm": {
		process: function(args, message, bot){
			if(message.channel.type === "text"){
				if(message.guild.id === "172382467385196544"){
					message.member.addRole(message.guild.roles.find("name", "Film Watchers"));
				}
			}
		},
		"desc": "Gives you the ``Film Watcher`` role (Only works in Discord Dungeons)",
		"usage": "joinfilm",
		"cooldown": 10
	},
	"leavefilm": {
		process: function(args, message, bot){
			if(message.channel.type === "text"){
				if(message.guild.id === "172382467385196544"){
					message.member.removeRole(message.guild.roles.find("name", "Film Watchers"));
				}
			}
		},
		"desc": "Removes you from the ``Film Watcher`` role (Only works in Discord Dungeons)",
		"usage": "leavefilm",
		"cooldown": 10
	}
};

exports.misc = misc;