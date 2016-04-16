var Discord = require("discord.js");
var fs = require("fs");
var moment = require("moment");
var chalk = require('chalk');

var mybot = new Discord.Client();

var settings = require("./settings.json");
var toggled = require("./data/toggled.json");
var nsfwChans = require("./data/nsfw.json");
var ignored = require("./data/ignored.json");

var misc = require("./cmds/misc.js").misc;
var admin = require("./cmds/admin.js").admin;
var util = require("./cmds/util.js").util;
var nsfw = require("./cmds/nsfw.js").nsfw;
var defaults = require("./cmds/defaults.js").defaults;
var wolf = require("./cmds/wolf.js").wolf;
var games = require("./cmds/games.js").games;

var commands = extend({}, misc, admin, util, nsfw, defaults, wolf, games);

var stdin = process.openStdin();

var lastExecTime = {};
setInterval(function(){ lastExecTime = {}; },3600000);
var firstTime = {};

var nsfwChans = [];

// Misc functions

function saveToggle(){
	fs.writeFile("./data/toggled.json", JSON.stringify(toggled), 'utf8', function(err){
		if(err){ throw err; }
	});
}

function saveIgnore(){
	fs.writeFile("./data/ignored.txt", ignored.sort().join(","), 'utf8', function(err){
		if(err){ throw err; }
	});
}

function checkRole(message, role){
	if(!message.channel.isPrivate){
		var roles = message.channel.server.rolesOfUser(message.author);
		for(i=0;i<roles.length;i++){
			if(roles[i].name == role){
				return true;
			}
		}
		return false;
	}
	return false;
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

function init(){
	var now = new Date().valueOf();
	for(i=0;i<Object.keys(commands).length;i++){
		firstTime[Object.keys(commands)[i]] = {};
		if(!toggled.hasOwnProperty(Object.keys(commands)[i])){
			toggled[Object.keys(commands)[i]] = [];
		}
	}
	saveToggle();

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

mybot.on("message", function(message){
	try{
		console.log("["+new Date().toUTCString()+"] [Message] "+message.sender.name+" -> "+message.content);

		args = message.content.split(" ");

		if(require("./data/ignored.json").indexOf(message.author.id) == -1){
			if(args[0] == settings['prefix']['main']+"reload" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1] == "reload" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.name.toLowerCase() && args[1] == "reload"){
				if(settings["owner"] == message.author.id){
					// Delete modules
					delete require.cache[require.resolve('./cmds/admin.js')];
					delete require.cache[require.resolve('./cmds/defaults.js')];
					delete require.cache[require.resolve('./cmds/misc.js')];
					delete require.cache[require.resolve('./cmds/nsfw.js')];
					delete require.cache[require.resolve('./cmds/util.js')];
					delete require.cache[require.resolve('./cmds/wolf.js')];
					delete require.cache[require.resolve('./cmds/games.js')];

					commands = {};

					// Require modules

					misc = "";
					admin = "";
					util = "";
					nsfw = "";
					defaults = "";
					wolf = "";
					games = "";

					misc = require("./cmds/misc.js").misc;
					admin = require("./cmds/admin.js").admin;
					util = require("./cmds/util.js").util;
					nsfw = require("./cmds/nsfw.js").nsfw;
					defaults = require("./cmds/defaults.js").defaults;
					wolf = require("./cmds/wolf.js").wolf;
					games = require("./cmds/games.js").games;

					commands = extend({}, misc, admin, util, nsfw, defaults, wolf, games);

					for(i=0;i<Object.keys(commands).length;i++){
						firstTime[Object.keys(commands)[i]] = {};
						if(!toggled.hasOwnProperty(Object.keys(commands)[i])){
							toggled[Object.keys(commands)[i]] = [];
						}
					}

					saveToggle();

					mybot.sendMessage(message.channel, "Reloaded all modules");
				}
			}else if(args[0].substring(0, settings['prefix']['main'].length) == settings['prefix']['main'] || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.name.toLowerCase()){
				var cmd;
				if(settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.name.toLowerCase()){
					cmd = args[1].toLowerCase();
					args = args.splice(1, args.length).join(" ").split(" ");
				}else{
					cmd = args[0].replace(settings['prefix']['main'], "").toLowerCase();
				}

				var index = Object.keys(commands).indexOf(cmd);
				var disabled = -1;

				if(toggled.hasOwnProperty(cmd) && !message.channel.isPrivate){
					disabled = require("./data/toggled.json")[cmd].indexOf(message.channel.server.id);
				}

				if(index > -1 && disabled == -1){
					if(!commands[cmd].nsfw){
						var now = new Date().valueOf();
						if(!lastExecTime.hasOwnProperty(cmd)){
							lastExecTime[cmd] = {};
						}

						if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
							lastExecTime[cmd][message.author.id] = new Date().valueOf();
						}


						if(settings["admins"].indexOf(message.author.id) == -1 && !message.channel.isPrivate && !checkRole(message, settings['adminrole'])){
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
						if(require("./data/nsfw.json").indexOf(message.channel.id) > -1 || message.channel.isPrivate){
							console.log("nsfw");
							var now = new Date().valueOf();
							if(!lastExecTime.hasOwnProperty(cmd)){
								lastExecTime[cmd] = {};
							}

							if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
								lastExecTime[cmd][message.author.id] = new Date().valueOf();
							}

							if(settings["admins"].indexOf(message.author.id) == -1 && !checkRole(message, settings['adminrole'])){
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
	}catch(e){
    	console.log(chalk.red(e.stack));
	}
});

init();

mybot.on("error", function(err){
	console.log(chalk.red("[Error] "+err));
});

mybot.on("warn", function(warn){
	console.log(chalk.yellow("[Warn] "+warn));
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