'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

console.log('running')

var Fieldbook = require('node-fieldbook');

var book = new Fieldbook({
  username: 'key-2',
  password: 'PNbQ4lNuXCtVv1R8W-Qk',
  book: '57f718dd56cec00300626d43'
});

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
app.get('/webhook/', function (req, res) {
    //console.log("fbook verification a")
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me')
        {res.send(req.query['hub.challenge'])} 
    res.send(req.query['hub.challenge'])
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    //console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            switch (text) {
                    case 'Suggest a wine':
                        var qr = makeQuickReplies(["Casual","Geek"]);
                        sendTextMessage(sender, SUGGEST_CASUAL_OR_GEEK, qr)
                        break;

                    case 'Wine resources':
                        var qr = makeQuickReplies(["Ok"]);
                        sendTextMessage(sender, COMING_SOON, qr)
                        break;

                    case 'Casual':
                        //var qr = makeQuickReplies(["More","Ok"]);
                        //sendTextMessage(sender, "<wine>/n<description>/n<buy button>", qr);
                        sendCasualWineSuggestion(sender);        
                        break;

                    case 'More':
                        //var qr = makeQuickReplies(["Ok"]);
                        //sendTextMessage(sender, "since you asked.../n<more details>", qr);
                        sendCasualWineMore(sender);
                        break;

                    case 'Geek':
                        //var qr = makeQuickReplies(["Bio","Winemaking","Geo"]);
                        //sendTextMessage(sender, "<wine>\n<description>\n<buy button>", qr);
                        sendGeekWineSuggestion(sender);
                        break;
                    case 'Bio':
                        //var qr = makeQuickReplies(["Winemaking","Geo","Buy"]);
                        //sendTextMessage(sender, "Fred, the winemaker, was born in...", qr);
                        sendGeekWineBio(sender);
                        break;
                    case 'Winemaking':
                        //var qr = makeQuickReplies(["Bio","Geo","Buy"]);
                        //sendTextMessage(sender, "12 month in neutral barrels, full malo...", qr);
                        sendGeekWinemaking(sender)
                        break;
                    case 'Geo':
                        //var qr = makeQuickReplies(["Bio","Winemaking","Buy"]);
                        //sendTextMessage(sender, "Steep slopes in Sonoma. Loam and gravel soil.", qr);
                        sendGeekVineyardGeo(sender);
                        break;
                    case 'Buy':
                        //var qr = makeQuickReplies(["Ok"]);
                        //sendTextMessage(sender, "Find this at your local retail store, or buy it from our friends over at Banquet: <BUY BUTTON>", qr);
                        sendGeekWineBuy(sender)                        
                        break;
                    case 'Ok':
                        var qr = makeQuickReplies(["Suggest a wine","Wine resources"]);
                        sendTextMessage(sender, "Ask me a question or select one of the following:", qr);
                        break;

                  default:
                    var qr = makeQuickReplies(["Suggest a wine","Wine resources"]);
                    sendTextMessage(sender, START_TEXT, qr);
            }
            /*
            if (text === 'Suggest a wine'){
                var filter = {color: 'red'};
                sendWineRecc(sender,filter)
            } else if (text === 'Wine resources') {
                var filter = {color: 'white'};
                sendWineRecc(sender,filter)
            } else {
                var qr = makeQuickReplies(["Suggest a wine","Wine resources"])
                sendTextMessage(sender, full_text, qr)
            }
            */
        }
    }
    res.sendStatus(200)
})


const token = "EAAQEo9OiEDwBAJwqZCe5bZAu4XeY6kcIl1T6oVbLboPKjiyEzfbRwngzarbYTFjsd0bzXEQGn2zYI7dlvlJjRqxf9Wnco4RkAApFCGc8ymMnpzCvZBehEv7w98i0DvEY6pYvfVF54A2ZA1UcOZCNv8WNnjQRYb09tCvBArlLVAwZDZD"


