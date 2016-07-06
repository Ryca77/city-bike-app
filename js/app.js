$(document).ready(function(){

//show logo then bike finder button//
window.onload = function() {
	$('.launch-screen').fadeIn(1000);
	$('.launch-screen').delay(1500).fadeOut(1000);
	$('.get-location').delay(3500).fadeIn(1000);
}

//call location function on button click//
$('.find-bike').on('click', function() {

	$('.get-location').fadeOut(1000);
	$('.main-content').delay(1000).fadeIn(500);

getLocation();

});

//update location//
$('.map').on('click', function() {
	$('.map-overlay').fadeIn(500);	
});
$('.map-overlay').on('click', function() {
	getLocation();
	$('.map-overlay').hide();
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
        var iconLocation = {
        	url: "../images/current-location-icon1.png",
        	scaledSize: new google.maps.Size(23, 35)
        }
        var marker = new google.maps.Marker({
    	position: mapCenter,
    	map: mapImage,
    	title: 'Your Location!',
    	icon: iconLocation
    	});

        $(bikeMap).html(mapImage);

		//get data from city bikes api//
		function getBikeData() {

		//initial list of networks//
		url = "https://api.citybik.es/v2/networks"
			$.getJSON(url, function(data) {
			console.log(data);
	
		//loop through networks//
		$.each(data.networks, function(index, listings) {
			var networkId = listings.id;
			var networkName = listings.name;
			/*console.log(networkId);*/
	
		//additional data for each network//
		url = "https://api.citybik.es/v2/networks/" + networkId + ""
			$.getJSON(url, function(networks) {
			/*console.log(networks);*/
			/*console.log(networks.network.stations);*/
	
		//loop through stations data for each network//
		$.each(networks.network.stations, function(index, station) {
			var stationName = station.name;
			var freeBikes = "Available Bikes: " + station.free_bikes + "";
			var emptySlots = "Empty Slots: " + station.empty_slots + "";
			var stationLat = station.latitude;
			var stationLong = station.longitude;
			var stationPosition = {lat: stationLat, lng: stationLong};

		//create markers for each station and add info to panel on click//
        var iconGreen = {
        	url: "./images/bike-icon-green-small.png",
        	/*scaledSize: new google.maps.Size(40, 25)*/
        };
        var iconAmber = {
        	url: "./images/bike-icon-orange-small.png",
        	/*scaledSize: new google.maps.Size(40, 25)*/
        };
        var iconRed = {
        	url: "./images/bike-icon-red-small.png",
        	/*scaledSize: new google.maps.Size(40, 25)*/
        };
        if(station.free_bikes >= 5) {
        	var mapIcon = iconGreen;
        	}
        else if(station.free_bikes > 0 && station.free_bikes < 5) {
        	var mapIcon = iconAmber;
        	}
        else if(station.free_bikes === 0) {
        	var mapIcon = iconRed;
        	}
        
        var stationMarker = new google.maps.Marker({
    	position: stationPosition,
    	map: mapImage,
    	customInfo: networkName, stationName, freeBikes, emptySlots,
    	icon: mapIcon
    	});

    	google.maps.event.addListener(stationMarker, 'click', function() {
    	$('.scheme-name').html(this.customInfo);
    	$('.station-name').html(this.stationName);
    	$('.free-bikes').html(this.freeBikes);
		$('.empty-slots').html(this.emptySlots);
		});

	});
});
	});
});

};

getBikeData();

};

	function locationError() {
		bikeMap.innerHTML = "Unable to retrieve your location";
	};

	bikeMap.innerHTML= "<p>Finding Location...</p>";

	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}

//show menu//
$('.fa-bars').on('click', function() {
	if($('.menu').is(':hidden')) {
		$('.menu').show();
	}
	else if($('.menu').is(':visible')) {
		$('.menu').hide();
	}
});

});
