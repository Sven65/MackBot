const request = require("superagent");

module.exports = {
	Execute: (Args, message) => {
		if(Args.length >= 3){
			let Amount = Args[0];
			let From = Args[1].toUpperCase();
			let To = Args[2].toUpperCase();

			request.get(`https://www.google.co.uk/finance/converter?a=${Amount}&from=${From}&to=${To}`).buffer(true).end((err, res) => {
				if(!err && res.statusCode === 200){
					let Result = res.text.match(/\<span class=bld\>(.+?)\<\/span\>/gmi);
					if(Result !== undefined && Result !== null){
						message.channel.sendMessage(`${Amount} ${From} is roughly ${Result[0].replace(/\<span class=bld\>/, "").replace(/\<\/span\>/, "")}`);
					}else{
						message.channel.sendMessage(`:x: Couldn't find any rates!`);
					}
				}else{
					message.channel.sendMessage(`Got status code ${res.statusCode}`);
				}
			});
		}else{
			message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}.`);
		}
	},
	Description: "Convert currencies",
	Usage: "`<amount>`, `<from>`, `<to>`"
}