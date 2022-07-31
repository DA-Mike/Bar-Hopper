//vars
// var address = "757 Market St, San Francisco, CA 94103"; //document.querySelector("#address");
var barNumber = 3; //document.querySelector("#barNumber");
var distance = 1; //document.querySelector("#distance");
//var inputEl = document.querySelector(".input-form");
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
<<<<<<< HEAD
// var endLat = 37.78658629651325;
// var endLong = -122.4045181274414;
console.log(geoObj,yelpObj);

function formSubmitHandler(distance,address) {
    var meters = parseInt(distance) * 1609;
    getStartPoints(address, meters);
=======
var endLat = 37.78665355217418;
var endLong = -122.40389365795478;
var yelpStartPoint = [];
var shortList = [];
var candidates = [];
var yelpStart = [];
var routeObj = [];

//handles input
function formSubmitHandler(distance, address, barnumber) {
    meters = distance * 1609;
    // getStartPoints(address, meters);
    // address = '';
    // barnumber = '';
    // distance = '';
    console.log("distance: ", distance, " address: ", address);
>>>>>>> 4af9fd603459addb89f80d236af9069707ee89e4
}

//handles starting point selection
//TODO
function buttonClickHandler(event) {
    // findQuadrant(endLat, endLong, yelpStartPoint);
}

//TODO plugin api functions to populate objects instead of using local storage

//retrieves yelp api response
function getStartPoints(address, meters){
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=bars&location=" + address + "&radius=" + meters + '&limit=30';

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

<<<<<<< HEAD
        // console.log("end: ", endLat, endLong);
        // console.log("start: ", data.businesses[0].coordinates.latitude, data.businesses[0].coordinates.longitude);
        for (i=0; i < data.businesses.length; i++){ // use barnumber 
            var startLat = data.businesses[i].coordinates.latitude;
            var startLong = data.businesses[i].coordinates.longitude;
            getRoute(startLat, startLong, endLat, endLong);

        }
        }
=======
    }
>>>>>>> 4af9fd603459addb89f80d236af9069707ee89e4
    });
    // solveForStartPoints(yelpObj);
}

// getStartPoints(address, meters);

//TODO: get route
function getRoute(candidateList, endLat, endLong){
    // var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.openrouteservice.org/v2/directions/foot-walking?api_key=' + orsApiKey + '&start=' + startLong + "," + startLat + '&end=' + endLong + "," + endLat + '&units=m';
<<<<<<< HEAD
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
=======
    var barWayPoints = '';
    var mapCoordinates = '';
    
    for (i = 0; i < candidateList.length; i++) {
        barWayPoints = barWayPoints.concat(candidateList[i].coordinates.latitude);
        mapCoordinates = mapCoordinates.concat(candidateList[i].coordinates.longitude);
        barWayPoints = barWayPoints.concat(",");
        mapCoordinates = mapCoordinates.concat(",");
        barWayPoints = barWayPoints.concat(candidateList[i].coordinates.longitude);
        mapCoordinates = mapCoordinates.concat(candidateList[i].coordinates.latitude);
        barWayPoints = barWayPoints.concat("|");
        mapCoordinates = mapCoordinates.concat(",");
        console.log("barwaypoints1: ", barWayPoints);
    }
    barWayPoints = barWayPoints.concat(endLat);
    mapCoordinates = mapCoordinates.concat(endLong);
    barWayPoints = barWayPoints.concat(",");
    mapCoordinates = mapCoordinates.concat(",");
    console.log("endLong: ", endLong);
    barWayPoints = barWayPoints.concat(endLong);
    mapCoordinates = mapCoordinates.concat(endLat);

    console.log("barwaypoints: ", barWayPoints);
  
    // var geojson = JSON.stringify(geoJsonObj);
    // var geojson = encodeURIComponent(geojson);
    
    var mapEl = document.getElementById("map");
    // var apiUrl = 'https://api.geoapify.com/v1/routing?waypoints=' + barWayPoints + '&format=json&mode=walk&&details=instruction_details&apiKey=' + geoKey;
    var apiUrl = 'https://api.geoapify.com/v1/routing?waypoints=' + barWayPoints + '&format=json&mode=walk&&details=instruction_details&apiKey=' + geoKey;
    var mapUrl = 'https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=500&height=500&zoom=8.8&geometry=polyline:' + mapCoordinates + ';linewidth:5;linecolor:%23ff6600;linestyle:solid;fillcolor:%236600ff;lineopacity:1;fillopacity:0.8&apiKey=' + geoKey;
    $(mapEl).attr("src", mapUrl);

    fetch(apiUrl)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            // orsObj.push(data);
                // geoObj.push(data);
            // console.log(startPoints);
                routeObj.push(data);
                appendRoute(routeObj);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
        })
        .catch(function (error) {
        alert('Unable to connect to OpenRouteSource');
>>>>>>> 4af9fd603459addb89f80d236af9069707ee89e4
        });
        console.log("routeObj: ", routeObj);
        // appendRoute(routeObj);
}

