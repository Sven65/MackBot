module.exports = {
	Execute: (Args, message) => {
		if(message.author.id === MackBot.Config.Owner){
			if(message.mentions.users.size >= 1){
				let user = new User.User(message.mentions.users.first().id);
				user.isIgnored.then((ignored) => {
					if(ignored !== null){
						user.unignore().then(() => {
							message.channel.sendMessage(`:white_check_mark: No longer ignoring ${message.mentions.users.first().username}.`);
						}).catch((e) => {
							message.channel.sendMessage(`:x: Something went wrong.`);
						});
					}else{
						user.ignore().then(() => {
							message.channel.sendMessage(`:white_check_mark: Now ignoring ${message.mentions.users.first().username}.`);
						}).catch((e) => {
							message.channel.sendMessage(`:x: Something went wrong.`);
						});
					}
				});
			}
		}
	},
	Description: "Ignores a user.",
	Usage: "`<@user>`",
	Cooldown: 10
}