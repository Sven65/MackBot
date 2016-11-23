var helper = require("../util/Helper.js");
var process = require("process");
var misc = require("./misc.js").misc;
var admin = require("./admin.js").admin;
var util = require("./util.js").util;
var nsfw = require("./nsfw.js").nsfw;
var wolf = require("./wolf.js").wolf;
var games = require("./games.js").games;
var profiles = require("./profiles.js").profiles;
var settings = require("../settings.json");

var commands = helper.extend({}, misc, admin, util, nsfw, defaults, wolf, games, profiles);
var nsfwChans = require("../data/nsfw.json");

var defaults = {
	"info": {
		process: function(args, message, bot){
			var owner = bot.users.find("id", settings["owner"]).username;
			var denot = ["css", "fix", "diff", "xl"];

			message.channel.sendMessage("```"+denot[helper.rInt(0, denot.length-1)]+"\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]["main"]+"\nUsing: discord.js\nOwner: "+owner+"\nBot uptime: "+helper.fTime(process.uptime())+"\nConnected to "+bot.servers.length+" servers and "+bot.channels.length+" channels"+"\nTotal users: "+bot.users.length+"\nUsing "+(Math.round(process.memoryUsage().rss / 1024 / 1000))+"MB of memory\nMore info: https://github.com/Sven65/MackBot```");
		},
		"desc": "Bot info",
		"usage": "info",
		"cooldown": 10
	},
	"ping": {
		process: function(args, message, bot){
			var start = Date.now();
			var time = message.timestamp-start;
			if(time < 0){
				time *= -1;
			}
			message.channel.sendMessage("<@"+message.author.id+">Pong! (Time taken "+time/1000+" seconds)");
		},
		"desc": "Pong!",
		"usage": "ping",
		"cooldown": 10
	},
	"pong": {
		process: function(args, message, bot){
			var start = Date.now();
			var time = message.timestamp-start;
			if(time < 0){
				time *= -1;
			}
			message.channel.sendMessage("<@"+message.author.id+">Pong! (Time taken "+time/1000+" seconds)");
		},
		"desc": "Ping!",
		"usage": "pong",
		"cooldown": 10
	},
	"invite": {
		process: function(args, message, bot){
			message.channel.sendMessage("Click here to add me to your server! https://discordapp.com/oauth2/authorize?&client_id=168330106224246784&scope=bot&permissions=0");	
		},
		"desc": "Sends a invite link",
		"usage": "invite",
		"cooldown": 10
	},
	"help": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var cmd = args[1];
				var index = Object.keys(commands).indexOf(cmd);
				if(index > -1){
					var helpMsg = "__**"+cmd+"**__\n\n";
					helpMsg += "**Description: **"+commands[cmd].desc+"\n\n";
					helpMsg += "**Usage: **"+settings['prefix']["main"]+""+commands[cmd].usage;

					message.channel.sendMessage(helpMsg);
				}
			}else{
				var msg = "Hi! I'm MackBot! For a list of the commands I recognize, you can type ``"+settings['prefix']['main']+"commands``";
				if(settings["prefix"]["botname"]){
					msg += ", ``"+bot.user.username+" commands`` or <@"+bot.user.id+"> commands";
				}
				message.channel.sendMessage(msg);
			}
		},
		"desc": "Shows help message",
		"usage": "help ``[command]``",
		"cooldown": 10
	},
	"commands": {
		process: function(args, message, bot){
			var toggled = require("../data/toggled.json");

			var def = Object.keys(defaults).sort();
			var mis = Object.keys(misc).sort();
			var adm = Object.keys(require("./admin.js").admin).sort();
			var uti = Object.keys(util).sort();
			var nsf = Object.keys(nsfw).sort();
			var gam = Object.keys(games).sort();
			var prof = Object.keys(profiles).sort();

			for(i=0;i<def.length;i++){
				var cmd = def[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					def.splice(i, 1);
				}
			}

			for(i=0;i<mis.length;i++){
				var cmd = mis[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					mis.splice(i, 1);
				}
			}

			for(i=0;i<adm.length;i++){
				var cmd = adm[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					adm.splice(i, 1);
				}
			}

			for(i=0;i<uti.length;i++){
				var cmd = uti[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					uti.splice(i, 1);
				}
			}

			for(i=0;i<nsf.length;i++){
				var cmd = nsf[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					nsf.splice(i, 1);
				}
			}

			for(i=0;i<gam.length;i++){
				var cmd = gam[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					gam.splice(i, 1);
				}
			}

			for(i=0;i<prof.length;i++){
				var cmd = prof[i];
				if(toggled[cmd].indexOf(message.channel.server.id) > -1){
					prof.splice(i, 1);
				}
			}

			var helpMsg = "__**Commands:**__\n\n";
			helpMsg += "**Defaults: **";
			helpMsg += def.sort().join(", ");
		    helpMsg += "\n\n**Misc: **";
		    helpMsg += mis.sort().join(", ");
		    helpMsg += "\n\n**Admin: **";
		    helpMsg += adm.sort().join(", ");
		    helpMsg += "\n\n**Util: **";
		    helpMsg += uti.sort().join(", ");
		    helpMsg += "\n\n**Games: **";
		    helpMsg += gam.sort().join(", ");
		    helpMsg += "\n\n**Profiles: **";
		    helpMsg += prof.sort().join(", ");
		    if(nsfwChans.indexOf(message.channel.id) > -1){
		    	helpMsg += "\n\n**NSFW: **";
		    	helpMsg += nsf.sort().join(", ")
		    }
		    message.channel.sendMessage(helpMsg);
		},
		"desc": "Shows commands",
		"usage": "commands",
		"cooldown": 10
	}
};

exports.defaults = defaults;