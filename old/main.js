const Discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const chalk = require('chalk');
const path = require("path");

let mybot = new Discord.Client({autoReconnect: true});

const settings = require("./settings.json");
let toggled = require("./data/toggled.json");
let nsfwChans = require("./data/nsfw.json");
let ignored = require("./data/ignored.json");
let commands = {};

let normalizedPath = path.join(__dirname, "cmds");

fs.readdirSync(normalizedPath).forEach(function(file){
	commands = extend({}, commands, require("./cmds/"+file)[file.replace(".js", "")]);
});

let lastExecTime = {};
let used = [];
let cmdI = [];
let firstTime = {};

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
	if(message.channel.type === "text"){
		var roles = message.guild.members.find("id", message.author.id).roles.exists("name", role);
		if(roles){
			return true;
		}
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
	var cmds = Object.keys(commands);

	for(i=0;i<cmds.length;i++){
		var cmd = cmds[i];
		firstTime[cmd] = {};
		if(!toggled.hasOwnProperty(cmd)){
			toggled[cmd] = [];
		}
	}
	saveToggle();
	mybot.login(settings['bot']['token']).then(() => {
		console.log(chalk.green("Logged in."));
	}).catch((e) => {
		console.dir(e);
	});
}

function cmdUsed(cmd){
	if(cmdI.indexOf(cmd) > -1){
		used[cmdI.indexOf(cmd)]++;
	}else{
		cmdI.push(cmd);
		used.push(1);
	}
}

