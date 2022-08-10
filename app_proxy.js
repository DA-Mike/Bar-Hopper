const express = require("express");
const app = express();
const axios = require("axios");

app.get('*', (req, res) => {

    const AuthStr = "Bearer ".concat(req.query.apiKey);

    axios.get('https://api.yelp.com/v3/businesses/search?term=' + req.query.term + "&location=" + req.query.location + "&radius=" + req.query.radius + "&limit=30",
    {headers: { Authorization: AuthStr, dataType: JSON}}
    )
    .then(response => {
        res.header('Access-Control-Allow-Origin', '*');
        res.send(response.data);
    })
    .catch(error => {
        res.header('Access-Control-Allow-Origin', '*');
        res.send(error.code);
        res.send(error);
    })
});

app.listen(3000);
