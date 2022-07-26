//vars
var address = "757 Market St, San Francisco, CA 94103";
var barNumber = 3;
var distance = 1;
var apiKey = 'DYFEfk2kVJcBhHtPathDiY9bh178rFPnBNdoblLIdXyHnc0tjKrJBrqVT0KEyPxX7RyfDrusI6nUOcD3YPuopXx3KpBnxPjGYWZzEGXKMEfS90kMw8lsHm-Us17fYnYx';
var clientID = '3SeWPh-JvOsppFVV3D-UAQ';
var meters = distance * 1609;

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
        'Authorization':'Bearer ' + apiKey,
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
        console.log('success: '+data);
    }
    });
}
getStartPoints(address, meters);

//take yelp response and run coordinates through mapping api to find bars at max distance

//append results to DOM

//take desired start point and iterate though decreasing distances between startpoint and endpoint to find other bars (distance//bars)

//append route results to DOM

