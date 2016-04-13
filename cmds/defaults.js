var helper = require("../util/Helper.js");
var process = require("process");
var misc = require("./misc.js").misc;
var admin = require("./admin.js").admin;
var util = require("./util.js").util;
var nsfw = require("./nsfw.js").nsfw;
var wolf = require("./wolf.js").wolf;

var commands = helper.extend({}, misc, admin, util, nsfw, defaults, wolf);
var nsfwChans = require("../data/nsfw.json");

var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = bot.users.get("id", settings["owner"]).name;
			var denot = ["css", "fix", "diff", "xl"];

			bot.sendMessage(message.channel, "```"+denot[helper.rInt(0, denot.length-1)]+"\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]["main"]+"\nUsing: discord.js\nOwner: "+owner+"\nBot uptime: "+helper.fTime(process.uptime())+"\nConnected to "+bot.servers.length+" servers and "+bot.channels.length+" channels"+"\nTotal users: "+bot.users.length+"\nUsing "+(Math.round(process.memoryUsage().rss / 1024 / 1000))+"MB of memory\nMore info: https://github.com/Sven65/MackBot```");
		},
		"desc": "Bot info",
		"usage": "info",
		"cooldown": 10
	},
	"ping": {
		process: function(args, message, bot, settings){
			var start = Date.now();
			var time = message.timestamp-start;
			if(time < 0){
				time *= -1;
			}
			bot.reply(message, "Pong! (Time taken "+time/1000+" seconds)");
		},
		"desc": "Pong!",
		"usage": "ping",
		"cooldown": 10
	},
	"pong": {
		process: function(args, message, bot, settings){
			var start = Date.now();
			var time = message.timestamp-start;
			if(time < 0){
				time *= -1;
			}
			bot.reply(message, "Ping! (Time taken "+time/1000+" seconds)");
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
	},
	"help": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var cmd = args[1];
				var index = Object.keys(commands).indexOf(cmd);
				if(index > -1){
					var helpMsg = "__**"+cmd+"**__\n\n";
					helpMsg += "**Description: **"+commands[cmd].desc+"\n\n";
					helpMsg += "**Usage: **"+settings['prefix']["main"]+""+commands[cmd].usage;

					bot.sendMessage(message.channel, helpMsg);
				}
			}else{
				bot.sendMessage(message.channel, "Hi! I'm MackBot! Type ``"+settings['prefix']['main']+"commands`` for a list of the commands I recognize!");
			}
		},
		"desc": "Shows help message",
		"usage": "help ``[command]``",
		"cooldown": 10
	},
	"commands": {
		process: function(args, message, bot, settings){
			console.log(admin);
			var helpMsg = "__**Commands:**__\n\n";
			helpMsg += "**Defaults: **";
			helpMsg += Object.keys(defaults).sort().join(", ");
		    helpMsg += "\n\n**Misc: **";
		    helpMsg += Object.keys(misc).sort().join(", ")
		    helpMsg += "\n\n**Admin: **";
		    helpMsg += Object.keys(require("./admin.js").admin).sort().join(", ")
		    helpMsg += "\n\n**Util: **";
		    helpMsg += Object.keys(util).sort().join(", ")
		    if(nsfwChans.indexOf(message.channel.id) > -1){
		    	helpMsg += "\n\n**NSFW: **";
		    	helpMsg += Object.keys(nsfw).sort().join(", ")
		    }
		    bot.sendMessage(message.channel, helpMsg);
		},
		"desc": "Shows commands",
		"usage": "commands",
		"cooldown": 10
	}
};

exports.defaults = defaults;