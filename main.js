var Discord = require("discord.js");
var fs = require("fs");
var moment = require("moment");
var chalk = require('chalk');

var mybot = new Discord.Client();

var settings = require("./settings.json");
var toggled = require("./data/toggled.json");

var misc = require("./cmds/misc.js").misc;
var admin = require("./cmds/admin.js").admin;
var util = require("./cmds/util.js").util;
var nsfw = require("./cmds/nsfw.js").nsfw;
var defaults = require("./cmds/defaults.js").defaults;
var hardCoded = {
	"help": {
		"desc": "Shows help",
		"usage": "help `[command]`"
	},
	"nsfw": {
		"desc": "Toggles NSFW commands for channel",
		"usage": "nsfw"
	},
	"commands": {
		"desc": "Shows commands",
		"usage": "commands"
	}
}

var commands = extend({}, misc, admin, util, nsfw, defaults);

var stdin = process.openStdin();

var lastExecTime = {};
setInterval(function(){ lastExecTime = {}; },3600000);
var firstTime = {};

var nsfwChans = [];

var processed = 0;

// Misc functions

function saveToggle(){
	fs.writeFile("./data/toggled.json", JSON.stringify(toggled), 'utf8', function(err){
		if(err){ throw err; }
	});
}

function checkRole(message, role){
	var roles = message.channel.server.rolesOfUser(message.author);
	for(i=0;i<roles.length;i++){
		if(roles[i].name == role){
			return true;
		}
	}
	return false;
}

function init(){
	var now = new Date().valueOf();
	for(i=0;i<Object.keys(commands).length;i++){
		firstTime[Object.keys(commands)[i]] = {};
		if(!toggled.hasOwnProperty(Object.keys(commands)[i])){
			toggled[Object.keys(commands)[i]] = [];
		}
	}
	saveToggle();
	loadNSFWChans();

	if(settings['bot']['token'].length > 0){
		mybot.loginWithToken(settings['bot']['token'], function(err, token){
			if(err){ throw err; }
			console.log(chalk.green("Logged in."));
		});
	}else{
		mybot.login(settings['bot']['email'], settings['bot']['pass'], function(err, token){
			if(err){ throw err; }
			console.log(chalk.green("Logged in"));
			console.log(chalk.red("Warning! Bots running on user accounts will get banned soon."));
		});
	}
}

