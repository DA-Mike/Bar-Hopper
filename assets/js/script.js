//vars
var address = "757 Market St, San Francisco, CA 94103";
var barNumber = 3;
var distance = 1;
var yelpApiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';
var orsApiKey = '5b3ce3597851110001cf62485129bd04419745ee8e37972a9bab1ba9';
var clientID = '3SeWPh-JvOsppFVV3D-UAQ';
var geoKey = '1087193dbf4941adac63e35463300f5e';
var meters = distance * 1609;
var startPoints = [];
// var orsObj = JSON.parse(localStorage.getItem("ors"));

var geoObj = JSON.parse(localStorage.getItem("geoObj"))||[]
var yelpObj = JSON.parse(localStorage.getItem("yelpObj"))||[]
// var startLat = 37.787047;
// var startLong = -122.401239;
// var endLat = 37.78658629651325;
// var endLong = -122.4045181274414;
console.log(geoObj,yelpObj);

function formSubmitHandler(distance,address) {
    var meters = parseInt(distance) * 1609;
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
        
        var endLat = data.region.center.latitude;
        var endLong = data.region.center.longitude;
        yelpObj.push(data);

        // console.log("end: ", endLat, endLong);
        // console.log("start: ", data.businesses[0].coordinates.latitude, data.businesses[0].coordinates.longitude);
        for (i=0; i < data.businesses.length; i++){ // use barnumber 
            var startLat = data.businesses[i].coordinates.latitude;
            var startLong = data.businesses[i].coordinates.longitude;
            getRoute(startLat, startLong, endLat, endLong);

        }
        }
    });
}

// getStartPoints(address, meters);

//take yelp response and run coordinates through mapping api to find bars at max distance


function getRoute(startLat, startLong, endLat, endLong){
    // var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.openrouteservice.org/v2/directions/foot-walking?api_key=' + orsApiKey + '&start=' + startLong + "," + startLat + '&end=' + endLong + "," + endLat + '&units=m';
    var apiUrl = 'https://api.geoapify.com/v1/routing?waypoints=' + startLat + ',' + startLong + '|' + endLat + ',' + endLong + '&mode=walk&apiKey=' + geoKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
         // orsObj.push(data);
            geoObj.push(data);
        // console.log(startPoints);
// append data to HTML
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenRouteSource');
    });
}

// getRoute(startLat, startLong, endLat, endLong);

function solveForStartPoints(geo, yelp) {
    // console.log("data length: ", data.length);

    var geoStart = [];
    var yelpStart = [];

    // for (i = 0; i < geo.length; i++) { 
    //     var itDistance = geo[i].features[0].properties.distance;
    //     // console.log("itDistance: ", itDistance);
    //     // console.log("Distance: ", data[i].features[0].properties.summary.distance);
    //     if (itDistance >= (meters * .9) || itDistance >= (meters * .65) || itDistance >= (meters * .5)) {
    //         // orsStart.push(ors[i].features[0].properties.summary.distance);
    //         geoStart.push(geo[i]);
    //         yelpStart.push(yelp[0].businesses[i]);
    //     }
    // }

    for (i = 0; i < yelp[0].businesses.length; i++) {
        var itDistance = yelp[0].businesses[i].distance; 
        console.log("distance: ", yelp[0].businesses[i].distance);
        if (itDistance >= (meters * .9) || itDistance >= (meters * .65) || itDistance >= (meters * .5)) {
                    // orsStart.push(ors[i].features[0].properties.summary.distance);
                // geoStart.push(geo[i]);
            yelpStart.push(yelp[0].businesses[i]);
        }
    }

    console.log("yelpStart: ", yelpStart);
    // console.log("geoStart: ", geoStart);

    // for (i = 0; i < geoStart.length; i++) {
    //     yelpStart[i]['ors'] = geoStart[i];
    // }
    // console.log("yelpStart: ", yelpStart);
    // console.log("orsStart: ", orsStart);
    // for (i = 0; i < yelpStart.length; i++) {
    yelpStart.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
    // console.log("ors sorted: ", orsStart);
    // console.log("yelpStart: ", yelpStart);
    // for (x = 0; x < yelpStart.length; x++) {
    for (i = 0; i < 3; i++) {
        // if (yelpStart[i] === yelpStart[x].ors){
        startPoints.push(yelpStart[i]);
    }
    // }
    console.log("startPoints: ", startPoints);
    
    // }
}

document.getElementById('button')
.addEventListener('click',function(){
    
    
    var address = document.getElementById('address').value
    var barnumber = document.getElementById('barnumber').value
    var distance = document.getElementById('distance').value
formSubmitHandler(distance,address)
console.log(address,barnumber,distance)
})

// solveForStartPoints(geoObj, yelpObj);

//append results to DOM

//take desired start point and iterate though decreasing distances between startpoint and endpoint to find other bars (distance//bars)

//append route results to DOM
// Persona'
// 'The Lark Bar'
// 'Bourbon & Branch'
