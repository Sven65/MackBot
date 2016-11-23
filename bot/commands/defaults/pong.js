module.exports = {
	Execute: function(Args, message){
		let n = Date.now();
		let id = message.author.id;
		message.reply("Ping!").then((m) => {
			let time = (m.createdTimestamp-n)/1000;
			m.edit("<@"+id+"> Ping! (Time taken: "+time+" Seconds)");
		});
	},
	Desc: "Ping!",
	Usage: "",
	Cooldown: 10
}