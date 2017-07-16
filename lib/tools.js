var https = require("https");
var userFile = './data/users.json';
module.exports = {
	returnValue(person) {
		if(!person)
			throw new Error("Missing input!");
		console.error("This is a console error");
		return `${person.last}, ${person.first}`;
	}
};