function sendTextMessage(sender, text, quickReplies, successCallback) {
    let messageData = { 
            text:text,
            quick_replies: quickReplies
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
            if (successCallback) {
                successCallback()
            }
        }
    })
}
function sendTernaryAttributeMessage(sender, text) {
    let messageData = { 
            text:text,
            quick_replies: makeQuickReplies(["diminished","moderate","elevated"])
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "2013 Failla Keefer Ranch Pinot",
                    "subtitle": "Sonoma Coast, CA",
                    "image_url": "https://d2mvsg0ph94s7h.cloudfront.net/tylerhensley-1458790842-917b41241d63_medium.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://shopbanquet.com/flatironsf/products/failla-keefer-ranch-pinot-noir-2013/56e7143f348e4706008d6027",
                        "title": "Get it in 1 hr $42"
                    }, {
                        "type": "postback",
                        "title": "More like this",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "2014 La Viarte Pinot Grigio",
                    "subtitle": "Friuli, Italy",
                    "image_url": "https://d2mvsg0ph94s7h.cloudfront.net/jeffsidwell-1449253546-90f4ef3fc350_medium.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://shopbanquet.com/flatironsf/products/la-viarte-colli-orientali-del-friuli-pinot-grigio-2014/56ea0d784ecf7206001ace5f",
                        "title": "Get it in 1 hr $19"
                    },{
                        "type": "postback",
                        "title": "More like this",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function makeQuickReplies(arrOfLength3){
    let quick_replies = []

    for (let i = 0; i < arrOfLength3.length; i++) {
        let reply = 
            {
                "content_type":"text",
                "title":arrOfLength3[i],
                "payload":arrOfLength3[i]
            }
        quick_replies.push(reply)
    }
    //console.log(quick_replies)
    
/*
        let quick_replies = 
        [{
            "content_type":"text",
            "title":arrOfLength3[0],
            "payload":arrOfLength3[0]
        },{
            "content_type":"text",
            "title":arrOfLength3[1],
            "payload":arrOfLength3[1]

        },{
            "content_type":"text",
            "title":arrOfLength3[2],
            "payload":arrOfLength3[2]
        }]
*/
    return quick_replies
}


function sendWineRecc(sender,filter) {
    sendTextMessage(sender,"<wine card>")

    /*
    book.getSheet('available_wines', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        sendTextMessage(sender,wine.wine_name);
        sendTextMessage(sender,wine.story+" "+wine.tasting_note);
        sendImageMessage(sender, wine.winemaker_image_url);
        sendImageMessage(sender, wine.vineyard_image_url);
        sendWineCard(sender,wine)
    })
    .catch((error) => {
      console.log(error);
    });
    */

}

function sendCasualWineSuggestion(sender) {
    var filter = {user_type:'casual'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "The best way to expand your palate is to try as many wine styles (grape+region, e.g. Cabernet from California) as possible, and discover which you like, and which you don't.\n\n Each week I'll recommend a classic style that you can find in your local wine shop."
        let wine_style_text = "This week I'm excited about " + wine.classic_style + "\n\n" 
            + wine.classic_style_description
        let bottle_to_buy_text = "For a specific bottle, check out the "+ wine.wine_name + ". " + wine.description;
        console.log(intro_text);

        var qr = makeQuickReplies(["More","Ok"]);

        sendTextMessage(sender, intro_text, null, function() {
            sendTextMessage(sender, wine_style_text, null, function() {
                sendTextMessage(sender, bottle_to_buy_text, null, function() {
                    sendWineCard(sender,wine,qr);
                });
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendCasualWineMore(sender) {
    var filter = {user_type:'casual'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "Well, since you asked..."
        var qr = makeQuickReplies(["Ok"]);
        let wine_details = wine.details;
        let wine_details_continued = wine.details_continued;
        //console.log(wine_details)

        sendTextMessage(sender, intro_text, null, function() {
            sendTextMessage(sender, wine_details, qr, function() {
                if(wine_details_continued){
                    sendTextMessage(sender, wine_details_continued, qr);
                }
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendGeekWineSuggestion(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "Aha—a fellow wine nerd! I'm going to try to push you out of your comfort zone with a non-classic wine style.\n\n"
        let wine_style_text = "This week I'm excited about " + wine.classic_style + ".";
        let bottle_to_buy_text = wine.description;
        //console.log(intro_text)
        var qr = makeQuickReplies(["Bio","Winemaking","Geo"]);
        sendTextMessage(sender,intro_text, null, function(){
            sendTextMessage(sender, wine_style_text, null, function(){
                sendTextMessage(sender, bottle_to_buy_text, null, function(){
                    sendWineCard(sender,wine,qr);
                });
            });
        });

        
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendGeekWineBio(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let bio_text = wine.winemaker_bio;
        let winemaker_image_url = wine.winemaker_image_url;
        //console.log(intro_text)
        var qr = makeQuickReplies(["Winemaking","Geo","Buy"]);
        sendTextMessage(sender,bio_text, qr, function(){
            sendImageMessage(sender, winemaker_image_url, qr);
        });
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendGeekVineyardGeo(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let geo_text = wine.vineyard_geo;
        let vineyard_image_url = wine.vineyard_image_url;
        //console.log(intro_text)
        var qr = makeQuickReplies(["Winemaking","Bio","Buy"]);
        sendTextMessage(sender,geo_text, qr, function(){
            if(vineyard_image_url){
                sendImageMessage(sender, vineyard_image_url, qr);
            }
        });
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendGeekWinemaking(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let winemaking_text = wine.winemaking;
        //console.log(intro_text)
        var qr = makeQuickReplies(["Bio","Geo","Buy"]);
        sendTextMessage(sender,winemaking_text, qr);
    })
    .catch((error) => {
      console.log(error);
    });

}

function sendGeekWineBuy(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "You can buy this from our friends over at Banquet:";
        //console.log(intro_text)
        var qr = makeQuickReplies(["Ok"]);

        sendTextMessage(sender,intro_text, null, function(){
            //console.log("inner loop Buy")
            sendWineCard(sender,wine,qr);
        });

        
    })
    .catch((error) => {
      console.log(error);
    });

}


function sendImageMessage(sender, image_url,quickReplies) {
    let messageData = {
        "quick_replies":quickReplies,
        "attachment": {
            "type": "image",
            "payload": {
                "url": image_url
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendWineCard(sender,wine, quickReplies) {
    let messageData = {
        "quick_replies":quickReplies,
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": wine.wine_name,
                    "subtitle": wine.region,
                    "image_url": wine.bottle_image_url,
                    "buttons": [{
                        "type": "web_url",
                        "url": wine.url,
                        "title": "Buy it now $" + wine.price
                    }/*, {
                        "type": "postback",
                        "title": "More like this",
                        "payload": "Payload for first element in a generic bubble",
                    }*/
                    ],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const START_TEXT = "You can ask me any question you like, and I'll get back to you as soon as I can. Or, choose among the following:"
const SUGGEST_CASUAL_OR_GEEK = "It seems like every week I fall in love with a different wine style! \n\nBefore I share my current crush, I'd like to know a bit more about you. Would you describe yourself as a casual wine drinker, or a wine geek?"
const COMING_SOON = "Coming soon!"
const WINE_ANSWER_PENDING = "Hang tight—I'll get back to you shortly."




//"Hello, my name is Vincent. I'm here to guide you in exploring the world of wine. \n\nYou can ask me any question you like, and I'll get back to you as soon as I can. Or, choose among the following:"



