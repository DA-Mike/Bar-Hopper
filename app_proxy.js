const express = require("express");
const app = express();
const axios = require("axios");
const yelpApiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Authorization", yelpApiKey);
    next();
    console.log("req: " + req);
});

app.get('*', (req, res) => {
    console.log("shown in terminal");
    console.log("req from get: " + req.query.location + req.query.term + req.query.radius);
    res.send("req from get: " + req.query);
    const locationPar = req.query.location.replace(/\s/g, '%');
    
    let counter = 0;
    for (i = 0; i < locationPar.length; i++) {
        if (locationPar[i] === "%") {
            counter = i;
        }
    }

    const newLocationPar = locationPar.slice(0, counter+1) + "20" + locationPar.slice(counter+1);
                    
    // const locationPar = encodeURIComponent(req.query.location);
    console.log("location: " + newLocationPar);
    // res.send("shown on browser");
    axios.get('https://api.yelp.com/v3/businesses/search?term=' + req.query.term + "&location=" + newLocationPar + "&radius=" + req.query.radius + "&limit=30")
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.log("error: ", error);
    })
});

app.listen(3000);