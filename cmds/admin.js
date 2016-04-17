var request = require("request");
var fs = require("fs");

var helper = require("../util/Helper.js");
var nsfwChans = require("../data/nsfw.json");
var ignored = require("../data/ignored.json");
var toggled = require("../data/toggled.json");
var settings = require("../settings.json");

var misc = require("./misc.js").misc;
var util = require("./util.js").util;
var nsfw = require("./nsfw.js").nsfw;
var defaults = require("./defaults.js").defaults;

var commands = helper.extend({}, misc, admin, util, nsfw, defaults);

var admin = {
	"topic": {
		process: function(args, message, bot){
			var admins = settings["admins"];
			if(admins.indexOf(message.author.id) > -1){
				if(args.length >= 2){
					bot.setChannelTopic(message.channel, args.splice(1, args.length).join(" "), function(error){
						if(error){ console.log(error);}
					});
				}
			}
		},
		"desc": "Change the topic",
		"usage": "topic `topic`",
		"cooldown": 0
	},
	"status": {
		process: function(args, message, bot){
			var admins = settings["admins"];
			if(admins.indexOf(message.author.id) > -1){
				if(args.length >= 2){
					bot.setStatus('online', args.splice(1, args.length).join(" "));
				}
			}
		},
		"desc": "Set the bot status",
		"usage": "status `status`",
		"cooldown": 0
	},
	"eval": {
		process: function(args, message, bot){
			var admin = settings["owner"];
			if(admin == message.author.id){
				if(args.length >= 2){
					try{
						bot.sendMessage(message.channel, "```js\n"+eval(args.splice(1, args.length).join(" "))+"```");
					}catch(e){
						bot.sendMessage(message.channel, "```js\n"+e+"```");
					}
				}
			}
		},
		"desc": "Eval",
		"usage": "eval `string`",
		"cooldown": 0
	},
	"avatar": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var owner = settings["owner"];
				if(message.author.id == owner){
					request.get({url: args[1], encoding: null}, function(error, response, body){
					    if(!error && response.statusCode == 200){
					    	console.dir(response.headers["content-type"]);
					        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
					        if(data != undefined && data != null){
						        bot.setAvatar(data, function(err){
						        	if(!err){
						        		bot.sendMessage(message.channel, "Updated avatar");
						        	}else{
						        		console.dir(err);
						        	}
						        });
						    }else{
						    	console.log("Data not defined");
						    }
					    }else{
					    	console.log(error);
					    }
					});
				}
			}
		},
		"desc": "Sets the bot avatar",
		"usage": "avatar `Image URL`",
		"cooldown": 0
	},
	"nsfw": {
		process: function(args, message, bot){
			console.log(nsfwChans);
			if(settings["admins"].indexOf(message.author.id) > -1 || helper.checkRole(message, settings['adminrole'])){
				var chan = message.channel.id;
				if(nsfwChans.indexOf(chan) > -1){
					nsfwChans.splice(nsfwChans.indexOf(chan), 1);
					fs.writeFile("./data/nsfw.json", JSON.stringify(nsfwChans), 'utf8', function(err){
						if(err){ throw err; }
						bot.sendMessage(message.channel, "NSFW Commands disabled for channel.");
					});
				}else{
					nsfwChans.push(chan);
					fs.writeFile("./data/nsfw.json", JSON.stringify(nsfwChans), 'utf8', function(err){
						if(err){ throw err; }
						bot.sendMessage(message.channel, "NSFW Commands enabled for channel.");
					});
				}
			}
		},
		"desc": "Toggles NSFW commands",
		"usage": "nsfw",
		"cooldown": 10
	},
	"ignore": {
		process: function(args, message, bot){
			if(settings['owner'] == message.author.id){
				var toI;
				if(args.length == 2){
					toI = args[1].replace(/<@/gmi, "").replace(/>/gmi, "");
				}

				if(ignored.indexOf(toI) > -1){
					ignored.splice(ignored.indexOf(toI), 1);
					fs.writeFile("./data/ignored.json", JSON.stringify(ignored), 'utf8', function(err){
						if(err){ throw err; }
					});
					bot.sendMessage(message.channel, "No longer ignoring <@"+toI+">");
				}else{
					ignored.push(toI);
					fs.writeFile("./data/ignored.json", JSON.stringify(ignored), 'utf8', function(err){
						if(err){ throw err; }
					});
					bot.sendMessage(message.channel, "Ignoring <@"+toI+">");
				}
			}
		},
		"desc": "Ignores users",
		"usage": "ignore ``user``",
		"cooldown": 10
	},
	"toggle": {
		process: function(args, message, bot){
			if(settings["admins"].indexOf(message.author.id) > -1 || helper.checkRole(message, settings['adminrole'])){
				if(args.length == 2){
					cmd = args[1];
					if(Object.keys(commands).indexOf(cmd) > -1){
						var tgl = toggled[cmd];
						var id = message.channel.server.id;
						var index = tgl.indexOf(id);

						if(index > -1){
							tgl.splice(index, 1);
							fs.writeFile("./data/toggled.json", JSON.stringify(toggled), 'utf8', function(err){
								if(err){ throw err; }
								bot.sendMessage(message.channel, "Command "+cmd+" enabled for server.");
							});
						}else{
							toggled[cmd].push(id);
							fs.writeFile("./data/toggled.json", JSON.stringify(toggled), 'utf8', function(err){
								if(err){ throw err; }
								bot.sendMessage(message.channel, "Command "+cmd+" disabled for server.");
							});
						}
					}
				}
			}
		},
		"desc": "Toggles commmands",
		"usage": "toggle ``command``",
		"cooldown": 10
	},
	"clean": {
		process: function(args, message, bot){
			if(settings["admins"].indexOf(message.author.id) > -1){
				var toDelete = 25;

				bot.getChannelLogs(message.channel, 250, function(error, messages){
					if(args.length >= 2){
						toDelete = Number(args[1]);
					}
					var dones = 0;
					for(i= 0;i<=100;i++){
						if(toDelete <= 0){
							bot.sendMessage(message, "Deleted **" + dones + "** messages in " + message.channel + ".");
							return;
						}

						if(messages[i].author.id == bot.user.id){
							bot.deleteMessage(messages[i]);
							dones++;
							toDelete--;
						}
					}
				});
			}
		},
		"desc": "Cleans bot messages",
		"usage": "clean ``[amount]``",
		"cooldown": 10
	}
}

exports.admin = admin;