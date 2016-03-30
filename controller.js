var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function($scope){

	$scope.cities = cities;
	
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(40.00, -98.00)
	});

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
	}

	for (i=0; i<cities.length; i++) {
		createMarker(cities[i]);
	}

	function showInfo(i) {
		console.log($scope.cities[i]);
	
	}

})