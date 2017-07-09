'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

//local modules
const users = require('./users')
const textStrings = require('./textStrings')
const Fieldbook = require('./fieldbook')
const suggestWine = require('./suggestWine')
const guessWine = require('./guessWine')
const freeChat = require('./freeChat')
const wineClassifier = require('./wineClassifier')
const fbmessenger = require('./fbmessenger')

//The current user. This is determined by listening to messages and getting the sender id, then referencing users.users[sender] to get the current user object. <refactor> - figure out naming for sender_id (sender?) and users.js, users table, user object. 
var user = null;

console.log('running')

const book = Fieldbook.book 
const fieldbookHelperFunction = Fieldbook.fieldbookHelperFunction

console.log('Fieldbook helper function example:')
fieldbookHelperFunction()

// Set port
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook', fbmessenger.validateWebhook);

// Spin up the server
app.listen(app.get('port'), function() {
    //console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    console.log('post webhook');
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        users.addUser(sender)
        user = users.users[sender]

        // const message = asd.asdf.sadf.event.message <refactor>
        // doSomethingWithMessage(message) <refactor>
        if (event.message && event.message.text) {
            console.log('experience = ' + user.current_experience);
            console.log('tasting note = ' + JSON.stringify(user.current_tasting_note));
            console.log("inner text")
            let text = event.message.text;
            // doSOmethingBasedonExperience(experience) <refactor>
            if(user.current_experience === 'guess_wine'){
                console.log('guessing wine experience');
                //user.current_tasting_note = {"acid":"low", "alcohol":"elevated", "botrytis":1, "color_concentration":"moderate", "floral":1, "high_terpenes":1, "hue":"gold", "low_terpenes":0, "oak":0, "oxidation":0, "phenolic_bitterness":1, "pommaceous_fruit":0, "pyrazines":0, "residual_sugar":"slight_rs", "stone_fruit":1, "thiols":1, "white_pepper":0}
                user.current_tasting_note = {'acid':text};
                console.log(' text: ' + text);
                console.log('tasting note post addition = ' + JSON.stringify(user.current_tasting_note));
                var dataString = '{"data": {"tasting_note":'+ JSON.stringify(user.current_tasting_note) + ' } }';
                var ps_options = {
                    url: 'http://my-second-ps-deployment-1191682332.us-west-2.elb.amazonaws.com/query/guess-wine-from-sframe',
                    method: 'POST',
                    body: dataString,
                    auth: {
                        'user': 'key',
                        'pass': 'e3a09ff9-d3ef-4ee4-a42e-2fc981d7912c'
                    }
                };
                request(ps_options, function(error, response, body){
                    if (!error && response.statusCode == 200) {
                        //console.log(body);
                        var r = JSON.parse(body);
                        console.log(r.response);
                        fbmessenger.sendTextMessage(sender,"Tasting note: " +JSON.stringify(user.current_tasting_note),null,function(){
                            fbmessenger.sendTextMessage(sender, "1: "+r.response[0].class,null, function() {
                                fbmessenger.sendTextMessage(sender, "2: "+r.response[1].class, null, function() {
                                    fbmessenger.sendTextMessage(sender, "3: "+r.response[2].class,qr, function(){
                                        user.current_experience = null;
                                        user.current_tasting_note = {};
                                    });
                                });
                            });
                        });

                    }
                });
            }
            else {
                console.log('switch text text: '+ text);
                switch (text) {
                        case 'guesswine':
                            //guessWine.addResponseToTastingNote(sender, "acidity", ['diminished','moderate','elevated','high']);
                            user.current_experience = 'guess_wine';
                            var qr = fbmessenger.makeQuickReplies(["diminished","moderate","elevated","high"]);
                            fbmessenger.sendTextMessage(sender, "What's the acid level of the wine?", qr);
                            break
                        case 'Suggest a wine':
                            var qr = fbmessenger.makeQuickReplies(["Casual","Geek"]);
                            fbmessenger.sendTextMessage(sender, textStrings.SUGGEST_CASUAL_OR_GEEK, fbmessenger.makeQuickReplies(["Casual","Geek"]))
                            break;
                        case 'Wine resources':
                            var qr = fbmessenger.makeQuickReplies(["Ok"]);
                            fbmessenger.sendTextMessage(sender, textStrings.COMING_SOON, qr)
                            break;
                        case 'Casual':
                            suggestWine.sendCasualWineSuggestion(sender);        
                            break;
                        case 'More':
                            suggestWine.sendCasualWineMore(sender);
                            break;
                        case 'Geek':
                            suggestWine.sendGeekWineSuggestion(sender);
                            break;
                        case 'Bio':
                            suggestWine.sendGeekWineBio(sender);
                            break;
                        case 'Winemaking':
                            suggestWine.sendGeekWinemaking(sender)
                            break;
                        case 'Geo':
                            suggestWine.sendGeekVineyardGeo(sender);
                            break;
                        case 'Buy':
                            suggestWine.sendGeekWineBuy(sender)                        
                            break;
                        case 'Ok':
                            var qr = fbmessenger.makeQuickReplies(["Suggest a wine","Wine resources"]);
                            fbmessenger.sendTextMessage(sender, "Ask me a question or select one of the following:", qr);
                            break;
                      default:
                        console.log("unrecognized text");
                        var qr = fbmessenger.makeQuickReplies(["Suggest a wine","Wine resources"]);
                        fbmessenger.sendTextMessage(sender, textStrings.START_TEXT, qr);
                }
            }
        }
    }
    res.sendStatus(200)
})



