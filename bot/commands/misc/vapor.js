module.exports = {
	Execute: (Args, message) => {
		message.channel.sendMessage(Args.join(" ").split("").join(" "));
	},
	Description: "V A P O R W A V E",
	Usage: "`<text>`",
	Cooldown: 10
}