var helper = require("../util/Helper.js");
var fs = require("fs");
var request = require("request");
var settings = require("../settings.json");
var profiles = require("../data/profiles.json");

var blacklist = ["http://i.giphy.com/12CvxNY8J5utEs.gif"];

String.prototype.capFirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var profile = {
	"profile": {
		process: function(args, message, bot){
			var user = message.author.id;
			var name = message.author.username;
			var pic = message.author.avatarURL;
			if(message.mentions.users.size > 0){
				if(message.mentions.users[0].id != bot.user.id){
					user = message.mentions.users[0].id;
					name = message.mentions.users[0].username;
					pic = message.mentions.users[0].avatarURL;
				}else{
					if(message.mentions.users.size >= 1){
						user = message.mentions.users[1].id;
						name = message.mentions.users[1].username;
						pic = message.mentions.users[1].avatarURL;
					}
				}
			}

			

			if(!profiles.hasOwnProperty(user)){
				message.channel.sendMessage(name+" has no profile!");
				return;
			}

			var msg = "Profile for **"+name+"**";
			var keys = Object.keys(profiles[user]);
			msg += "```\n";
			console.dir(keys);
			for(i=0;i<keys.length;i++){
				if(profiles[user][keys[i]] != undefined){
					if(profiles[user][keys[i]].length >= 0){
						console.log(profiles[user][keys[i]]);
						msg += "\n"+keys[i].capFirst()+": "+profiles[user][keys[i]];
					}
				}
			}

			msg += "```";
			
			message.channel.sendMessage(msg);

			if(pic != null){
				message.channel.sendMessage(pic);
			}

		},
		"desc": "Shows a user profile",
		"usage": "profile ``[user]``",
		"cooldown": 10
	},
	"cprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(profiles.hasOwnProperty(user)){
				message.channel.sendMessage("Hey! "+message.author.username+", You already have a profile!");
				return;
			}
			profiles[user] = {
				"location": "",
				"about": "",
				"email": "",
				"league": "",
				"minecraft": "",
				"steam": "",
				"timezone": "",
				"twitch": "",
				"twitter": "",
				"youtube": "",
				"reddit": "",
				"mal": ""
			};

			fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
				if(err){ message.channel.sendMessage("```js\n"+err+"```"); return; }
				message.channel.sendMessage("Created profile for "+message.author.username);
			});
		},
		"desc": "Creates a profile",
		"usage": "cprofile",
		"cooldown": 10
	},
	"setprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(!profiles.hasOwnProperty(user)){
				message.channel.sendMessage("Hey! "+message.author.username+", You have no profile!");
				return;
			}
			if(args.length >= 3){
				var method = args[1].toLowerCase();
				var data = args.splice(2, args.length).join(" ");

				data = data.replace(/\`/gmi, "");
				console.log("data: "+data);

				for(i=0;i<message.mentions.users.size;i++){
					data = data.replace(new RegExp("<@"+message.mentions.users[i].id+">", "gmi"), "@"+message.mentions.users[i].name);
				}

				console.log("data: "+data);

				profiles[user][method] = data;

				fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
					if(err){ message.channel.sendMessage("```js\n"+err+"```"); return; }
					message.channel.sendMessage("Set field ``"+method+"`` for "+message.author.username);
				});
			}
		},
		"desc": "Sets a profile field for user",
		"usage": "setprofile ``field`` ``data``",
		"cooldown": 10
	},
	"delprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(args.length >= 2){
				if(message.author.id == settings["owner"]){
					var user = message.mentions.users[0].id;

					delete profiles[user];

					fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
						if(err){ message.channel.sendMessage("```js\n"+err+"```"); return; }
						message.channel.sendMessage("Deleted profile of "+message.mentions.users[0].username);
						return;
					});
				}
			}else{
				if(!profiles.hasOwnProperty(user)){
					message.channel.sendMessage("Hey! "+message.author.username+", You have no profile!");
					return;
				}else{
					delete profiles[user];

					fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
						if(err){ message.channel.sendMessage("```js\n"+err+"```"); return; }
						message.channel.sendMessage("Deleted profile of "+message.author.username);
						return;
					});
					return;
				}
			}
		},
		"desc": "Deletes a profile",
		"usage": "delprofile",
		"cooldown": 10
	}
};

exports.profiles = profile;