// getRoute(startLat, startLong, endLat, endLong);


//finds bars that are furthest away from endpoint with distance input parameter
function solveForStartPoints(yelp) {

    for (i = 0; i < yelp[0].businesses.length; i++) {
        var itDistance = yelp[0].businesses[i].distance;
        if (itDistance >= (meters * .9) || itDistance >= (meters * .65) || itDistance >= (meters * .5)) {
            yelpStart.push(yelp[0].businesses[i]);
        } else if (itDistance <= (meters * .1)) {
            //creates short distance list in case we solve for less than desired number of bars
            shortList.push(yelp[0].businesses[i]);
        }
    }
    console.log("yelpStart: ", yelpStart);
    
    yelpStart.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
    
    for (i = 0; i < 3; i++) {
        startPoints.push(yelpStart[i]);
    }
 
    console.log("startPoints: ", startPoints);
    yelpStartPoint.push(yelpStart[0]);
    // appendStartPoints(yelpStart);
}

solveForStartPoints(yelpObj);

//finds which quadrant start point is in relative to end point
function findQuadrant(endLat, endLong, yelpStartPoint) {
    console.log("yelpstartpoint: ", yelpStartPoint);
    
    if (yelpStartPoint[0].coordinates.latitude < endLat && yelpStartPoint[0].coordinates.longitude > endLong) {
        quadrant4(endLat, endLong, yelpStartPoint, yelpObj);
    } else if (yelpStartPoint[0].coordinates.latitude < endLat && yelpStartPoint[0].coordinates.longitude < endLong) {
        quadrant3(endLat, endLong, yelpStartPoint, yelpObj);
    } else if (yelpStartPoint[0].coordinates.latitude > endLat && yelpStartPoint[0].coordinates.longitude < endLong) {
        quadrant2(endLat, endLong, yelpStartPoint, yelpObj);
    } else {
        quadrant1(endLat, endLong, yelpStartPoint, yelpObj);
    }
}

findQuadrant(endLat, endLong, yelpStartPoint);

//quadrant solvers
function quadrant4(endLat, endLong, yelpStartPoint, yelpObj) {
    for (i = 0; i < yelpObj[0].businesses.length; i++) {
        if ((yelpObj[0].businesses[i].coordinates.latitude < endLat) && (yelpObj[0].businesses[i].coordinates.longitude > endLong)) {
            candidates.push(yelpObj[0].businesses[i]);
        }
    }
    console.log("candidates4: ", candidates);
    optimizer(candidates, shortList, yelpStartPoint);
}

function quadrant3(endLat, endLong, yelpStartPoint, yelpObj) {
    for (i = 0; i < yelpObj[0].businesses.length; i++) {
        if ((yelpObj[0].businesses[i].coordinates.latitude < endLat) && (yelpObj[0].businesses[i].coordinates.longitude < endLong)) {
            candidates.push(yelpObj[0].businesses[i]);
        }
    }
    optimizer(candidates, shortList, yelpStartPoint);
    console.log("candidates3: ", candidates);
}

function quadrant2(endLat, endLong, yelpStartPoint, yelpObj) {
    for (i = 0; i < yelpObj[0].businesses.length; i++) {
        if ((yelpObj[0].businesses[i].coordinates.latitude > endLat) && (yelpObj[0].businesses[i].coordinates.longitude < endLong)) {
            candidates.push(yelpObj[0].businesses[i]);
        }
    }
    console.log("candidates2: ", candidates);
    optimizer(candidates, shortList, yelpStartPoint);
}

function quadrant1(endLat, endLong, yelpStartPoint, yelpObj) {
    for (i = 0; i < yelpObj[0].businesses.length; i++) {
        if ((yelpObj[0].businesses[i].coordinates.latitude > endLat) && (yelpObj[0].businesses[i].coordinates.longitude > endLong)) {
            candidates.push(yelpObj[0].businesses[i]);
        }
    }
    console.log("candidates1: ", candidates);
    optimizer(candidates, shortList, yelpStartPoint);
}

