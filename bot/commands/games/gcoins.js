module.exports = {
	Execute: (Args, message) => {
		if(message.author.id === MackBot.Config.Owner){
			if(message.mentions.users.size >= 1){
				let user = new User.User(message.mentions.users.first().id);
				let userGame = new User.Game(user);
				userGame.stats.then((stats) => {
					if(stats === null){
						message.channel.sendMessage(`:x: User doesn't have a gambling profile.`);
						return;
					}else{
						userGame.addCoins(parseInt(Args[1])).then(() => {
							message.channel.sendMessage(`:white_check_mark: Gave ${message.mentions.users.first().username} ${parseInt(Args[1])} Coins.`);
						});
					}
				})
			}
		}
	},
	Description: "Gives a user coins.",
	Usage: "`<@user>`, `<coins>`",
	Cooldown: 10,
	Unlisted: true
}