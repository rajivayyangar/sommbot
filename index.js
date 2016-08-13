'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            let full_text = "What color wine would you like? (Rose is coming soon)" //"Text received, echo: " + text.substring(0, 200) + " https://shopbanquet.com/flatironsf/products/failla-keefer-ranch-pinot-noir-2013/56e7143f348e4706008d6027"
            if (text === 'Red' | text === 'White') {
                sendGenericMessage(sender)
                continue
            }
            //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
            sendTextMessage(sender, full_text)
        }
    }
    res.sendStatus(200)
})


const token = "EAAQEo9OiEDwBAJwqZCe5bZAu4XeY6kcIl1T6oVbLboPKjiyEzfbRwngzarbYTFjsd0bzXEQGn2zYI7dlvlJjRqxf9Wnco4RkAApFCGc8ymMnpzCvZBehEv7w98i0DvEY6pYvfVF54A2ZA1UcOZCNv8WNnjQRYb09tCvBArlLVAwZDZD"

function sendTextMessage(sender, text) {
    let messageData = { 
            text:text,
            quick_replies: makeQuickReplies(["Red","White","Rose"])
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
                        "title": "Buy $42"
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
                        "title": "Buy $19"
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
        return quick_replies
}
