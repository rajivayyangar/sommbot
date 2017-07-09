// functions and constants pertaining to FB messenger


const request = require('request')
const textStrings = require('./textStrings')

function validateWebhook(req,res){ 
	if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    console.log("Validated webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
}
function sendTextMessage(sender, text, quickReplies, successCallback) {
    let messageData = { 
            text:text,
            quick_replies: quickReplies
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:textStrings.token},
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
    return quick_replies
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
        qs: {access_token:textStrings.token},
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
                    }, {
                        "type": "postback",
                        "title": "More like this",
                        "payload": "Payload for first element in a generic bubble",
                    }
                    ],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:textStrings.token},
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
module.exports.validateWebhook = validateWebhook
module.exports.sendTextMessage = sendTextMessage
module.exports.makeQuickReplies = makeQuickReplies
module.exports.sendImageMessage = sendImageMessage
module.exports.sendWineCard = sendWineCard





