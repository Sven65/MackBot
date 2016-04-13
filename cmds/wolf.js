var settings = require("../settings.json");
var helper = require("../util/Helper.js");

var minUsers = 4;
var gameState = 0; // 0: Off, 1: Starting 2: Playing
var gameChan = "";

var leader;

var joined = [];
var assigned = [];
var villagers = [];
var alive = [];
var wolves = [];
var seer = [];
var names = {};

var kill = "";

var seer_can_see = 1; // 0: No, 1: Yes

var villager_votes = {};

var wolf_votes = {};

var tally = {};

var wolf_done = false;
var id_kill = "";

var time = 0; // 0: Day 1: Night

var new_game_texts = ["This is a game of paranoia and psychological intrigue.",
"\nEveryone in this group appears to be a common villager, but several of you are 'special'.",
"\nOne or two of you are actually evil werewolves, seeking to kill everyone while concealing their identity.",
"\nAnd one of you is also a 'seer'; you have the ability to learn whether a specific person is or is not a werewolf.",
"\nAs a community, your group objective is to weed out the werewolves and lynch them before you're all killed in your sleep."];

var wolf_intro_text = "You are a **werewolf**.  You want to kill everyone while they sleep.\nWhatever happens, keep your identity secret. Act natural!";

var seer_intro_text = "You're a villager, but also a **seer**. Later on, you'll get chances to learn whether someone is or isn't a werewolf. Keep your identity secret, or the werewolves may kill you!";

var villager_intro_text = "You're an ordinary villager.";

// Printed when night begins:

var night_game_texts = ["Darkness falls: it is **night**.",
 "The whole village sleeps peacefully...",
 "Everyone relax and wait for morning... I'll tell you when night is over."];

// Printed when wolves and villager get nighttime instructions:

var night_seer_texts = ["In your dreams, you have the ability to see whether a certain person is or isn't a werewolf.",
"You must use this power now: please type ``"+settings['prefix']['main']+"wolf see (user)`` as a private message to me to learn about one living player's true identity."];

var night_werewolf_texts = ["As the villagers sleep, you must now decide whom you want to kill.",
 "You and the other werewolf (if they is exists and is alive) should discuss (privately) and choose a victim.",
 "Please type ``"+settings['prefix']['main']+"wolf kill user`` (as a private message to me)."];

// Printed when day begins.

var day_game_texts = ["Paranoia runs through the village! Who is a werewolf in disguise?",
 "The villagers **must** decide to lynch one player.",
 "When each player is ready, send me the command ``"+settings['prefix']['main']+"wolf vote <nickname> in a PM``",
 "and I will keep track of votes, until the majority agrees."];


function assignSeer(){
	for(i=0;i<1;i++){
		if(assigned.indexOf(joined[i]) == -1){
			seer.push(joined[i]);
			assigned.push(joined[i]);
		}
	}
}

function assignVillager(){
	for(i=0;i<joined.length;i++){
		if(assigned.indexOf(joined[i]) == -1){
			villagers.push(joined[i]);
			assigned.push(joined[i]);
		}
	}
}

function assignWolf(){
	var wAmt = 1;
	if(joined.length >= 8){
		wAmt = 2;
	}
	for(i=0;i<wAmt;i++){
		if(assigned.indexOf(joined[i]) == -1){
			wolves.push(joined[i]);
			assigned.push(joined[i]);
		}
	}
}

function assign(){
	var wAmt = 1;
	if(joined.length >= 8){
		wAmt = 2;
	}

	for(i=0;i<joined.length;i++){
		if(assigned.length < wAmt){
			wolves.push(joined[i]);
			assigned.push(joined[i]);
		}else if(assigned.length < wAmt+1){
			seer.push(joined[i]);
			assigned.push(joined[i]);
		}else{
			villagers.push(joined[i]);
			assigned.push(joined[i]);
		}
	}
}

function printAlive(bot, message){

	bot.sendMessage(gameChan, "Alive: "+Object.keys(names).sort().join(", "));
}

