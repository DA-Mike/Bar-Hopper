const express = require("express");
const app = express();
const axios = require("axios");
const yelpApiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';

app.get('/', (req, res) => {
    console.log("shown in terminal");
    console.log(req.query);
    res.send("shown on browser");
    axios.get('https://api.yelp.com/v3/businesses/search?term=bars&location=222%20Sansome%20Street%2C%20San%20Francisco%2C%20California%2094104&radius=1609&limit=30')
    .then(response => {
        res.header("Access-Control-Allow-Origin", "file:///");
        res.header("Authorization", yelpApiKey);
        res.send(response.data);
    })
    .catch(error => {
        console.log("error: ", error);
    })
});

app.listen(3000);