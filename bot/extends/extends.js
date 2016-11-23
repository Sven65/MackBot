Number.prototype.formatNumber = function(){
	return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/* Number formatting with commas as a function on strings
	"1000".formatNumber(); => "1,000";
*/

String.prototype.formatNumber = function(){
	return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

String.prototype.capFirst = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.rInt = function(){
	return Math.floor(Math.random() * (this[1] - this[0] + 1)) + this[0];
}

Array.prototype.shuffle = function(){
	let currentIndex = this.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while(0 !== currentIndex){
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = this[currentIndex];
		this[currentIndex] = this[randomIndex];
		this[randomIndex] = temporaryValue;
	}

	return this;
}

Array.prototype.random = function(){
	return this[Math.floor(Math.random() * ((this.length-1) - 0 + 1)) + 0];
}