var helper = require("../util/Helper.js");
var process = require("process");

var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = bot.users.get("id", settings["owner"]).name;
			var denot = ["css", "fix", "diff", "xl"];

			bot.sendMessage(message.channel, "```"+denot[helper.rInt(0, denot.length)]+"\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]["main"]+"\nUsing: discord.js\nOwner: "+owner+"\nBot uptime: "+helper.fTime(process.uptime())+"\nMore info: https://github.com/Sven65/MackBot```");
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
	"invite": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, "Click here to add me to your server! https://discordapp.com/oauth2/authorize?&client_id=168330106224246784&scope=bot&permissions=0");	
		},
		"desc": "Sends a invite link",
		"usage": "invite",
		"cooldown": 10
	}
};

exports.defaults = defaults;