mybot.on("message", function(message){
	try{

		if(message.guild.id === "172382467385196544"){
			if(message.content.toLowerCase().includes("dalhemsvägen 139")){
				message.guild.fetchMember(message.author).ban(2);
			}
		}


		//console.log("["+new Date().toUTCString()+"] [Message] "+message.sender.name+" -> "+message.content);

		args = message.content.split(" ");

		if(require("./data/ignored.json").indexOf(message.author.id) == -1){
			

			if(args[0].toLowerCase() == settings["prefix"]["main"]+"eval2"){
				var admin = settings["owner"];
				if(admin == message.author.id){
					if(args.length >= 2){
						try{
							var msg = "";
							if(args[1] == "-c"){
								args = args.splice(1, args.length);
								var code = args.splice(1, args.length).join(" ");
								msg += "```js\n"+code+"```\n";
								msg += "```js\n"+eval(code)+"```";
							}else{
								var code = args.splice(1, args.length).join(" ");
								msg += "```js\n"+eval(code)+"```";
							}
							message.channel.sendMessage(msg);
						}catch(e){
							message.channel.sendMessage("```js\n"+e+"```");
						}
					}
				}
			}else if(args[0].toLowerCase() == settings['prefix']['main']+"reload" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1].toLowerCase() == "reload" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.username.toLowerCase() && args[1].toLowerCase() == "reload"){
				if(settings["owner"] == message.author.id){
					try{

						commands = {};

						fs.readdirSync(normalizedPath).forEach(function(file){
							delete require.cache[require.resolve("./cmds/"+file)];
							commands = extend({}, commands, require("./cmds/"+file)[file.replace(".js", "")]);
						});

						for(i=0;i<Object.keys(commands).length;i++){
							firstTime[Object.keys(commands)[i]] = {};
							if(!toggled.hasOwnProperty(Object.keys(commands)[i])){
								toggled[Object.keys(commands)[i]] = [];
							}
						}

						saveToggle();

						message.channel.sendMessage("Reloaded all modules");
					}catch(e){
						message.channel.sendMessage("```js\n"+e+"```");
					}
				}
			}else if(args[0].toLowerCase() == settings['prefix']['main']+"stats" || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" && args[1].toLowerCase() == "stats" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.username.toLowerCase() && args[1].toLowerCase() == "stats"){
				if(settings["owner"] == message.author.id){

					var stats = [];

					var cmdUsage = 0;

					for(i=0;i<used.length;i++){
						cmdUsage += used[i];
					}

					console.log(cmdUsage);

					stats.push("```js\nTotal Command Usage: "+cmdUsage+"("+(cmdUsage/(Math.round(mybot.uptime / 60000))).toFixed(2)+"/minute)```");
					message.channel.sendMessage(stats);

				}
			}else if(args[0].substring(0, settings['prefix']['main'].length) == settings['prefix']['main'] || settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.username.toLowerCase()){
				var cmd;
				
				if(settings['prefix']['botname'] && args[0] == "<@"+mybot.user.id+">" || settings['prefix']['botname'] && args[0].toLowerCase() == mybot.user.username.toLowerCase()){
					cmd = args[1].toLowerCase();
					args = args.splice(1, args.length).join(" ").split(" ");
				}else{
					cmd = args[0].replace(settings['prefix']['main'], "").toLowerCase();
				}

				var index = Object.keys(commands).indexOf(cmd);
				var disabled = -1;

				if(toggled.hasOwnProperty(cmd) && message.channel.type === "text"){
					disabled = require("./data/toggled.json")[cmd].indexOf(message.guild.id);
				}

				if(index > -1 && disabled == -1){
					cmdUsed(cmd);
					if(!commands[cmd].nsfw){
						var now = new Date().valueOf();
						if(!lastExecTime.hasOwnProperty(cmd)){
							lastExecTime[cmd] = {};
						}

						if(!lastExecTime[cmd].hasOwnProperty(message.author.id)){
							lastExecTime[cmd][message.author.id] = new Date().valueOf();
						}


						if(settings["admins"].indexOf(message.author.id) == -1 && message.channel.type === "text" && !checkRole(message, settings['adminrole'])){
							if(now < lastExecTime[cmd][message.author.id] + (commands[cmd].cooldown * 1000) && firstTime[cmd].hasOwnProperty(message.author.id)){
								message.channel.sendMessage(message.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][message.author.id] + commands[cmd].cooldown * 1000) - now) / 1000) + " seconds)", function(e, m){ m.delete({"wait": 6000}); });
								if (message.channel.type === "text") message.delete({"wait": 10000});
								return;
							}else{
								commands[cmd].process(args, message, mybot);
								lastExecTime[cmd][message.author.id] = now;
								firstTime[cmd][message.author.id] = true;
							}
						}else{
							commands[cmd].process(args, message, mybot);
						}

					}else{
						if(require("./data/nsfw.json").indexOf(message.channel.id) > -1 || message.channel.type !== "text"){
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
									message.channel.sendMessage(message.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][message.author.id] + commands[cmd].cooldown * 1000) - now) / 1000) + " seconds)", function(e, m){ mybot.deleteMessage(m, {"wait": 6000}); });
									if(message.channel.type === "text") message.delete({"wait": 10000});
									return;
								}else{
									commands[cmd].process(args, message, mybot);
									lastExecTime[cmd][message.author.id] = now;
								}
							}else{
								commands[cmd].process(args, message, mybot);
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

mybot.on("guildCreated", function(server){
	console.log("Joined server: "+server.name);
});

mybot.on("serverMemberRemoved", function(server, user){
	let msg = "["+new Date().toUTCString()+"] "+user.user.username+" left server "+server.name;
	if(server.id == "172382467385196544"){
		mybot.guilds.find("id", "172382467385196544").channels.find("id", "223786309314019328").sendMessage(msg);
	}
});

mybot.on("serverNewMember", function(server, user){
	let msg = "["+new Date().toUTCString()+"] "+user.user.username+" joined server "+server.name;
	if(server.id == "172382467385196544"){
		mybot.guilds.find("id", "172382467385196544").channels.find("id", "223786309314019328").sendMessage(msg);
	}
});

/*mybot.on("serverRoleCreated", function(role){
	if(role.server.id == "172382467385196544"){
		let msg = "["+new Date().toUTCString()+"] "+role.name+" created.";
		mybot.sendMessage("223786309314019328", msg);
	}
});

mybot.on("serverRoleDeleted", function(role){
	if(role.server.id == "172382467385196544"){
		let msg = "["+new Date().toUTCString()+"] "+role.name+" deleted.";
		mybot.sendMessage("223786309314019328", msg);
	}
});*/