function loadNSFWChans(){
	fs.readFile(__dirname+"/data/nsfw.txt", 'utf8', function(err, data){
		if(err){ throw err; }
		nsfwChans = data.split(",");
	});
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source){
        for(var prop in source){
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
			var dflt = extend({}, defaults, hardCoded);
			var helpMsg = "__**Commands:**__\n\n";
			helpMsg += "**Defaults: **";
			helpMsg += Object.keys(dflt).sort().join(", ");
		    helpMsg += "\n\n**Misc: **";
		    helpMsg += Object.keys(misc).sort().join(", ")
		    helpMsg += "\n\n**Admin: **";
		    helpMsg += Object.keys(admin).sort().join(", ")
		    helpMsg += "\n\n**Util: **";
		    helpMsg += Object.keys(util).sort().join(", ")
		    if(nsfwChans.indexOf(message.channel.id) > -1){
		    	helpMsg += "\n\n**NSFW: **";
		    helpMsg += Object.keys(nsfw).sort().join(", ")
		    }
		    mybot.sendMessage(message.channel, helpMsg);
		}else if(args[0] == settings['prefix']['main']+"nsfw" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1] == "nsfw"){
			if(settings["admins"].indexOf(message.author.id) > -1 || checkRole(message, settings['adminrole'])){
				var chan = message.channel.id;
				if(nsfwChans.indexOf(chan) > -1){
					nsfwChans.splice(nsfwChans.indexOf(chan), 1);
					fs.writeFile(__dirname+"/data/nsfw.txt", nsfwChans.sort().join(","), 'utf8', function(err){
						if(err){ throw err; }
						mybot.sendMessage(message.channel, "NSFW Commands disabled for channel.");
					});
				}else{
					nsfwChans.push(chan);
					fs.appendFile(__dirname+"/data/nsfw.txt", nsfwChans.sort().join(","), 'utf8', function(err){
						if(err){ throw err; }
						mybot.sendMessage(message.channel, "NSFW Commands enabled for channel.");
					});
				}
			}
		}else if(args[0] == settings['prefix']['main']+"toggle" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1] == "toggle"){
			if(settings["admins"].indexOf(message.author.id) > -1 || checkRole(message, settings['adminrole'])){
				if(args.length == 2){
					cmd = args[1];
					if(Object.keys(commands).indexOf(cmd) > -1){
						var tgl = toggled[cmd];
						var id = message.channel.server.id;
						var index = tgl.indexOf(id);

						if(index > -1){
							tgl.splice(index, 1);
							mybot.sendMessage(message.channel, "Command "+cmd+" enabled for server.");
						}else{
							toggled[cmd].push(id);
							mybot.sendMessage(message.channel, "Command "+cmd+" disabled for server.");
						}

						saveToggle();
					}
				}
			}
		}else{
			if(args[0].substring(0, settings['prefix']['main'].length) == settings['prefix']['main'] || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">"){
				var cmd;
				if(settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">"){
					cmd = args[1];
					args = args.splice(1, args.length).join(" ").split(" ");
				}else{
					cmd = args[0].replace(settings['prefix']['main'], "");
				}

				var index = Object.keys(commands).indexOf(cmd);
				var disabled = toggled[cmd].indexOf(message.channel.server.id);

				if(index > -1 && disabled == -1){
					if(!commands[cmd].nsfw){
						var now = new Date().valueOf();
						if(!lastExecTime.hasOwnProperty(cmd)){
							lastExecTime[cmd] = {};
						}

						if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
							lastExecTime[cmd][message.author.id] = new Date().valueOf();
						}

						if(settings["admins"].indexOf(message.author.id) == -1 || !checkRole(message, settings['adminrole'])){
							if(now < lastExecTime[cmd][message.author.id] + (commands[cmd].cooldown * 1000) && firstTime[cmd].hasOwnProperty(message.author.id)){
								mybot.sendMessage(message, message.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][message.author.id] + commands[cmd].cooldown * 1000) - now) / 1000) + " seconds)", function(e, m){ mybot.deleteMessage(m, {"wait": 6000}); });
								if (!message.channel.isPrivate) mybot.deleteMessage(message, {"wait": 10000});
								return;
							}else{
								commands[cmd].process(args, message, mybot, settings);
								lastExecTime[cmd][message.author.id] = now;
								firstTime[cmd][message.author.id] = true;
							}
						}else{
							commands[cmd].process(args, message, mybot, settings);
						}

					}else{
						if(nsfwChans.indexOf(message.channel.id) > -1 || message.channel.isPrivate){
							var now = new Date().valueOf();
							if(!lastExecTime.hasOwnProperty(cmd)){
								lastExecTime[cmd] = {};
							}

							if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
								lastExecTime[cmd][message.author.id] = new Date().valueOf();
							}

							if(settings["admins"].indexOf(message.author.id) == -1 || !checkRole(message, settings['adminrole'])){
								if(now < lastExecTime[cmd][message.author.id] + (commands[cmd].cooldown * 1000)){
									mybot.sendMessage(message, message.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][message.author.id] + commands[cmd].cooldown * 1000) - now) / 1000) + " seconds)", function(e, m){ mybot.deleteMessage(m, {"wait": 6000}); });
									if(!message.channel.isPrivate) mybot.deleteMessage(message, {"wait": 10000});
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
		}
	}
});

init();

mybot.on("error", function(err){
	console.log(chalk.red("[Error] "+err));
});

mybot.on("warn", function(warn){
	//console.log("[Warn] "+warn);
});

mybot.on("ready", function(){
	console.log(chalk.green("Ready."));
});

mybot.on("serverCreated", function(server){
	console.log("Joined server: "+server.name);
});

stdin.addListener("data", function(d) {
    mybot.sendMessage(mybot.channels[0], d.toString().trim());
});

process.on('uncaughtException', function(err){
  console.log("Caught exception: "+err.stack);
});