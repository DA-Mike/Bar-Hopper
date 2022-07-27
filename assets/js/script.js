//vars
var address = "757 Market St, San Francisco, CA 94103";
var barNumber = 3;
var distance = 1;
var yelpApiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';
var orsApiKey = '5b3ce3597851110001cf62485129bd04419745ee8e37972a9bab1ba9';
var clientID = '3SeWPh-JvOsppFVV3D-UAQ';
var meters = distance * 1609;
var startPoints = [];
var orsObj = JSON.parse(localStorage.getItem("ors"));
var yelpObj = JSON.parse(localStorage.getItem("yelpObj"));
// var startLat = 37.787047;
// var startLong = -122.401239;
var endLat = 37.78658629651325;
var endLong = -122.4045181274414;

function formSubmitHandler(distance) {
    meters = distance * 1609;
    getStartPoints(address, meters);
}

//retrieves yelp api response
function getStartPoints(address, meters){
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=bars&location=" + address + "&radius=" + meters;

    $.ajax({
    url: myurl,
    headers: {
        'Authorization':'Bearer ' + yelpApiKey,
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
        console.log('success: '+data);
        
        // var endLat = data.region.center.latitude;
        // var endLong = data.region.center.longitude;
        yelpObj.push(data);

        // console.log("end: ", endLat, endLong);
        // console.log("start: ", data.businesses[0].coordinates.latitude, data.businesses[0].coordinates.longitude);
        // for (i=0; i < data.businesses.length; i++){
            // var startLat = data.businesses[i].coordinates.latitude;
            // var startLong = data.businesses[i].coordinates.longitude;
            // getRoute(startLat, startLong, endLat, endLong);

        // }
        }
    });
}

// getStartPoints(address, meters);

//take yelp response and run coordinates through mapping api to find bars at max distance
function getRoute(startLat, startLong, endLat, endLong){
    var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.openrouteservice.org/v2/directions/foot-walking?api_key=' + orsApiKey + '&start=' + startLong + "," + startLat + '&end=' + endLong + "," + endLat + '&units=m';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        //   console.log(data);
        // if (data.features[0].properties.summary.distance.value >= 1550){
        //     startPoints.push(data.features[0].properties.summary.distance.value);
        //     console.log(startPoints);
        // }
            orsObj.push(data);
        // console.log(startPoints);

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenRouteSource');
    });
}

function solveForStartPoints(endLat, endLong, ors, yelp) {
    // console.log("data length: ", data.length);

    var orsStart = [];
    var yelpStart = [];

    for (i = 0; i < ors.length; i++) {
        var itDistance = ors[i].features[0].properties.summary.distance;
        // console.log("itDistance: ", itDistance);
        // console.log("Distance: ", data[i].features[0].properties.summary.distance);
        if (itDistance >= (meters * .9) || itDistance >= (meters * .65) || itDistance >= (meters * .5)) {
            // orsStart.push(ors[i].features[0].properties.summary.distance);
            orsStart.push(ors[i]);
            yelpStart.push(yelp[0].businesses[i]);
        }
    }

    console.log("yelpStart: ", yelpStart);
    console.log("orsStart: ", orsStart);

    for (i = 0; i < orsStart.length; i++) {
        yelpStart[i]['ors'] = orsStart[i];
    }
    // console.log("yelpStart: ", yelpStart);
    // console.log("orsStart: ", orsStart);
    // for (i = 0; i < yelpStart.length; i++) {
    // orsStart.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
    // console.log("ors sorted: ", orsStart);
    // console.log("yelpStart: ", yelpStart);
    // for (x = 0; x < yelpStart.length; x++) {
    //     for (i = 0; i < 3; i++) {
    //         if (orsStart[i] === yelpStart[x].ors){
    //         startPoints.push(yelpStart[x]);
    //     }
    // }
    // console.log("startPoints: ", startPoints);
    
    // }
}

solveForStartPoints(endLat, endLong, orsObj, yelpObj);

//append results to DOM

//take desired start point and iterate though decreasing distances between startpoint and endpoint to find other bars (distance//bars)

//append route results to DOM
// Persona'
// 'The Lark Bar'
// 'Bourbon & Branch'
