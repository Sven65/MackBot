module.exports = {
	Execute: (Args, message) => {
		message.channel.sendMessage("https://discordapp.com/oauth2/authorize?&client_id=168330106224246784&scope=bot&permissions=0");
	},
	Description: "Gets an invite link for the bot.",
	Usage: "",
	Cooldown: 10
}