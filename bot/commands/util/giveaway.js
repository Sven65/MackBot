let Giveaways = {};

module.exports = {
	Execute: (Args, message) => {
		if(message.channel.type !== "text"){
			message.channel.sendMessage(`:x: You can't do this in private messages, ${message.author.username}.`);
			return;
		}
		if(Args.length >= 1){
			let Action = Args[0].toLowerCase();
			if(Action === "start"){
				if(message.channel.id in Giveaways){
					message.channel.sendMessage(`:x: There's already an ongoing giveaway in this channel, ${message.author.username}!`);
					return;
				}else{
					message.channel.sendMessage(`:white_check_mark: ${message.author.username} started a giveaway!`);
					Giveaways[message.channel.id] = {Owner: message.author.id, Users: []};
				}
			}else if(Action === "join"){
				if(message.channel.id in Giveaways){
					let Giveaway = Giveaways[message.channel.id];

					if(Giveaway.Users.indexOf(message.author.id) === -1){
						Giveaway.Users.push(message.author.id);
						message.channel.sendMessage(`:white_check_mark: ${message.author.username} has been entered into the giveaway and there is now ${Giveaway.Users.length.formatNumber()} users in the giveaway!`);
					}else{
						message.channel.sendMessage(`:x: You're already entered in this giveaway, ${message.author.username}!`);
						return;
					}
				}else{
					message.channel.sendMessage(`:x: There's no giveaway in this channel, ${message.author.username}.`);
				}
			}else if(Action === "stop"){

				if(message.channel.id in Giveaways){
					let Giveaway = Giveaways[message.channel.id];
					if(Giveaway.Owner === message.author.id){
						let Winners = [];

						for(let i=0;i<3;i++){
							let Winner = Giveaway.Users.random();
							Winners.push(Winner);
							Giveaway.Users.splice(Giveaway.Users.indexOf(Winner), 1);
						}


						message.channel.sendMessage(`Giveaway stopped! Out of ${(Giveaway.Users.length+3)} entries, the winner is <@${Winners[0]}>! Congratulations!\nSecond place: <@${Winners[1]}>\nThird place: <@${Winners[2]}>`);
						delete Giveaways[message.channel.id];
					}else{
						message.channel.sendMessage(`:x: You're not the owner of this giveaway, ${message.author.username}.`);
					}
				}else{
					message.channel.sendMessage(`:x: There's no giveaway in this channel, ${message.author.username}!`);
					return;
				}
			}else if(Action === "stats"){
				if(message.channel.id in Giveaways){
					let Giveaway = Giveaways[message.channel.id];
					message.channel.sendMessage(`There's ${Giveaway.Users.length} users in the giveaway and each user has a ${(100/Giveaway.Users.length).toFixed(2)}% chance of winning!`);
					return;
				}else{
					message.channel.sendMessage(`:x: There's no giveaway in this channel, ${message.author.username}!`);
					return;
				}
			}else{
				message.channel.sendMessage(`:x: That's not a valid action, ${message.author.username}.`);
			}
		}else{
			message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}.`);
		}
	},
	Description: "General giveaway commands",
	Usage: "`<action>`",
	Cooldown: 10,
	Extra: {
		"Actions": ["`start`", "`join`", "`stop`", "`stats`"]
	}
}