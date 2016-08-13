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
            let full_text = "What color wine is it?" //"Text received, echo: " + text.substring(0, 200) + " https://shopbanquet.com/flatironsf/products/failla-sonoma-coast-pinot-noir-2013/5769c5cdfc0cb306000713e9"
            sendTextMessage(sender,full_text)
        }
    }
    res.sendStatus(200)
})



const token = "EAAQEo9OiEDwBAJwqZCe5bZAu4XeY6kcIl1T6oVbLboPKjiyEzfbRwngzarbYTFjsd0bzXEQGn2zYI7dlvlJjRqxf9Wnco4RkAApFCGc8ymMnpzCvZBehEv7w98i0DvEY6pYvfVF54A2ZA1UcOZCNv8WNnjQRYb09tCvBArlLVAwZDZD"

function sendTextMessage(sender, text) {
    let messageData = { 
            text:text,
            quick_replies: makeQuickReplies()
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
function makeQuickReplies(){
        quick_replies = 
        [{
            "content_type":"text",
            "title":"Red",
            "payload":"Red"
        },{
            "content_type":"text",
            "title":"White",
            "payload":"White"

        }]
        return quick_replies
    }
}
