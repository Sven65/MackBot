var helper = require("../util/Helper.js");
var fs = require("fs");
var request = require('request');
var parseString = require('xml2js').parseString;
var fix = require('entities');
var os = require("os");
var mathjs = require("mathjs");

var util = {
	"8ball": {
		process: function(args, message, bot, settings){
			var reply = ["It is certain", "It is decidedly so",
				"Without a doubt", "Yes, definitely", 
				"You may rely on it", "As I see it, yes", 
				"Most likely", "Outlook good", "Yes", "Signs point to yes",
				"Reply hazy try again", "Ask again later",
				"Better not tell you now", "Cannot predict now",
				"Concentrate and ask again", "Don't count on it",
				"My reply is no", "My sources say no",
				"Outlook not so good", "Very doubtful"];

			if(args.length >= 2){
				bot.reply(message, reply[helper.rInt(0, reply.length-1)]);
			}else{
				bot.sendMessage(message.channel, "Usage: !8ball [question]");
			}
		},
		"desc": "A magic 8ball!",
		"usage": "8ball `question`",
		"cooldown": 10
	},
	"addword": {
		process: function(args, message, bot, settings){

			if(args.length >= 2){
				fs.readFile('words.txt', 'utf8', function(err, data){
				
					if(err){ throw err; }
					words = data.split("\n");

					console.log(words.indexOf(args[1]));
					if(helper.indexx(words, args[1].toLowerCase()) > -1){
						bot.reply(message, "I already know that word!");
					}else{
						fs.appendFile('./words.txt', '\n'+args[1], 'utf8', function(err){
							if(err){ throw err; }
						});
						bot.sendMessage(message.channel, "Added word: "+args[1]);
					}
				});
			}else{
				bot.sendMessage(message.channel, "Usage: !addword [word]");
			}
		},
		"desc": "Adds a word to the list",
		"usage": "addword `word`",
		"cooldown": 10
	},
	"anime": {
		process: function(args, message, bot, settings){

			if(args.length >= 2){
				

				var anime = args.splice(1, args.length).join("+");
				var apiURL = "http://myanimelist.net/api/anime/search.xml?q="+anime;

				request(apiURL, {"auth": {"user": settings['mal']['name'], "pass": settings['mal']['pass'], "sendImmediately": true}},
					function(error, response, body){
						if(error){ console.log(error); }
						if(!error && response.statusCode == 200){
							parseString(body, function(err, result){
								var animeArray = [];
								var synopsis = result.anime.entry[0].synopsis.toString();
								synopsis = synopsis.replace(/<br \/>/g, " ");
								synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
								synopsis = synopsis.replace(/\r?\n|\r/g, " ");
								synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
								synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
								synopsis = fix.decodeHTML(synopsis);
								if(synopsis.length > 1000){synopsis = synopsis.substring(0, 1000); synopsis += "...";}
								animeArray.push("__**" + result.anime.entry[0].title + "**__ - __**" + result.anime.entry[0].english + "**__ • *" + result.anime.entry[0].start_date + "*  to *" + result.anime.entry[0].end_date + "*\n");
								animeArray.push("**Type:** *" + result.anime.entry[0].type + "*  **Episodes:** *" + result.anime.entry[0].episodes + "*  **Score:** *" + result.anime.entry[0].score + "*");
								animeArray.push(synopsis);
								bot.sendMessage(message.channel, animeArray);
							});
						}
					});
			}
		},
		"desc": "Shows info about anime",
		"usage": "anime `anime`",
		"cooldown": 10
	},
	"define": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join("+");
				request('http://api.urbandictionary.com/v0/define?term='+term, function(error, response, body){
					if(!error && response.statusCode == 200){
						var data = JSON.parse(body);
						if(data["result_type"] != "no_results"){
							var defArr = [];
							var def = data["list"][0]["definition"];

							def = def.replace(/<br \/>/g, " ");
							def = def.replace(/\[(.{1,10})\]/g, "");
							def = def.replace(/\r?\n|\r/g, " ");
							def = def.replace(/\[(i|\/i)\]/g, "*");
							def = def.replace(/\[(b|\/b)\]/g, "**");
							def = fix.decodeHTML(def);


							var example = data["list"][0]["example"];

							example = example.replace(/<br \/>/g, " ");
							example = example.replace(/\[(.{1,10})\]/g, "");
							example = example.replace(/\r?\n|\r/g, " ");
							example = example.replace(/\[(i|\/i)\]/g, "*");
							example = example.replace(/\[(b|\/b)\]/g, "**");
							example = fix.decodeHTML(example);


							if(def.length > 1000){def = def.substring(0, 1000); def += "...";}
							if(example.length > 250){example = example.substring(0, 250); example += "...";}
							defArr.push("__**"+term.replace(/\+/g, " ")+"**__\n");
							defArr.push("**Definition:** "+def);
							defArr.push("**Example:** "+example);

							bot.sendMessage(message.channel, defArr);
						}else{
							bot.sendMessage(message.channel, "No definition for "+term.replace(/\+/g, " ")+".");
						}
					}else{
						console.log(error);
					}
				});
			}
		},
		"desc": "Defines a term.",
		"usage": "define `term`",
		"cooldown": 10
	},
	"hug": {
		process: function(args, message, bot, settings){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
				if(usr == ""){
					usr = message.sender.name;
				}
			}else{
				usr = message.sender.name;
			}

			bot.sendMessage(message.channel, "*hugs "+usr+"*");
		},
		"desc": "Hugs!",
		"usage": "hug `(user)`",
		"cooldown": 10
	},
	"mal": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				request('http://myanimelist.net/malappinfo.php?u='+args[1]+'&status=all&type=anime', function (error, response, body) {
				  if (!error && response.statusCode == 200){
				  	parseString(body, function (err, result) {
		    			var data = JSON.parse(JSON.stringify(result))['myanimelist'];
		    			if(data !== undefined){
		    				if(data.hasOwnProperty("error")){
		    					bot.sendMessage(message.channel, data["error"]);
		    				}else{
		    					console.dir(data["myinfo"][0]["user_name"]);
		    					data = data["myinfo"][0];
				    			bot.sendMessage(message.channel, "Anime stats of "+data["user_name"]+": Watching "+data["user_watching"]+" animes, Completed "+data["user_completed"]+" animes, Plan to watch "+data["user_plantowatch"]+" animes, Dropped "+data["user_dropped"]+" animes and "+data["user_onhold"]+" animes on hold. "+data["user_name"]+" has spent "+data["user_days_spent_watching"]+" days watching anime.");
				    		}
				    	}
					});
				    
				  }
				});
			}
		},
		"desc": "Shows info about a MAL user",
		"usage": "mal `user`",
		"cooldown": 10
	},
	"ping": {
		process: function(args, message, bot, settings){
			bot.reply(message, "Pong!");
		},
		"desc": "Pong!",
		"usage": "ping",
		"cooldown": 10
	},
	"roll": {
		process: function(args, message, bot, settings){
			if(args.length >= 3){
				min = Number(args[1]);
				max = Number(args[2]);

				num = helper.rInt(min, max);

				bot.sendMessage(message.channel, "Rolled number: "+num);
			}else{
				bot.sendMessage(message.channel, "Usage: !roll [min] [max]");
			}
		},
		"desc": "Rolls a random number.",
		"usage": "roll `min` `max`",
		"cooldown": 10
	},
	"slap": {
		process: function(args, message, bot, settings){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
			}else{
				usr = message.sender.name;
			}

			bot.sendMessage(message.channel, "*slaps "+usr+"*");
		},
		"desc": "Slaps!",
		"usage": "slap `[user]`",
		"cooldown": 10
	},
	"uptime": {
		process: function(args, message, bot, settings){
			up = helper.fTime(os.uptime());
			bot.sendMessage(message.channel, "Uptime: "+up);
		},
		"desc": "The physical servers uptime.",
		"usage": "uptime",
		"cooldown": 10
	},
	"words": {
		process: function(args, message, bot, settings){
			var words = [];
			var word = "";

			fs.readFile('words.txt', 'utf8', function(err, data){
				
				if(err){ throw err; }
				words = data.split("\n");

				amt = 3;
				if(args.length > 1){
					amt = Number(args[1]);
					if(amt > settings["maxwords"]){
						amt = settings["maxwords"];
					}
				}

				for(i=0;i<amt;i++){
					word += words[helper.rInt(0, words.length-1)].replace(/(?:\r\n|\r|\n)/g, '')+" ";
				}

				bot.sendMessage(message.channel, word);
			});
		},
		"desc": "Picks some random words.",
		"usage": "words `[amount]`",
		"cooldown": 10
	},
	"strawpoll": {
		process: function(args, message, bot, settings){
			if(args.length >= 3){

				var options = message.cleanContent.substring(message.cleanContent.indexOf(" ")+1).split(/, ?/);

				request.post({
						"url": "https://strawpoll.me/api/v2/polls",
						"headers": {"content-type": "application/json"},
						"json": true,
						body: {
							"title": "" + message.author.username + "'s Poll",
							"options": options
						}
					}, function(error, response, body){
						if(!error && response.statusCode == 201){
							bot.sendMessage(message, message.author.username.replace(/@/g, '@\u200b') + " created a strawpoll. Vote here: http://strawpoll.me/" + body.id);
						}else if(error){
							bot.sendMessage(msg, error);
						}else if(response.statusCode != 201){
							bot.sendMessage(message, "Got status code " + response.statusCode);
						}
					});
			}
		},
		"desc": "Create a strawpoll.",
		"usage": "strawpoll `option1`, `option2`, `[option3]`, `...`",
		"cooldown": 10
	},
	"request": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				bot.sendMessage("141610251299454976", "__Requested by "+message.author.username+" on the server **"+message.channel.server.name+"**:__\n"+args.splice(1, args.length).join(" "));
			}
		},
		"desc": "Sends a feature request to the maker of this bot.",
		"usage": "request `feature to request`",
		"cooldown": 10
	},
	"calc": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				if(args[1] == "0/0"){
					bot.sendMessage(message.channel, "Pfft. I'm a bot! I can't calculate 0/0!");
				}else{
					var term = args.splice(1, args.length).join(" ");
					try{
						var calc = mathjs.eval(term);
						bot.sendMessage(message.channel, calc);
					}catch(e){
						bot.sendMessage(message.channel, "Error! "+e);
					}
					
					
				}
			}
		},
		"desc": "Calculate math.",
		"usage": "calc `expression`",
		"cooldown": 10
	},
	"currency": {
		process: function(args, message, bot, settings){
			if(args.length >= 4){
				var amt = args[1];
				var from = args[2].toUpperCase();
				var to = args[3].toUpperCase();

				var link = "https://www.google.co.uk/finance/converter?a="+amt+"&from="+from+"&to="+to;

				request(link, function(error, response, body){
					if(!error && response.statusCode == 200){
						var result = body.match(/\<span class=bld\>(.+?)\<\/span\>/gmi)[0];
						if(result != undefined){
							bot.sendMessage(message.channel, amt+" "+from+" is "+result.replace(/\<span class=bld\>/, "").replace(/\<\/span\>/, ""));
						}else{
							bot.sendMessage(message.channel, "Couldn't find any rates!");
						}
					}
				});
			}
		},
		"desc": "Convert currencies.",
		"usage": "currency `amount` `from` `to`",
		"cooldown": 10
	},
};

exports.util = util;