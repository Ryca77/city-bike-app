$(document).ready(function(){

//show logo then bike finder button//
window.onload = function() {
	$('.launch-screen').fadeIn(1000);
	$('.launch-screen').delay(2000).fadeOut(1000);
	$('.get-location').delay(4000).fadeIn(1000);
}

//call location function on button click//
$('.find-bike').on('click', function() {

	$('.get-location').fadeOut(1000);
	$('.main-content').delay(1000).fadeIn(500);

	getLocation();

});

//navigator geolocation function showing google map with marker//
function getLocation() {
	var bikeMap = document.getElementById('map');

	if(!navigator.geolocation) {
		bikeMap.innerHTML = "<p>Geolocation is not supported by your browser</p>"
		return;
	}

	function locationSuccess(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var mapCenter = {lat: latitude, lng: longitude};
		console.log(latitude);
		console.log(longitude);
        var mapImage = new google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
        });
        var marker = new google.maps.Marker({
    	position: mapCenter,
    	map: mapImage,
    	title: 'Your Location!'
    	});

    	$(bikeMap).html(mapImage);
		
	};

	function locationError() {
		bikeMap.innerHTML = "Unable to retrieve your location";
	};

	bikeMap.innerHTML= "<p>Finding Location...</p>";

	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

//get data from city bikes api//
function getBikeData() {

	url = "http://api.citybik.es/v2/networks"
	$.getJSON(url, function(data) {

	console.log(data);
	

	//loop through data//
	$.each(data.networks, function(index, listings) {
		var stations = listings.id
		console.log(stations)
	});

	var networkId = data.networks[0].id
	console.log(networkId)

	url = "http://api.citybik.es/v2/networks/" + networkId + ""
	$.getJSON(url, function(networks) {
	console.log(networks)

	});
});
	
}

getBikeData()


});

/*for (var i = 0; i < data.networks.length; i++) {
	$('#locations').append('<div>' + data.networks[i].company + '</div>')
	}
});
}*/