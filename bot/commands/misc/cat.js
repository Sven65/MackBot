const request = require("superagent");

module.exports = {
	Execute: (Args, message) => {
		request.get("http://random.cat/meow").end((err, res) => {
			if(!err && res.statusCode === 200){
				message.channel.sendMessage(res.body.file);
			}
		});
	},
	Description: "Sends a random cat.",
	Usage: "",
	Cooldown: 10
};