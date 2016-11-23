module.exports = class Game{
	constructor(user){
		this.user = user;
	}

	get stats(){
		return MackBot.rdb.r.table("Users").get(this.user.id)("games").default(null).run(MackBot.rdb.conn);
	}

	create(){
		let Data = {
			id: this.user.id,
			games: {
				bal: 100,
				wins: 0,
				losses: 0,
				games: 0
			}
		};
		return MackBot.rdb.r.table("Users").insert(Data, {conflict: "update"}).run(MackBot.rdb.conn);
	}

	removeCoins(Amount){
		return MackBot.rdb.r.table("Users").get(this.user.id).update({
			games: {
				bal: MackBot.rdb.r.row("games")("bal").sub(Amount)
			}
		}).run(MackBot.rdb.conn);
	}

	addCoins(Amount){
		return MackBot.rdb.r.table("Users").get(this.user.id).update({
			games: {
				bal: MackBot.rdb.r.row("games")("bal").add(Amount)
			}
		}).run(MackBot.rdb.conn);
	}

	addLoss(){
		return MackBot.rdb.r.table("Users").get(this.user.id).update({
			games: {
				bal: MackBot.rdb.r.row("games")("losses").add(1)
			}
		}).run(MackBot.rdb.conn);
	}

	addWin(){
		return MackBot.rdb.r.table("Users").get(this.user.id).update({
			games: {
				bal: MackBot.rdb.r.row("games")("wins").add(1)
			}
		}).run(MackBot.rdb.conn);
	}

	addGame(){
		return MackBot.rdb.r.table("Users").get(this.user.id).update({
			games: {
				bal: MackBot.rdb.r.row("games")("games").add(1)
			}
		}).run(MackBot.rdb.conn);
	}
}