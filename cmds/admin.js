var request = require("request");
var fs = require("fs");

var admin = {
	"topic": {
		process: function(args, message, bot, settings){
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
		process: function(args, message, bot, settings){
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
		process: function(args, message, bot, settings){
			var admin = settings["owner"];
			if(admin == message.author.id){
				if(args.length >= 2){
					try{
						bot.sendMessage(message.channel, eval(args.splice(1, args.length).join(" ")));
					}catch(e){
						bot.sendMessage(message.channel, e);
					}
				}
			}
		},
		"desc": "Eval",
		"usage": "eval `string`",
		"cooldown": 0
	},
	"avatar": {
		process: function(args, message, bot, settings){
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
	}

};

exports.admin = admin;