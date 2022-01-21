require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const PORT = 8000;

// routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/home', (req, res) => {
    res.send('Home Page');
});

// register URLs
app.get('/register', accessToken, (req, res) => {
    let uri = process.env.REGISTER_URL;
    let auth = "Bearer " + req.access_token;
    let cURL = process.env.CONFIRMATION_URL;
    let vURL = process.env.VALIDATION_URL;

    console.log(auth);

    request({
        url: uri,
        method: 'POST',
        headers: {
            "Authorization": auth
        },
        json: {
            "ShortCode": "174379",
            "ResponseType": "Complete",
            "ConfirmationURL": cURL,
            "ValidationURL": vURL,
        }
    },
        function (error, response, body) {
            if (error) {
                console.log(error)
            } else {
                res.status(200).json(body)
            }
        }
    )
})

app.get('/access_token', accessToken, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
});

function accessToken(req, res, next) {
    // access token
    let uri = process.env.URL;
    let auth = new Buffer(`${process.env.C_KEY}:${process.env.C_SECRET}`).toString('base64');

    request({
        url: uri,
        headers: {
            "Authorization": "Basic " + auth
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error)
        } else {
            req.access_token = JSON.parse(body).access_token
            next();
        }
    })

}

// listen
app.listen(PORT, (error, live) => {
    if (error) {
        console.log(`error starting server: ${error}`);
    }

    console.log(`Server is running on port ${PORT}`);
});