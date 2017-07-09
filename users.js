// console.log('hello - i'm users')


const users = {}

function addUser(user_id) {
	if (!(user_id in users)) {
		users[user_id] = {
			id: user_id, //for Firebase abstraction later
			current_experience: null,
			current_tasting_note: null, //e.g. {"acid":"low", ...}
			user_type: null, //e.g. 'casual', 'geek'
		}
	}
}

addUser('123')
module.exports = {
	users: users,
	addUser: addUser,
}