var Discord = require("discord.js");
var fs = require("fs");
var moment = require("moment");

var mybot = new Discord.Client();

var settings = require("./settings.json");

var misc = require("./cmds/misc.js").misc;
var admin = require("./cmds/admin.js").admin;
var util = require("./cmds/util.js").util;
var unlisted = require("./cmds/unlisted.js").unlisted;
var defaults = require("./cmds/defaults.js").defaults;

var commands = extend({}, misc, admin, util, unlisted, defaults);

var stdin = process.openStdin();

var lastExecTime = {};
setInterval(function(){ lastExecTime = {}; },3600000);

// Misc functions

function init(){
	var now = new Date().valueOf();
	for(i=0;i<commands.length;i++){
		if(!lastExecTime.hasOwnProperty(commands[i])){
			lastExecTime[commands[i]] = {};
		}
	}
	mybot.login(settings['bot']['email'], settings['bot']['pass']);
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

mybot.on("message", function(message){


	console.log("[Message] "+message.sender.name+" -> "+message.content);

	args = message.content.split(" ");

	if(settings['ignored'].indexOf(message.sender.name) <= -1){

		if(args[0] == settings['prefix']['main']+"help" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1] == "help"){
			if(args.length == 2){
				var cmd = args[1];
				if(settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">"){
					mybot.sendMessage(message.channel, "I'm MackBot! Type "+settings['prefix']['main']+"commands for a list of commands!");
				}else{
					var index = Object.keys(commands).indexOf(cmd);
					if(index > -1){
						var helpMsg = "__**"+cmd+"**__\n\n";
						helpMsg += "**Description: **"+commands[cmd].desc+"\n\n";
						helpMsg += "**Usage: **"+settings['prefix']["main"]+""+commands[cmd].usage;

						mybot.sendMessage(message.channel, helpMsg);
					}
				}
			}else if(args.length >= 3){
				var cmd = args[2];
				var index = Object.keys(commands).indexOf(cmd);
				if(index > -1){
					var helpMsg = "__**"+cmd+"**__\n\n";
					helpMsg += "**Description: **"+commands[cmd].desc+"\n\n";
					helpMsg += "**Usage: **"+settings['prefix']["main"]+""+commands[cmd].usage;

					mybot.sendMessage(message.channel, helpMsg);
				}
			}else{
				mybot.sendMessage(message.channel, "I'm MackBot! Type "+settings['prefix']['main']+"commands for a list of commands!");
			}
		}else if(args[0] == settings['prefix']['main']+"commands" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1] == "commands"){
			var helpMsg = "__**Commands:**__\n\n";
			helpMsg += "**Defaults: **";
			helpMsg += Object.keys(defaults).sort().join(", ");
		    helpMsg += "\n\n**Misc: **";
		    helpMsg += Object.keys(misc).sort().join(", ")
		    helpMsg += "\n\n**Admin: **";
		    helpMsg += Object.keys(admin).sort().join(", ")
		    helpMsg += "\n\n**Util: **";
		    helpMsg += Object.keys(util).sort().join(", ")
		    mybot.sendMessage(message.channel, helpMsg);
		}else{
			if(args[0].substring(0, settings['prefix']['main'].length) == settings['prefix']['main'] || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">"){
				var cmd;
				if(settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">"){
					cmd = args[1];
					args = args.splice(1, args.length).join(" ").split(" ");
				}else{
					cmd = args[0].replace(settings['prefix']['main'], "");
				}

				console.dir(args);

				var index = Object.keys(commands).indexOf(cmd);
				if(index > -1){
					var now = new Date().valueOf();
					if(!lastExecTime.hasOwnProperty(cmd)){
						lastExecTime[cmd] = {};
					}

					if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
						lastExecTime[cmd][message.author.id] = new Date().valueOf();
					}

					if(settings["admins"].indexOf(message.author.id) == -1){
						if(now < lastExecTime[cmd][message.author.id] + (commands[cmd].cooldown * 1000)){
							mybot.sendMessage(message, message.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][message.author.id] + commands[cmd].cooldown * 1000) - now) / 1000) + " seconds)", function(e, m){ mybot.deleteMessage(m, {"wait": 6000}); });
							if (!message.channel.isPrivate) mybot.deleteMessage(message, {"wait": 10000});
							return;
						}else{
							commands[cmd].process(args, message, mybot, settings);
							lastExecTime[cmd][message.author.id] = now;
						}
					}else{
						commands[cmd].process(args, message, mybot, settings);
					}
				}
			}
		}
	}
});

init();

mybot.on("error", function(err){
	console.log("[Error] "+err);
});

mybot.on("warn", function(warn){
	//console.log("[Warn] "+warn);
});

mybot.on("ready", function(){
	console.log("Ready.");
});

stdin.addListener("data", function(d) {
    mybot.sendMessage(mybot.channels[0], d.toString().trim());
});

process.on('uncaughtException', function(err){
  console.log("Caught exception: "+err.stack);
});