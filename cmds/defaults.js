var helper = require("../util/Helper.js");

var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = bot.users.get("id", settings["owner"]).name;
			var denot = ["css", "fix", "diff", "xl"];

			bot.sendMessage(message.channel, "```"+denot[helper.rInt(0, denot.length)]+"\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]["main"]+"\nUsing: discord.js\nOwner: "+owner+"\nMore info: https://github.com/Sven65/MackBot```");
		},
		"desc": "Bot info",
		"usage": "info",
		"cooldown": 10
	},
	"ping": {
		process: function(args, message, bot, settings){
			bot.reply(message, "Pong!");
		},
		"desc": "Pong!",
		"usage": "ping",
		"cooldown": 10
	},
	"pong": {
		process: function(args, message, bot, settings){
			bot.reply(message, "Ping!");
		},
		"desc": "Ping!",
		"usage": "pong",
		"cooldown": 10
	},
};

exports.defaults = defaults;