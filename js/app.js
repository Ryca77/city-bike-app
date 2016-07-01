$(document).ready(function(){

window.onload = function() {
	$('.launch-screen').fadeIn(1000);
	$('.launch-screen').delay(2000).fadeOut(1000);
	$('.get-location').delay(4000).fadeIn(1000);
}

$('.find-bike').on('click', function() {

	$('.get-location').fadeOut(1000);
	$('.main-content').delay(1000).fadeIn(500);

	getLocation();

});

function getLocation() {
	var bikeMap = document.getElementById('map');

	if(!navigator.geolocation) {
		bikeMap.innerHTML = "<p>Geolocation is not supported by your browser</p>"
		return;
	}

	function locationSuccess(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log(latitude);
		console.log(longitude);
		var mapImage = new Image();
		mapImage.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=15&size=300x300&sensor=false";
	
		bikeMap.appendChild(mapImage)
	};

	function locationError() {
		bikeMap.innerHTML = "Unable to retrieve your location";
	};

	bikeMap.innerHTML= "<p>Finding Location...</p>";

	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

});

/*mapImage.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDf2HC-XcAoYMwtj02odxmqeBfTvYqGNdQ&center=" + latitude + "," + longitude + "&zoom=15&size=300x300&sensor=false"*/