function night(bot, message){
    time = 1;

    villager_votes = {};
    tally = {};

    setTimeout(function(){
    	bot.sendMessage(gameChan, night_game_texts);
    }, 1000);
    
    setTimeout(function(){
    	printAlive(bot, message);
    }, 500);

    // Give private instructions to wolves and seer.

    for(i=0;i<alive.length;i++){
    	if(seer.indexOf(alive[i]) > -1){
    		bot.sendMessage(alive[i], night_seer_texts);
    	}else if(wolves.indexOf(alive[i]) > -1){
    		bot.sendMessage(alive[i], night_werewolf_texts)
    		if(wolves.length >= 2){
    			bot.sendMessage(alive[i], "The other wolf is "+names[alive[i]]+". Talk privately");
    		}
    	}
    }
}

function day(bot, message){
    time = 0;

    if(!kill_player(bot, kill)){
    	seer_can_see = 1;
    	kill = "";
    	wolf_votes = {};
    }

    setTimeout(function(){
    	bot.sendMessage(gameChan, "Day Breaks! Sunlight pierces the sky.");
    }, 500);
   	
    setTimeout(function(){
    	bot.sendMessage(gameChan, "The village awakes in horror to find the mutilated body of "+id_kill+"!!");
    }, 500);

    setTimeout(function(){
    	bot.sendMessage(gameChan, day_game_texts);
    }, 1000);

    setTimeout(function(){
    	printAlive(bot, message);
    }, 500);
}

function end_game(bot){
	gameState = 0;
	assigned = [];
	villagers = [];
	alive = [];
	wolves = [];
	seer = [];
	names = {};
	kill = "";
	seer_can_see = 1; // 0: No, 1: Yes
	villager_votes = {};
	wolf_votes = {};
	tally = {};
	wolf_done = false;
	bot.sendMessage(gameChan, "Game's over.");
	gameChan = "";
	joined = [];
	time = 0;
	leader = "";
	id_kill = "";
}

function tally_votes(){
	tally = {};
	var lynchee;

	for(i in Object.keys(villager_votes)){
		lynchee = villager_votes[i];
		if(tally.hasOwnProperty(lynchee)){
			tally[lynchee] += 1;
		}else{
			tally[lynchee] = 1;
		}
	}
}


function check_for_majority(){
    //If there is a majority of lynch-votes for one player, return that player's name.  Else return None.

    var majority_needed = (alive.length/2)+1
    for(i in Object.keys(tally)){
    	if(tally[i] >= majority_needed){
    		return i;
    	}else{
    		return "";
    	}
    }
}

function print_tally(bot){
    var majority_needed = (alive.length/2)+1;
    var msg = majority_needed+" votes needed for a majority. Current vote tally: ";
    for(lynchee in Object.keys(tally)){
    	if(tally[lynchee] > 1){
    		msg += lynchee+" : "+tally[lynchee]+" votes";
    	}else{
    		msg += lynchee+" : 1 vote";
    	}
	}
	bot.sendMessage(gameChan, msg);
}

function lynch_vote(lynchee, from, bot){
	console.log(lynchee);
	console.log(from);
	console.log(alive);

	if(time == 0){
		bot.sendMessage(from, "Sorry, lynching only happens during the day.");
	}else{
		if(alive.indexOf(from) > -1){
			if(names.hasOwnProperty[lynchee]){
				var lynch = names[lynchee];

				if(alive.indexOf(lynch) > -1){
					if(from == lynch){
						bot.sendMessage(from, "You can't lynch yourself.");
					}else{
						villager_votes[from] = lynch;
						bot.sendMessage(from, "Voted.");
						bot.sendMessage(gameChan, "<@"+from+"> has voted to lynch <@"+lynch+">!");
						tally_votes();
						var victim = check_for_majority();
						if(victim == ""){
							print_tally(bot);
						}else{
							bot.sendMessage(gameChan, "The majority has voted to lynch <@"+victim+">!!");
							bot.sendMessage(gameChan, "Mob violence ensues. This player is now dead.");
							if(!kill_player(victim)){
								night(bot, message);
							}
						}
					}
				}else{
					bot.sendMessage(from, "Only alive players can be lynched");
				}

			}else{
				bot.sendMessage(from, "That player either doesn't exist or is dead.");
			}
		}else{
			bot.sendMessage(from, "Sorry, only living players can vote to lynch someone.");
		}
	}
}

