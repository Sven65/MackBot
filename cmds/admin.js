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
	}

};

exports.admin = admin;