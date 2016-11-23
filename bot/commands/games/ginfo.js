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

			Msg += `User: ${message.author.username}`;
			Msg += `\nBalance: ${stats.bal.formatNumber()} coins`;
			Msg += `\nWins/Losses: ${stats.wins.formatNumber()}/${stats.losses.formatNumber()}`;
			Msg += `\nGames played: ${stats.games.formatNumber()}`;
			Msg += "```";

			let embedPerms = false;

			if(message.channel.type !== "text"){
				embedPerms = true;
			}else{
				if(message.channel.permissionsFor(MackBot.user).hasPermission("EMBED_LINKS")){
					embedPerms = true;
				}
			}

			if(!embedPerms){
				message.channel.sendMessage(Msg);
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
		}).catch((e) => {
			MackBot.sendError(message, e);
		});
	},
	Description: "Shows a users gambling stats",
	Usage: "",
	Cooldown: 10
}