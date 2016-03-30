var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function($scope){

	$scope.cities = cities;
	
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(40.00, -98.00)
	});

	$scope.markers = [];

	function createMarker(city) {
		var latLon = city.latLon.split(",");
		var lat = latLon[0];
		var lon = latLon[1];

		var marker = new google.maps.Marker({
		// google.maps.LatLng will make it a number
		  position: new google.maps.LatLng(lat, lon),
		  map: $scope.map,
		  title: city.city
		});

		var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'<h1>'+ city.city +'</h1>'+
			'<p>'+
			'<strong>Total Population:</strong> '+ city.yearEstimate + '</br>'+
			'<strong>2010 Census:</strong> ' + city.lastCensus + '</br>'+
			'<strong>Population Change:</strong> ' + city.change + '</br>'+
			'<strong>Population Density:</strong> ' + city.lastPopDensity + '</br>'+
			'<strong>State:</strong> ' + city.state + '</br>'+
			'<strong>Land Area:</strong> ' + city.landArea +
			'</p>'+
			'</div>'+
			'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		marker.addListener('click', function() {
		  infowindow.open($scope.map, marker);
		});

		// add the current marker to the markers array
		$scope.markers.push(marker);
	}

	for (i=0; i<cities.length; i++) {
		createMarker(cities[i]);
		// put an event listener on each marker in markers so our showInfo function can see them
		$scope.markers[i].addListener('click', function() {
			infowindow.open($scope.map, $scope.markers[i]);
		});
	}

	// when a button in the side panel is clicked, showInfo opens the info window
	$scope.showInfo = function(i){
		console.log($scope.markers[i]);
		// trigger the above click event on a marker when a button is clicked
    	google.maps.event.trigger($scope.markers[i], 'click');
  	}

})