//optimizes list to ensure the results match the desired number of bars
function optimizer(candidates, shortList, startInput) {
    console.log("startInput: ", startInput);
    if (candidates.length < barNumber) {
        console.log("bars <");
        for (i = 0; i < (barNumber - candidates.length); i++) {
            var shortListSelection = shortList[Math.floor(Math.random() * (shortList.length-1))];
            if (startInput[0].id !== shortListSelection.id){
                candidates.push(shortListSelection);
            }
        }
        console.log("candidates <: ", candidates);
    } else if (candidates.length > barNumber) {
        console.log("bars >");
        var candidatesTemp = [];
        candidatesTemp.unshift(startInput[0]);
        for (i = 0; i < barNumber-1; i++) {
            console.log("candidatesTemp 1st");
            for (x = 0; x < candidatesTemp.length; x++) {
                var shortListSelection = candidates[Math.floor(Math.random() * (candidates.length-1))];
                console.log("candidatesTemp 2nd");
                if (candidatesTemp.length < barNumber){
                    if ((startInput[0].id !== shortListSelection.id) && candidatesTemp[x].id !== shortListSelection.id) {
                        candidatesTemp.push(shortListSelection);
                    }
                }
            }
        }
        candidates = candidatesTemp;
        console.log("candidates >: ", candidates);
    }
    console.log("candidates (out): ", candidates);
    getRoute(candidates, endLat, endLong);
    // appendResults(candidates);
}


//append results to DOM
function appendStartPoints(points){
    for (i = 0; i < points.length; i++) {
        //create div element and add classes
        //create h4 element and add classes
        //create img element and add classes
        //append h4 to div
        //append img to div
        //append div to container
    }
}

//append route results to DOM
function appendResults(barResults) {
    for (i = 0; i < barResults.length; i ++) {
        //create div element and add classes
        //create h4 (bar name) element and add classes
        //create img element and add classes
        //creat h6 (distance) element and add classes
        //append h4 to div
        //append img to div
        //append h6 to div
        //append div to container
    }
}

function appendRoute(routeObj) {
    //routeObj[0].results[0].geometry[0][0].lon
    var objWayPoints =  routeObj[0].results[0].geometry;
    var wayPoints = '';
    var counter = 0;

    for (i = 0; i < objWayPoints.length; i++) {
        // console.log("objWayPoints: ", objWayPoints);
        for (n = 0; n < objWayPoints[i].length; n++){
            // console.log("objWayPoints[i]: ", objWayPoints[i]);
            if (counter !== 0) {
                wayPoints = wayPoints.concat(',');
            }
            wayPoints = wayPoints.concat(objWayPoints[i][n].lon);
            wayPoints = wayPoints.concat(',');
            wayPoints = wayPoints.concat(objWayPoints[i][n].lat);
            counter++;
        }
    }
    console.log("wayPoints: ", wayPoints);
    console.log("counter: ", counter);
    var mapEl = document.getElementById("map");
    var mapUrl = 'https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=500&height=500&zoom=8.8&geometry=polyline:' + wayPoints + ';linewidth:5;linecolor:%23ff6600;linestyle:solid;fillcolor:%236600ff;lineopacity:1;fillopacity:0.8&apiKey=' + geoKey;
    $(mapEl).attr("src", mapUrl);
    //create div element and add classes
    //create img element and add classes
    //append img to div
    //append div to container
}

document.getElementById('button')
.addEventListener('click',function(){
    
    
    var address = document.getElementById('address').value
    var barnumber = document.getElementById('barnumber').value
    var distance = document.getElementById('distance').value
formSubmitHandler(distance,address)
console.log(address,barnumber,distance)
})

<<<<<<< HEAD
// solveForStartPoints(geoObj, yelpObj);
=======

>>>>>>> 4af9fd603459addb89f80d236af9069707ee89e4

//TODO: event listeners
//homepage event listener inputEl.addEventListener("submit", formSubmitHandler);
document.getElementById('button')
.addEventListener('click',function(){
    console.log('Hello');
    var address = document.getElementById('address').value;
    var barnumber = document.getElementById('barnumber').value;
    var distance = document.getElementById('distance').value;
    formSubmitHandler(distance,address,barnumber);
// console.log(address,barnumber,distance);
})
//starting point event listener startEl.addEventListener("click", buttonClickHandler);


//initialize page
