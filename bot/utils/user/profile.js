module.exports = class Profile{
	construct(user){
		this.user = user;
	}

	create(){
		let Data = {
			id: this.user.id,
			profile: {
				location: "",
				about: "",
				email: "",
				league: "",
				minecraft: "",
				steam: "",
				timezone: "",
				twitch: "",
				twitter: "",
				youtube: "",
				reddit: "",
				mal: ""
			}
		};
		return MackBot.rdb.r.table("Users").insert(Data, {conflict: "update"}).run(MackBot.rdb.conn);
	}

	getProfile(){
		return MackBot.rdb.r.table("Users").get(this.user.id).default(null).run(MackBot.rdb.conn);
	}

	setProfile(Field, Data){
		let pData = {profile: {}};
		pData.profile[Field] = Data;
		return MackBot.rdb.r.table("Users").get(this.user.id).update(pData).run(MackBot.rdb.conn);
	}

	delete(){
		return MackBot.rdb.r.table("Users").get(this.user.id).replace(function(user){
			return user.without("profile")	
		}).run(MackBot.rdb.conn);
	}
}