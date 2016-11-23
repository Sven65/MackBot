module.exports = {
	Execute: (Args, message) => {
		if(MackBot.Config.Owner === message.author.id){
			if(Args.length >= 1){
				MackBot.user.setAvatar(Args[1]).then(() => {
					message.channel.sendMessage(`:white_check_mark: Avatar updated!`);	
				}).catch((e) => {
					message.channel.sendMessage(`:x: Error when trying to update avatar.`);
				});
			}else{
				message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}.`);
			}
		}else{
			message.channel.sendMessage(`:x: You can't do that, ${message.author.username}.`);
		}
	},
	Description: "Changes the bots avatar.",
	Usage: "`<URL>`",
	Cooldown: 5
}