module.exports = {
	Execute: (Args, message) => {
		let user = new User.User(message.author.id);
		let userGame = new User.Game(user);
		let Msg = "```js\n";
		userGame.stats.then((stats) => {
			if(stats === null){
				userGame.create();
				stats = {bal: 100, wins: 0, losses: 0, games: 0};
			}

			msg += `User: ${message.author.username}`;
			msg += `\nBalance: ${stats.bal.formatNumber()} coins`;
			msg += `\nWins/Losses: ${stats.wins.formatNumber()}/${stats.losses.formatNumber()}`;
			msg += `\nGames played: ${stats.games.formatNumber()}`;
			msg += "```";

			let embedPerms = false;

			if(message.channel.type !== "text"){
				embedPerms = true;
			}else{
				if(message.channel.permissionsFor(MackBot.user).hasPermission("EMBED_LINKS")){
					embedPerms = true;
				}
			}

			if(!embedPerms){
				message.channel.sendMessage(msg);
			}else{
				let DataMessage = {
					"embed": {
						"title": "",
						"type": "rich",
						"color": 0xf44274,
						"author": {
							"name": `${message.author.username}'s Stats`
						},
						"fields": [
							{
								"name": "Balance",
								"value": `${stats.bal.formatNumber()} Coins`,
								"inline": true
							},
							{
								"name": "Wins",
								"value": stats.wins.formatNumber(),
								"inline": true
							},
							{
								"name": "Losses",
								"value": stats.losses.formatNumber(),
								"inline": true
							},
							{
								"name": "Games Played",
								"value": stats.games.formatNumber(),
								"inline": true
							}
						]
					}
				}
				message.channel.sendMessage('', DataMessage);
			}
		});
	},
	Description: "Shows a users gambling stats",
	Usage: "",
	Cooldown: 10
}