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
    res.send('Hello world, I am a chat bot yo')
})


