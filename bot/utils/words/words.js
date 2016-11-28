module.exports = class Words {
	getWords(){
		return MackBot.rdb.r.table("Words").get("Words")("Words").default([]).run(MackBot.rdb.conn);
	}

	addWord(word){
		return MackBot.rdb.r.table("Words").get("Words").update({
			Words: MackBot.rdb.r.row("Words").append(word)
		}).run(MackBot.rdb.conn);
	}

	deleteWord(word){
		return MackBot.rdb.r.table("Words").get("Words").update({
			Words: MackBot.rdb.r.row("Words").difference([word])
		});
	}
}