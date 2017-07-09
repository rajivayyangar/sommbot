// Experience: guess a wine


const fbmessenger = require('./fbmessenger')


// What is this? Its use is commented out right now. 
function addResponseToTastingNote(sender, feature, value_enum ,successCallback){
    //user = users.users[sender]
    app.post('/webhook/', function (req, res) {
        console.log("listen for response for tasting note?");
        let messaging_events = req.body.entry[0].messaging
        for (let i = 0; i < messaging_events.length; i++) {
            let event = req.body.entry[0].messaging[i]
            let sender = event.sender.id
            if (event.message && event.message.text) {
                let text = event.message.text
                if (value_enum.indexOf(text) > -1) {
                    console.log("Feature: " + feature);
                    console.log("value: " + text)
                    var tasting_note = {"acid":"low", "alcohol":"elevated", "botrytis":1, "color_concentration":"moderate", "floral":1, "high_terpenes":1, "hue":"gold", "low_terpenes":0, "oak":0, "oxidation":0, "phenolic_bitterness":1, "pommaceous_fruit":0, "pyrazines":0, "residual_sugar":"slight_rs", "stone_fruit":1, "thiols":1, "white_pepper":0}
                    var dataString = '{"data": {"tasting_note":'+ JSON.stringify(tasting_note) + ' } }';
                    var ps_options = {
                        url: 'http://my-second-ps-deployment-1191682332.us-west-2.elb.amazonaws.com/query/guess-wine-from-sframe',
                        method: 'POST',
                        body: dataString,
                        auth: {
                            'user': 'key',
                            'pass': 'e3a09ff9-d3ef-4ee4-a42e-2fc981d7912c'
                        }
                    };
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var r = JSON.parse(body);
                            console.log(r.response);
                            fbmessenger.sendTextMessage(sender, "1: "+r.response[1].class);

                        }
                    }
                    request(ps_options, callback);
                } else {
                    console.log("unrecognized feature value");
                    var t = "Sorry, I didn't recognize that. Please select one of the following:";
                    var qr = fbmessenger.makeQuickReplies(value_enum);
                    fbmessenger.sendTextMessage(sender, t, qr);
                }
            }
        }
        res.sendStatus(200)
    })
}

module.exports.addResponseToTastingNote = addResponseToTastingNote
