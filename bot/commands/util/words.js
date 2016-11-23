module.exports = {
	Execute: (Args, message) => {
		let word = new Words.Words;

		word.getWords().then((words) => {
			let Amount = 3;
			let Max = 15;

			if(Args.length >= 1){
				Amount = parseInt(Args[0])||3;
			}

			let toSend = [];

			for(let i=0;i<Amount;i++){
				toSend.push(words.random());
			}

			message.channel.sendMessage(toSend.join(" "));
		}).catch((e) => {
			MackBot.SendError(message, e);
		});
	},
	Description: "Picks some random words",
	Usage: "`[amount]`",
	Cooldown: 10
}