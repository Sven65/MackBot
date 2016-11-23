var helper = require("../util/Helper.js");
var fs = require("fs");
var request = require('request');
var parseString = require('xml2js').parseString;
var fix = require('entities');
var os = require("os");
var mathjs = require("mathjs");
var moment = require("moment");
var process = require("process");
var cancer = require("../util/Cancer.js");
var qr = require('node-qr-image');
var images = require("../data/images.json");
var tags = require("../data/tags.json");
var useful = require('useful-module');
var settings = require("../settings.json");
var todo = require("../data/todo.json");
var urlencode = require('urlencode');

var giveArray = [];
var giveStart = false;
var givechan = "";

String.prototype.capFirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var votes = {};

var util = {
	"8ball": {
		process: function(args, message, bot){
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
				message.channel.sendMessage("<@"+message.author.id+"> "+reply[helper.rInt(0, reply.length-1)]);
			}else{
				message.channel.sendMessage("Usage: !8ball [question]");
			}
		},
		"desc": "A magic 8ball!",
		"usage": "8ball `question`",
		"cooldown": 10
	},
	"addword": {
		process: function(args, message, bot){

			if(args.length >= 2){
				fs.readFile('words.txt', 'utf8', function(err, data){
				
					if(err){ throw err; }
					words = data.split("\n");

					console.log(words.indexOf(args[1]));
					if(helper.indexx(words, args[1].toLowerCase()) > -1){
						message.channel.sendMessage("<@"+message.author.id+"> I already know that word!");
					}else{
						fs.appendFile('./words.txt', '\n'+args[1], 'utf8', function(err){
							if(err){ throw err; }
						});
						message.channel.sendMessage("Added word: "+args[1]);
					}
				});
			}else{
				message.channel.sendMessage("Usage: !addword [word]");
			}
		},
		"desc": "Adds a word to the list",
		"usage": "addword `word`",
		"cooldown": 10
	},
	"anime": {
		process: function(args, message, bot){

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
								animeArray.push("__**" + result.anime.entry[0].title + "**__ - __**" + result.anime.entry[0].english +" - ["+result.anime.entry[0].status[0]+"] "+ "**__ • *" + result.anime.entry[0].start_date + "*  to *" + result.anime.entry[0].end_date + "*\n");
								animeArray.push("**Type:** *" + result.anime.entry[0].type + "*  **Episodes:** *" + result.anime.entry[0].episodes + "*  **Score:** *" + result.anime.entry[0].score + "*");
								animeArray.push(synopsis);
								message.channel.sendMessage(animeArray.join("\n"));
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
		process: function(args, message, bot){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join("+");
				request('http://api.urbandictionary.com/v0/define?term='+term, function(error, response, body){
					if(!error && response.statusCode == 200){
						var data = JSON.parse(body);
						if(data["result_type"] != "no_results"){
							var defArr = [];
							var def = data["list"][0]["definition"];

							def = def.replace(/<br \/>/g, " ");
							//def = def.replace(/\[(.{1,10})\]/g, "");
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
							defArr.push("__**"+data["list"][0]["word"].replace(/\+/g, " ").capFirst()+"**__ By __**"+data["list"][0]["author"]+"**__\n");
							defArr.push("**Definition:** "+def);
							defArr.push("**Example:** "+example);
							defArr.push("\n\n[***<"+data["list"][0]["permalink"]+">***]");

							message.channel.sendMessage(defArr.join("\n"));
						}else{
							message.channel.sendMessage("No definition for "+term.replace(/\+/g, " ").capFirst()+".");
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
		process: function(args, message, bot){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
				if(usr == ""){
					usr = message.author.username;
				}
			}else{
				usr = message.author.username;
			}

			message.channel.sendMessage("*hugs "+usr+"*");
		},
		"desc": "Hugs!",
		"usage": "hug `(user)`",
		"cooldown": 10
	},
	"mal": {
		process: function(args, message, bot){
			if(args.length >= 2){
				request('http://myanimelist.net/malappinfo.php?u='+args[1]+'&status=all&type=anime', function (error, response, body) {
				  if (!error && response.statusCode == 200){
				  	parseString(body, function (err, result) {
		    			var data = JSON.parse(JSON.stringify(result))['myanimelist'];
		    			if(data !== undefined){
		    				if(data.hasOwnProperty("error")){
		    					message.channel.sendMessage(data["error"]);
		    				}else{
		    					console.dir(data["myinfo"][0]["user_name"]);
		    					data = data["myinfo"][0];
				    			message.channel.sendMessage("Anime stats of "+data["user_name"]+": Watching "+data["user_watching"]+" animes, Completed "+data["user_completed"]+" animes, Plan to watch "+data["user_plantowatch"]+" animes, Dropped "+data["user_dropped"]+" animes and "+data["user_onhold"]+" animes on hold. "+data["user_name"]+" has spent "+data["user_days_spent_watching"]+" days watching anime.");
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
	"roll": {
		process: function(args, message, bot){
			if(args.length >= 3){
				min = Number(args[1]);
				max = Number(args[2]);

				num = helper.rInt(min, max);

				message.channel.sendMessage("Rolled number: "+num);
			}else{
				message.channel.sendMessage("Usage: !roll [min] [max]");
			}
		},
		"desc": "Rolls a random number.",
		"usage": "roll `min` `max`",
		"cooldown": 10
	},
	"slap": {
		process: function(args, message, bot){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
			}else{
				usr = message.author.username;
			}

			message.channel.sendMessage("*slaps "+usr+"*");
		},
		"desc": "Slaps!",
		"usage": "slap `[user]`",
		"cooldown": 10
	},
	"uptime": {
		process: function(args, message, bot){
			up = helper.fTime(os.uptime());
			botup = helper.fTime(process.uptime());
			message.channel.sendMessage("Uptime: "+up+"\nBot uptime: "+botup);
		},
		"desc": "The physical servers uptime.",
		"usage": "uptime",
		"cooldown": 10
	},
	"words": {
		process: function(args, message, bot){
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

				message.channel.sendMessage(word);
			});
		},
		"desc": "Picks some random words.",
		"usage": "words `[amount]`",
		"cooldown": 10
	},
	"strawpoll": {
		process: function(args, message, bot){
			if(args.length >= 4){

				var options = message.cleanContent.substring(message.cleanContent.indexOf(" ")+1).split(/, ?/);

				request.post({
						"url": "https://strawpoll.me/api/v2/polls",
						"headers": {"content-type": "application/json"},
						"json": true,
						body: {
							"title": "" + options[0],
							"options": options.splice(1, options.length)
						}
					}, function(error, response, body){
						if(!error && response.statusCode == 201){
							message.channel.sendMessage(message.author.username.replace(/@/g, '@\u200b') + " created a strawpoll. Vote here: http://strawpoll.me/" + body.id);
						}else if(error){
							message.channel.sendMessage(error);
						}else if(response.statusCode != 201){
							message.channel.sendMessage("Got status code " + response.statusCode);
						}
					});
			}
		},
		"desc": "Create a strawpoll.",
		"usage": "strawpoll `question`, `option1`, `option2`, `[option3]`, `...`",
		"cooldown": 10
	},
	"request": {
		process: function(args, message, bot){
			if(args.length >= 2){
				bot.users.find("id", "141610251299454976").sendMessage("__Requested by "+message.author.username+" on the server **"+message.guild.name+"**:__\n"+args.splice(1, args.length).join(" "));
			}
		},
		"desc": "Sends a feature request to the maker of this bot.",
		"usage": "request `feature to request`",
		"cooldown": 10
	},
	"calc": {
		process: function(args, message, bot){
			if(args.length >= 2){
				if(args[1] == "0/0"){
					message.channel.sendMessage("Pfft. I'm a bot! I can't calculate 0/0!");
				}else{
					var term = args.splice(1, args.length).join(" ");
					try{
						var calc = mathjs.parse(term);
						var tex = calc.toTex();
						var result = calc.compile().eval();
						message.channel.sendMessage("http://chart.apis.google.com/chart?cht=tx&chl="+urlencode(tex)+"="+result+"\n```js\n"+result+"```");
					}catch(e){
						message.channel.sendMessage("Error! ```js\n"+e+"```");
					}
					
					
				}
			}
		},
		"desc": "Calculate math.",
		"usage": "calc `expression`",
		"cooldown": 2
	},
	"currency": {
		process: function(args, message, bot){
			if(args.length >= 4){
				var amt = args[1];
				var from = args[2].toUpperCase();
				var to = args[3].toUpperCase();

				var link = "https://www.google.co.uk/finance/converter?a="+amt+"&from="+from+"&to="+to;

				request(link, function(error, response, body){
					if(!error && response.statusCode == 200){
						var result = body.match(/\<span class=bld\>(.+?)\<\/span\>/gmi)[0];
						if(result != undefined){
							message.channel.sendMessage(amt+" "+from+" is "+result.replace(/\<span class=bld\>/, "").replace(/\<\/span\>/, ""));
						}else{
							message.channel.sendMessage("Couldn't find any rates!");
						}
					}
				});
			}
		},
		"desc": "Convert currencies.",
		"usage": "currency `amount` `from` `to`",
		"cooldown": 10
	},
	"ruser": {
		process: function(args, message, bot){
			var gender;
			if(args.length >= 2){
				gender = args[1];
			}else{
				gender = "";
			}

			var link = "https://randomuser.me/api/?gender="+gender;

			request(link, function(error, response, body){
				if(!error && response.statusCode == 200){
					var result = JSON.parse(body)["results"][0];
					if(result != undefined){

						var userArr = [];

						userArr.push("__**"+result["name"]["title"].capFirst()+" "+result["name"]["first"].capFirst()+" "+result["name"]["last"].capFirst()+"**__\n\n");
						userArr.push("**Gender: **"+result['gender']+"\n");
						userArr.push("**Location: **"+result["location"]['street']+", "+result["location"]['postcode']+", "+result["location"]['city']+", "+result["location"]['state']+"\n");
						userArr.push("**Birthday: **"+moment.unix(result["dob"]).format("DD/MM/YYYY"));


						message.channel.sendMessage(userArr.join("\n"));
					}else{
						message.channel.sendMessage("Whoops. Something went wrong.");
					}
				}
			});
		},
		"desc": "Generate a random user profile",
		"usage": "ruser `[gender]`",
		"cooldown": 600
	},
	"filter": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join(" ");

				term = term.replace(/mods/gi, "nazis");
				term = term.replace(/mod/gi, "hitler");
				term = term.replace(/witnesses/gi, "these dudes I know");
				term = term.replace(/witness/gi, "this dude I know");
				term = term.replace(/allegedly/gi, "kinda probably");
				term = term.replace(/new study/gi, "tumblr post");
				term = term.replace(/rebuild/gi, "avenge");
				term = term.replace(/space/gi, "spaaaace");
				term = term.replace(/google glass/gi, "virtual boy");
				term = term.replace(/senator/gi, "elf lord");
				term = term.replace(/election/gi, "eating contest");
				term = term.replace(/hacker/gi, "the hacker known as 4chan");
				term = term.replace(/anime fan/gi, "total fucking weeb");
				message.channel.sendMessage(term);
			}
		},
		"desc": "Replaces words",
		"usage": "filter `string`",
		"cooldown": 10
	},
	"giveaway": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var act = args[1];
				if(act == "start"){
					if(settings["admins"].indexOf(message.author.id) > -1){
						if(!giveStart){
							giveStart = true;
							giveChan = message.channel.id;
							message.channel.sendMessage("Giveaway started! Use ``"+settings["prefix"]["main"]+"giveaway join`` to join!");
						}
					}
				}else if(act == "join" && message.channel.id == giveChan){
					if(giveArray.indexOf(message.author.id) == -1 && giveStart){
						giveArray.push(message.author.id);
						message.channel.sendMessage("<@"+message.author.id+"> has been entered into the giveaway and there is now "+giveArray.length+" entries.");
					}else{
						message.channel.sendMessage("<@"+message.author.id+"> you're already entered.");

					}
				}else if(act == "stop"){
					if(settings["admins"].indexOf(message.author.id) > -1){
						if(giveStart){
							giveStart = false;

							let ppl = [];
							ppl[0] = giveArray[helper.rInt(0, giveArray.length-1)];

							giveArray.splice(giveArray.indexOf(ppl[0]), 1);

							ppl[1] = giveArray[helper.rInt(0, giveArray.length-1)];

							giveArray.splice(giveArray.indexOf(ppl[1]), 1);

							ppl[2] = giveArray[helper.rInt(0, giveArray.length-1)];

							giveArray.splice(giveArray.indexOf(ppl[2]), 1);

							message.channel.sendMessage("Giveaway stopped! Out of "+(giveArray.length+3)+" entries, the winner is <@"+ppl[0]+">! Congratulations!\nSecond place: <@"+ppl[1]+">\nThird place: <@"+ppl[2]+">");
							giveArray = [];
						}
					}
				}else if(act == "stats"){
					if(giveStart){
						message.channel.sendMessage(giveArray.length+" Users in the giveaway. Each user has a "+100/giveArray.length+"% chance of winning.");
					}
				}
			}
		},
		"desc": "General giveaway commands",
		"usage": "giveaway ``start`` or ```join`` or ``stop``",
		"cooldown": 10
	},
	"wtfsimfd": {
		process: function(args, message, bot){
			request("http://www.whatthefuckshouldimakefordinner.com/index.php", function(error, response, body){
				if(!error && response.statusCode == 200){
					var head = body.match(/\<dl\>([^]+?)\<\/dl\>/gmi);
					if(head != null){
						var make = head[1].replace(/\n/gmi, "").replace(/\<dl/gmi, "").replace(/dl\>/gmi, "").replace(/\<\//gmi, "").replace(/\<dt\>/gmi, "").replace(/\\/gmi, "").replace(/\<a\>/gmi, "").replace(/\<a/gmi, "").replace(/dt\>/gmi, "");
						var link = make.match(/\"(.+?)\"/gmi)[0].replace(/\"/gmi, "");
						var food = fix.decodeHTML(make.match(/\"\>(.+?)\>/gmi)[0].replace(/\"\>/gmi, "").replace(/\</gmi, "").replace(/a\>/gmi, ""));
						var head2 = head[0].replace(/\n/gmi, "").replace(/\<dl>/gmi, "").replace(/\<\/dl\>/gmi, "");
						message.channel.sendMessage("**"+head2+"** "+food+" ("+link+")");
					}
				}

			});
		},
		"desc": "What the fuck should I make for dinner?",
		"usage": "wtfsimfd",
		"cooldown": 10
	},
	"cancer": {
		process: function(args, message, bot){
			var term = args.splice(1, args.length).join(" ");
			message.channel.sendMessage(cancer.cancer(term));
		},
		"desc": "Cancerifies a string",
		"usage": "cancer ``string``",
		"cooldown": 10
	},
	"qr": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join(" ");
				var qrcode = qr.imageSync(term, { type: 'png' });
				
				message.channel.sendFile(qrcode);
			}
		},
		"desc": "Generates a QR code",
		"usage": "qr ``string``",
		"cooldown": 10
	},
	"simage": {
		process: function(args, message, bot){
			if(args.length >= 3){
				var url = args[1];
				var name = args[2];
				if(images.hasOwnProperty(name)){
					message.channel.sendMessage("Image ``"+name+"`` already exists.");
					return;
				}
				images[name] = url;
				fs.writeFile("./data/images.json", JSON.stringify(images), 'utf8', function(err){
					if(err){ throw err; }
					message.channel.sendMessage("Saved image: "+name);
				});
			}
		},
		"desc": "Saves an image",
		"usage": "simage ``url`` ``name``",
		"cooldown": 10
	},
	"image": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var file = args[1];
				if(images.hasOwnProperty(file)){
					message.channel.sendMessage.sendMessage(images[file]);
				}else{
					message.channel.sendMessage.sendMessage("No such image.");
				}
			}
		},
		"desc": "Shows an image",
		"usage": "image ``image``",
		"cooldown": 10
	},
	"delimage": {
		process: function(args, message, bot){
			if(args.length >= 2 && settings["owner"] == message.author.id){
				var file = args[1];
				if(images.hasOwnProperty(file)){
					delete images[file];
					fs.writeFile("./data/images.json", JSON.stringify(images), 'utf8', function(err){
						if(err){ throw err; }
						message.channel.sendMessage.sendMessage("Removed image: "+file);
					});
				}
			}
		},
		"desc": "Deletes an image",
		"usage": "delimage ``image``",
		"cooldown": 10
	},
	"imagelist": {
		process: function(args, message, bot){
			message.channel.sendMessage.sendMessage(Object.keys(images).sort().join(", "));
		},
		"desc": "Lists available images",
		"usage": "imagelist",
		"cooldown": 10
	},
	"stag": {
		process: function(args, message, bot){
			if(args.length >= 3){
				var tag = args[1];
				var content = args.splice(2, args.length).join(" ");
				if(tags.hasOwnProperty(tag)){
					message.channel.sendMessage("``Tag "+tag+" already exists.``");
					return;
				}
				tags[tag] = content;
				fs.writeFile("./data/tags.json", JSON.stringify(tags), 'utf8', function(err){
					if(err){ throw err; }
					message.channel.sendMessage("``Saved tag: "+tag+"``");
				});
			}
		},
		"desc": "Saves a tag",
		"usage": "stag ``name`` ``content``",
		"cooldown": 10
	},
	"tag": {
		process: function(args, message, bot){
			if(args.length >= 2){
				var tag = args[1];
				if(tags.hasOwnProperty(tag)){
					var msg = tags[tag].replace(/\{name\}/gmi, message.author.username).replace(/\{servername\}/gmi,  message.guild.name);
					msg = msg.replace(/\{channelname\}/gmi, message.channel.name).replace(/\{channelid\}/gmi, message.channel.id).replace(/\{serverid\}/gmi, message.guild.id);
					for(i=2;i<6;i++){
						if(args[i] == undefined){
							args[i] = "";
						}
					}
					msg = msg.replace(/\{1\}/gmi, args[2]).replace(/\{2\}/gmi, args[3]).replace(/\{3\}/gmi, args[4]).replace(/\{4\}/gmi, args[5]).replace(/\{5\}/gmi, args[6]);
					message.channel.sendMessage(msg);
				}
			}
		},
		"desc": "Prints a tag",
		"usage": "tag ``tag``",
		"cooldown": 10
	},
	"taglist": {
		process: function(args, message, bot){
			message.channel.sendMessage(Object.keys(tags).sort().join(", "));
		},
		"desc": "Lists available tags",
		"usage": "taglist",
		"cooldown": 10
	},
	"deltag": {
		process: function(args, message, bot){
			if(args.length >= 2 && settings["owner"] == message.author.id){
				var tag = args[1];
				if(tags.hasOwnProperty(tag)){
					delete tags[tag];
					fs.writeFile("./data/tags.json", JSON.stringify(tags), 'utf8', function(err){
						if(err){ throw err; }
						message.channel.sendMessage("Removed tag: "+name);
					});
				}
			}
		},
		"desc": "Deletes an image",
		"usage": "delimage ``image``",
		"cooldown": 10
	},
	"reddit": {
		process: function(args, message, bot){
			console.log(args);
			if(args.length >= 2){
				sub = args[1];
				request("https://reddit.com/r/"+sub+"/.json", function(err, res, body){
                    if(!err && res.statusCode == 200){
                        body = JSON.parse(body);
                        if(body.hasOwnProperty("error")){
                            message.channel.sendMessage("Error! "+body["error"])
                        }else{
                            if(body["data"]["children"][0]["data"]["over_18"] == true){
                                if(require("../data/nsfw.json").indexOf(message.channel.id)){
                                	var post = body["data"]["children"][helper.rInt(1, body["data"]["children"].length)]["data"];
                                	console.dir(post);
                                	if(post["is_self"]){
                                		message.channel.sendMessage("http://reddit.com"+post["permalink"]);
                                	}else{
                                    	message.channel.sendMessage(post["url"]);
                                    }
                                }else{
                                    message.channel.sendMessage("Sorry. This subreddit is only for users over 18.");
                                }
                            }else{
                            	var post = body["data"]["children"][helper.rInt(1, body["data"]["children"].length)]["data"];
                            	console.dir(post);
                            	if(post["is_self"]){
                            		message.channel.sendMessage("http://reddit.com"+post["permalink"]);
                            	}else{
                                	message.channel.sendMessage(post["url"]);
                                }
                            }
                        }
               		}
                });
			}
		},
		"desc": "Fetches a random reddit post",
		"usage": "reddit ``sub``",
		"cooldown": 10
	},
	"guid": {
		process: function(args, message, bot){
			message.channel.sendMessage("```js\n"+useful.guid()+"```");
		},
		"desc": "Generates a GUID",
		"usage": "guid",
		"cooldown": 10
	},
	"tadd":  {
		process: function(args, message, bot){
			if(args.length >= 2){
				var data = args.splice(1, args.length-1).join(" ");
				if(!todo.hasOwnProperty(message.author.id)){
					todo[message.author.id] = {};
				}
				todo[message.author.id][useful.guid()] = {"done": false, "data": data};
				fs.writeFile("./data/todo.json", JSON.stringify(todo), 'utf8', function(err){
					if(err){ throw err; }
					message.channel.sendMessage("``Added todo for "+message.author.username+"``");
				});
			}
		},
		"desc": "Add to your todo list",
		"usage": "tadd ``data``",
		"cooldown": 10
	},
	"todo": {
		process: function(args, message, bot){
			if(todo.hasOwnProperty(message.author.id)){
				var list = todo[message.author.id];
				var itms = Object.keys(list);
				if(itms.length > 0){
					var msg = [];
					msg.push("**"+message.author.username+"'s todo list**");
					for(i=0;i<itms.length;i++){
						if(list[itms[i]]["done"]){
							msg.push("~~"+list[itms[i]]["data"]+"~~");
						}else{
							msg.push(list[itms[i]]["data"]);
						}
					}
					message.channel.sendMessage(msg);
				}else{
					message.channel.sendMessage("Hey! "+message.author.username+", You don't have anything on your todo list");
				}
			}else{
				message.channel.sendMessage("Hey! "+message.author.username+", You don't have anything on your todo list");
			}
		}
	},
	"tdone": {
		process: function(args, message, bot){
			if(args.length >= 2){
				if(todo.hasOwnProperty(message.author.id)){
					var list = todo[message.author.id];
					var itms = Object.keys(list);
					var item = Number(args[1]);

					if(item <= itms.length){
						todo[message.author.id][itms[item]]["done"] = true;
						fs.writeFile("./data/todo.json", JSON.stringify(todo), 'utf8', function(err){
							if(err){ throw err; }
							message.channel.sendMessage("``Set item to done for "+message.author.username+"``");
						});
					}
				}
			}
		},
		"desc": "Set an item to done.",
		"usage": "tdone ``item number``",
		"cooldown": 10
	},
	"tdel": {
		process: function(args, message, bot){
			if(args.length >= 2){
				if(todo.hasOwnProperty(message.author.id)){
					var list = todo[message.author.id];
					var itms = Object.keys(list);
					var item = Number(args[1]);

					if(item <= itms.length){
						console.log(todo[message.author.id][itms[item]]);
						delete todo[message.author.id][itms[item]];
						fs.writeFile("./data/todo.json", JSON.stringify(todo), 'utf8', function(err){
							if(err){ message.channel.sendMessage("```js\n"+err+"```"); return; }
							message.channel.sendMessage("``Deleted item for "+message.author.username+"``");
						});
					}
				}
			}
		},
		"desc": "Deletes an item from a todo list.",
		"usage": "tdel ``item number``",
		"cooldown": 10
	}
};

exports.util = util;