function check_game_over(bot){
    // If all wolves are dead, the villagers win.
    if(wolves.length == 0){
		bot.sendMessage(gameChan, "The wolves are dead! The **villagers** have won.");
		end_game(bot);
		return true;
    }
    // If the number of non-wolves is the same as the number of wolves,
    // then the wolves win.
    if(alive.length-wolves.length == wolves.length){
		bot.sendMessage(gameChan, "There are now an equal number of villagers and werewolves.");
		var msg = "The werewolves have no need to hide anymore; ";
		msg += "They attack the remaining villagers. ";
		msg += "The **werewolves** have won.";
		bot.sendMessage(gameChan, msg);
		end_game(bot);
		return true
  	}
    return false;
}

function kill_player(bot, player){

	if(alive.indexOf(player) > -1){
	    alive.splice(alive.indexOf(player), 1);
	}

    if(wolves.indexOf(player) > -1){
     	id_kill = "a **wolf**!";
      	wolves.splice(wolves.indexOf(player), 1);
    }else if(seer.indexOf(player) > -1){
    	id_kill = "the **seer**!";
    }else{
		id_kill = "a normal villager.";
    }

    bot.sendMessage(gameChan, "**Examining the body, you notice that this player was <@"+player+">**");
    if(check_game_over()){
    	return true;
    }else{
		bot.sendMessage(gameChan, "(<@"+player+"> is now dead, and should stay quiet.)");
		bot.sendMessage(player, "You are now dead. You may observe the game, but please stay quiet until the game is over.");
		return false;
	}
}

function check_night_done(){
    // Check if nighttime is over.  Return 1 if night is done, 0 otherwise.
    // Is the seer done seeing?

    if(alive.indexOf(seer[0]) > -1){
    	if(seer_can_see == 0 && wolf_done){
    		return true;
    	}else{
    		return false;
    	}
    }else{
    	seer_can_see = 1;
    	return true;
    }
}

