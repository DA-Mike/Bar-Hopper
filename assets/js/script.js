//vars
var address = '';
var barNumber = 0;
var distance = 0;
//var inputEl = document.querySelector(".input-form");
var startEl = document.querySelector(".startpoints-container");
var yelpApiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';
var orsApiKey = '5b3ce3597851110001cf62485129bd04419745ee8e37972a9bab1ba9';
var clientID = '3SeWPh-JvOsppFVV3D-UAQ';
var geoKey = '1087193dbf4941adac63e35463300f5e';
var meters = distance * 1609;
var startPoints = [];
var geoObj = JSON.parse(localStorage.getItem("geoObj"))||[]
var yelpObj = JSON.parse(localStorage.getItem("yelpObj"))||[]
var startLat = 0; //37.787047;
var startLong = 0; //-122.401239;
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
    // address = '';
    // barnumber = '';
    // distance = '';
    console.log("distance: ", distance, " address: ", address);
    getStartPoints(address, meters);
}

//handles starting point selection
function buttonClickHandler(event) {
    event.preventDefault();

    var bar = event.target.getAttribute('name');

    for (i = 0; i < yelpStart.length; i++){
        if (yelpStart[i].id == bar){
            yelpStartPoint = yelpStart[i];
            findQuadrant(endLat, endLat, yelpStartPoint);
        }
    }
    console.log(bar);
}

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
        
        endLat = data.region.center.latitude;
        endLong = data.region.center.longitude;
        yelpObj.push(data);
        solveForStartPoints(yelpObj);

    }
    });
}

//TODO: get route
function getRoute(candidateList, endLat, endLong){
    // var apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.openrouteservice.org/v2/directions/foot-walking?api_key=' + orsApiKey + '&start=' + startLong + "," + startLat + '&end=' + endLong + "," + endLat + '&units=m';
    var barWayPoints = '';
    
    for (i = 0; i < candidateList.length; i++) {
        barWayPoints = barWayPoints.concat(candidateList[i].coordinates.latitude);
        barWayPoints = barWayPoints.concat(",");
        barWayPoints = barWayPoints.concat(candidateList[i].coordinates.longitude);
        barWayPoints = barWayPoints.concat("|");
    }
    barWayPoints = barWayPoints.concat(endLat);
    barWayPoints = barWayPoints.concat(",");
    barWayPoints = barWayPoints.concat(endLong);

    console.log("barwaypoints: ", barWayPoints);

    // var apiUrl = 'https://api.geoapify.com/v1/routing?waypoints=' + barWayPoints + '&format=json&mode=walk&&details=instruction_details&apiKey=' + geoKey;
    var apiUrl = 'https://api.geoapify.com/v1/routing?waypoints=' + barWayPoints + '&format=json&mode=walk&&details=instruction_details&apiKey=' + geoKey;
    
    fetch(apiUrl)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                routeObj.push(data);
                appendRoute(routeObj);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
        })
        .catch(function (error) {
        alert('Unable to connect to GeoApify');
        });
        console.log("routeObj: ", routeObj);
}

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
    console.log("yelpStart: ", yelpStart);
    appendStartPoints(yelpStart);
}

//finds which quadrant start point is in relative to end point
function findQuadrant(endLat, endLong, yelpStartPoint) {
    console.log("yelpstartpoint: ", yelpStartPoint);
    
    if (yelpStartPoint.coordinates.latitude < endLat && yelpStartPoint.coordinates.longitude > endLong) {
        quadrant4(endLat, endLong, yelpStartPoint, yelpObj);
    } else if (yelpStartPoint.coordinates.latitude < endLat && yelpStartPoint.coordinates.longitude < endLong) {
        quadrant3(endLat, endLong, yelpStartPoint, yelpObj);
    } else if (yelpStartPoint.coordinates.latitude > endLat && yelpStartPoint.coordinates.longitude < endLong) {
        quadrant2(endLat, endLong, yelpStartPoint, yelpObj);
    } else {
        quadrant1(endLat, endLong, yelpStartPoint, yelpObj);
    }
}

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
        candidatesTemp.unshift(startInput);
        for (i = 0; i < barNumber-1; i++) {
            console.log("candidatesTemp 1st");
            for (x = 0; x < candidatesTemp.length; x++) {
                var shortListSelection = candidates[Math.floor(Math.random() * (candidates.length-1))];
                console.log("candidatesTemp 2nd");
                if (candidatesTemp.length < barNumber){
                    if ((startInput.id !== shortListSelection.id) && candidatesTemp[x].id !== shortListSelection.id) {
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
    appendResults(candidates);
}


//append results to DOM
function appendStartPoints(points){
    var spContainer = document.getElementsByClassName("startpoints-container");
    
    for (i = 0; i < points.length; i++) {
        var spDiv = $('<div class="startpoint" name=' + points[i].id + '></div>');
        var spName = $('<a href=' + points[i].url + '>' + points[i].name + '</a>');
        // var spName = $('<h4 class="startpoint-name" name=' + points[i].name + '>' + points[i].name + '</h4>');
        var spImg = $('<img src=' + points[i].image_url + ' width="200" height="200" name=' + points[i].id + '>');

        $(spDiv).append(spName);
        $(spDiv).append(spImg);
        $(spContainer).append(spDiv);
    }
}

//append route results to DOM
function appendResults(barResults) {
    var resultsEl = document.getElementsByClassName('results');
    for (i = 0; i < barResults.length; i ++) {
        var rDiv = $('<div class="result"></div>');
        var rName = $('<h4 class="barname">' + barResults[i].name + '</h4>');
        var rImg = $('<img src=' + barResults[i].image_url + ' width="200" height="200" name=' + barResults[i].name + '>');
        var rDist = $('<h6 class="bar-distance">Distance: ' + Math.round(barResults[i].distance) + ' mi</h6>');

        $(rDiv).append(rName);
        $(rDiv).append(rImg);
        $(rDiv).append(rDist);
        $(resultsEl).append(rDiv);
    }
}

//appends route to DOM
function appendRoute(routeObj) {
    // var spContainer = document.getElementsByClassName("startpoints-container");
    var resultsContainer = document.getElementsByClassName("results-container");
    var objWayPoints =  routeObj[0].results[0].geometry;
    var wayPoints = '';
    var counter = 0;
    var latlngs = [];
    var objBarPoints = routeObj[0].properties.waypoints;

    $(startEl).css("display", "none");
    $(resultsContainer).css("display", "flex");

    for (i = 0; i < objWayPoints.length; i++) {
        for (n = 0; n < objWayPoints[i].length; n++){
            var tempArr = [];
            tempArr.push(objWayPoints[i][n].lat);
            tempArr.push(objWayPoints[i][n].lon);
            latlngs.push(tempArr);
        }
    }
    console.log("latlngs: ", latlngs);

    var map = L.map('map').setView([endLat, endLong], 13);
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polyline
    map.fitBounds(polyline.getBounds());    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
        className: 'map-tiles'
    }).addTo(map);

    for (i = 0; i < objBarPoints.length; i++) {
        L.marker([objBarPoints[i].lat, objBarPoints[i].lon]).addTo(map);
    }
}

//homepage event listener
document.getElementById('button')
.addEventListener('click',function(){
    console.log('Hello');
    address = document.getElementById('address').value;
    barNumber = document.getElementById('barnumber').value;
    distance = document.getElementById('distance').value;
    formSubmitHandler(distance,address,barnumber);
// console.log(address,barnumber,distance);
})

//starting point event listener 
startEl.addEventListener("click", buttonClickHandler);


//initialize page
