// console.log("hello - i'm users")


const users = {}

function addUser(user_id){
	users[user_id] = {
		id: user_id, //for Firebase abstraction later
		current_experience: null,
		current_tasting_note: null,
	}
}

addUser("123")
module.exports = {
	users: users,
	addUser: addUser,
}