var wolf = {
	"wolf": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var act = args[1];
				if(act == "join" && gameState == 0){
					if(joined.indexOf(message.author.id) == -1){
						if(joined.length <= 0){
							leader = message.author.id;
						}
						joined.push(message.author.id);
						names[message.author.name] = message.author.id;
						bot.sendMessage(message.channel, "``"+message.author.name+" has joined.``");
					}
				}else if(act == "leave" && gameState == 0){
					if(joined.indexOf(message.author.id) > -1){
						joined.splice(joined.indexOf(message.author.id), 1);
						delete names[message.author.name];
						bot.sendMessage(message.channel, "``"+message.author.name+" has left.``");
					}
				}else if(act == "start" && gameState == 0){
					try{
						if(joined.length >= minUsers){
							leader = message.author.id;
							gameState = 1;
							gameChan = message.channel;
							bot.sendMessage(message.channel, "Starting game");
							assign();

							bot.sendMessage(message.channel, new_game_texts);

							for(i=0;i<joined.length;i++){
								alive.push(joined[i]);
							}

							for(i=0;i<wolves.length;i++){
								bot.sendMessage(wolves[i], wolf_intro_text);
							}

							setTimeout(function(){
								for(i=0;i<seer.length;i++){
									bot.sendMessage(seer[i], seer_intro_text);
								}
							}, 2000);

							setTimeout(function(){
								for(i=0;i<villagers.length;i++){
									bot.sendMessage(villagers[i], villager_intro_text);
								}
							}, 2000);

							gameState = 2;
							night(bot, message);
						}else{
							bot.sendMessage(message.channel, "Sorry. A game needs at least "+minUsers+" players. You only have "+joined.length+".");
						}
					}catch(e){
						console.log(e.stack);
					}
				}else if(act == "see" && gameState == 2){
					if(message.channel.isPrivate){
						if(time == 1){
							if(seer.indexOf(message.author.id) > -1){
								if(args.length >= 3){
									var user = args.splice(2, args.length-1).join(" ");
									if(names.hasOwnProperty(user)){
										var uid = names[user];
										if(alive.indexOf(uid) > -1){
											console.log(seer_can_see);
											if(seer_can_see == 1){
												if(wolves.indexOf(uid) > -1){
													bot.sendMessage(message.channel, "You're sure that player is a werewolf!");
												}else{
													bot.sendMessage(message.channel, "You're sure that player is a normal villager.");
												}
												seer_can_see = 0;
												if(check_night_done()){
													day(bot, message);
												}
											}else{
												bot.sendMessage(message.channel, "You've already had your vision tonight.");
												if(check_night_done()){
													day(bot, message);
												}
											}
										}else{
											bot.sendMessage(message.channel, "That player either doesn't exist or is dead.");
										}
									}else{
										bot.sendMessage(message.channel, "That player doesn't exist!");
									}
								}else{
									bot.sendMessage(message.channel, "You have to specify a player!");
								}
							}else{
								bot.sendMessage(message.channel, "Huh?");
							}
						}else{
							bot.sendMessage(message.channel, "Are you a seer? In any case, it's not nighttime.");
						}
					}
				}else if(act == "kill" && gameState == 2){
					if(message.channel.isPrivate){
						if(time == 1){
							if(wolves.indexOf(message.author.id) > -1){
								if(args.length >= 3){
									console.log(args);
									var user = args.splice(2, args.length-1).join(" ");
									if(names.hasOwnProperty(user)){
										var uid = names[user];
										if(alive.indexOf(uid) > -1){
											if(wolves.length >= 2){
												wolf_votes[message.author.id] = uid;
												bot.sendMessage(message.channel, "Your vote has been acknowledged.");
												if(wolf_votes.length >= 2){
													if(wolf_votes[wolves[0]] == wolf_votes[1]){
														for(i=0;i<wolves.length;i++){
															bot.sendMessage(wolves[i], "It is done. The werewolves agree.");
														}
														kill = wolf_votes[0];
													}else{
														for(i=0;i<wolves.length;i++){
															bot.sendMessage(wolves[i], "The werewolves didn't agree. Choosing a target.");
														}
														kill = wolf_votes[helper.rInt(0, wolf_votes.length-1)];
													}
													wolf_done = true;
													if(check_night_done()){
														day(bot, message);
													}
												}
											}else{
												bot.sendMessage(message.channel, "You've decided who to kill.");
												kill = uid;
												wolf_done = true;
												if(check_night_done()){
													day(bot, message);
												}
											}
										}else{
											bot.sendMessage(message.channel, "That player either doesn't exist or is dead.");
										}
									}else{
										bot.sendMessage(message.channel, "That player doesn't exist!");
									}
								}else{
									bot.sendMessage(message.channel, "You have to specify a player!");
								}
							}else{
								bot.sendMessage(message.channel, "Huh?");
							}
						}else{
							bot.sendMessage(message.channel, "Are you a werewolf? In any case, it's not nighttime.");
						}
					}
				}else if(act == "vote" && gameState == 2 && message.channel.isPrivate){
					console.log(args);
					if(args.length >= 3){
						lynch_vote(message.author.id, args[2], bot);
					}
				}else if(act == "stop"){
					if(message.author.id == leader){
						end_game(bot);
					}
				}else if(act == "debug"){
					console.log(names);
				}
			}
		},
		"desc": "A game about accusations, lying, bluffing, assassination and mob hysteria.",
		"usage": "wolf ``join`` ``leave`` ``start``",
		"cooldown": 10
	}
};

exports.wolf = wolf;