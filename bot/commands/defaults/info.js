module.exports = {
	Execute: (Args, message) => {
		let user = MackBot.users.get(MackBot.Config.Owner);
		if(user === null){
			user = {
				username: "Mackan",
				discriminator: "7196"
			}
		}
		let version = `MackBot Version ${require(__dirname+'/../package.json').version} - Made by ${user.username}#${user.discriminator}`;
		message.channel.sendMessage(version);
	},
	desc: "Shows info about the bot.",
	usage: "",
	cooldown: 10,
	cmsg: 5
}