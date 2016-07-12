$(document).ready(function() {

//show logo then bike finder button//
window.onload = function() {
	$('.launch-screen').fadeIn(1000);
	$('.launch-screen').delay(1500).fadeOut(1000);
	$('.get-location').delay(3500).fadeIn(1000);
}

//call navigatpor geolocation function on button click//
$('.find-bike').on('click', function() {

	$('.get-location').fadeOut(1000);
	$('.main-content').delay(1000).fadeIn(500, function () {

	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	});
});

window.map.innerHTML= "<p>Finding Location...</p>";

//create generic map//
function createMap() {
	var mapElement = document.getElementById('map');
 	var mapImage = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 0, lng: 0},
		zoom: 15
	});
	return mapImage;
}

	if(!navigator.geolocation) {
		window.map.innerHTML = "<p>Geolocation is not supported by your browser</p>"
		return;
	}

	//centre map on current location and show marker//
	function locationSuccess(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var mapCenter = {lat: latitude, lng: longitude};
		console.log(latitude);
		console.log(longitude);
		window.map = createMap();
		window.map.panTo(mapCenter);
        

        var iconLocation = {
        	url: "./images/current-location-icon1.png",
        	/*scaledSize: new google.maps.Size(23, 35)*/
        }
        var marker = new google.maps.Marker({
    	position: mapCenter,
    	map: window.map,
    	title: 'Your Location!',
    	icon: iconLocation
    	});
        
	//get data from city bikes api//
	function getBikeData() {

		//initial list of networks//
		url = "https://api.citybik.es/v2/networks"
			$.getJSON(url, function(data) {
			console.log(data);

		//determine nearest network using lat/lng calculation loop//
		function distanceFromLatLng(lat1, lng1, lat2, lng2) {
			var radius = 6371;
			var degreesLat = deg2rad(lat2-lat1);
			var degreesLon = deg2rad(lng2-lng1);
			var a =
				Math.sin(degreesLat/2) * Math.sin(degreesLat/2) +
    			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    			Math.sin(degreesLon/2) * Math.sin(degreesLon/2)
    			; 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var distance = radius * c;
			return distance;
			}
		function deg2rad(deg) {
			return deg * (Math.PI/180)
			}

		var nearestNetwork = data.networks[0];
		var nearbyNetworks = [];

		$.each(data.networks, function(index, network) {
			var networkLat = network.location.latitude;
			var networkLng = network.location.longitude;
			var distanceToNetwork = distanceFromLatLng(mapCenter.lat, mapCenter.lng, networkLat, networkLng);
			var distanceToNearest = distanceFromLatLng(mapCenter.lat, mapCenter.lng, nearestNetwork.location.latitude, nearestNetwork.location.longitude);
			
			if(distanceToNetwork < distanceToNearest) {
				nearestNetwork = network;
			}
			else if(distanceToNetwork < 20) {
				nearbyNetworks.push(network);
			}
	
		});
		console.log(nearestNetwork);

		if(!nearbyNetworks.length) {
			nearbyNetworks.push(nearestNetwork);
		}

		//loop through nearest networks to define id variable//
		$.each(nearbyNetworks, function(index, listings) {
			var networkId = listings.id;
			var networkName = listings.name;
			console.log(networkId);

		//get detailed data for each network//
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
    	map: window.map,
    	customInfo: networkName, stationName, freeBikes, emptySlots,
    	icon: mapIcon
    	});

        //show station info when clicked//
    	google.maps.event.addListener(stationMarker, 'click', function() {
    	$('.scheme-name').html(this.customInfo);
    	$('.station-name').html(this.stationName);
    	$('.free-bikes').html(this.freeBikes);
		$('.empty-slots').html(this.emptySlots);
		});
	});
});
console.log(nearestNetwork.id);

//get data from nearest network//
url = "https://api.citybik.es/v2/networks/" + nearestNetwork.id + ""
	$.getJSON(url, function(stationData) {

var nearestStation = stationData.network.stations[0];//
console.log(nearestStation);

//loop through station data and show nearest station info on map load//
$.each(stationData.network.stations, function(index, station) {
	var distanceToStation = distanceFromLatLng(mapCenter.lat, mapCenter.lng, station.latitude, station.longitude);
	var distanceToNearestStation = distanceFromLatLng(mapCenter.lat, mapCenter.lng, nearestStation.latitude, nearestStation.longitude);
	if(distanceToStation < distanceToNearestStation) {
		nearestStation = station;
		}
});
console.log(nearestStation);
$('.scheme-name').html(nearestNetwork.id);
$('.station-name').html(nearestStation.name);
$('.free-bikes').html("Available Bikes: " + nearestStation.free_bikes + "");
$('.empty-slots').html("Empty Slots: " + nearestStation.empty_slots + "");

			});
		});
	});
};

getBikeData();

};

	function locationError() {
		window.map.innerHTML = "Unable to retrieve your location";
	};

//update location//
$('.map').on('click', function() {
	$('.map-overlay').fadeIn(500);	
});
$('.map-overlay').on('click', function() {
	$('.map-overlay').hide();
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
});

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
