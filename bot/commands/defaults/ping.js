module.exports = {
	Execute: function(Args, message){
		let n = Date.now();
		let id = message.author.id;
		message.reply("Pong!").then((m) => {
			let time = (m.createdTimestamp-n)/1000;
			m.edit("<@"+id+"> Pong! (Time taken: "+time+" Seconds)");
		});
	},
	Desc: "Pong!",
	Usage: "",
	Cooldown: 10
}