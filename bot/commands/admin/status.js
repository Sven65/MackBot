module.exports = {
	Execute: (Args, message) => {
		if(MackBot.Config.Admins.indexOf(message.author.id) > -1){
			let Game = "";
			if(Args.length >= 1){
				Game = Args.join(" ");
			}
			MackBot.user.setGame(Game);
		}else{
			message.channel.sendMessage(`:x: You can't do that, ${message.author.username}.`);
		}
	},
	Description: "Sets MackBot's Status",
	Usage: "`[status]`",
	Cooldown: 5
}