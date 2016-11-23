const mathjs = require("mathjs");

module.exports = {
	Execute: (Args, message) => {
		if(Args.length >= 1){
			if(Args[0] === "0/0"){
				message.channel.sendMessage("Pfft. I'm a bot! I can't calculate 0/0!");
			}else{
				let term = Args.join(" ");
				try{
					let calc = mathjs.parse(term);
					let tex = calc.toTex();
					let result = calc.compile().eval();
					message.channel.sendMessage("http://chart.apis.google.com/chart?cht=tx&chl="+encodeURIComponent(tex)+"="+result+"\n```js\n"+result+"```");
				}catch(e){
					MackBot.SendError(message, e);
				}
			}
		}else{
			message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}.`);
		}
	},
	Description: "Calculate math",
	Usage: "`<expression>`",
	Cooldown: 5
}