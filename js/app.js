$(document).ready(function(){

window.onload = function() {
	$('.launch-screen').fadeIn(1000);
	$('.launch-screen').delay(2000).fadeOut(1000);
	$('.get-location').delay(4000).fadeIn(1000);
}

$('.find-bike').on('click', function() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    document.getElementById('startLat').innerHTML = startPos.coords.latitude;
    document.getElementById('startLon').innerHTML = startPos.coords.longitude;
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
});


});