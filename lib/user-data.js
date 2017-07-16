var fs = require('co-fs');
var userFile = './data/users.json';
module.exports = { //required in order to be able to reference the functions below in another file
    users : {
		// the users.get function will read from users.json the number of users
        get: function *() {
            var data = yield fs.readFile(userFile, 'utf-8');
            return JSON.parse(data);
        },
		// the users.save function will save to users.json the new user
        save: function *(user) {
            var users = yield this.get();
            users.push(user);
            yield fs.writeFile(userFile, JSON.stringify(users));
        }
    }
}