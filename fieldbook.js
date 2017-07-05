var Fieldbook = require('node-fieldbook');

var book = new Fieldbook({
  username: 'key-2',
  password: 'PNbQ4lNuXCtVv1R8W-Qk',
  book: '57f718dd56cec00300626d43'
});


function fieldbookHelperFunction(){
	console.log('helper function')
}
module.exports.book = book
module.exports.fieldbookHelperFunction = fieldbookHelperFunction