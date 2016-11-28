module.exports = {
	Execute: (Args, message) => {
		if(Args.length >= 1){
			let words = new Words.Words;

			let wordAdd = Args[0];

			words.getWords().then((word) => {
				if(word.caseIndex(wordAdd.toLowerCase()) > -1){
					message.channel.sendMessage(`:x: I already know that word, ${message.author.username}.`);
					return;
				}

				words.addWord(wordAdd).then(() => {
					message.channel.sendMessage(`:white_check_mark: Added the word \`${wordAdd}\`!`);
				}).catch((e) => {
					MackBot.SendError(message, e);
				});
			}).catch((e) => {
				MackBot.SendError(message, e);
			});
		}else{
			message.channel.sendMessage(`Not enough arguments, ${message.author.username}.`);
		}
	},
	Description: "Adds a word to the list",
	Usage: "`<word>`",
	Cooldown: 10
}