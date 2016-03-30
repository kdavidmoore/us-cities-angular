var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function($scope, $compile){

	$scope.cities = cities;
	
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(40.00, -98.00)
	});

	$scope.markers = [];

	var infowindow = new google.maps.InfoWindow;

	// initialize directions service
	$scope.directionsService = new google.maps.DirectionsService();
	$scope.directionsDisplay = new google.maps.DirectionsRenderer();
	$scope.directionsDisplay.setMap($scope.map);
	$scope.directionsDisplay.setPanel(document.getElementById('directions-panel'));

	function createMarker(city) {
		var latLon = city.latLon.split(",");
		var lat = latLon[0];
		var lon = latLon[1];

		var marker = new google.maps.Marker({
		// google.maps.LatLng will make it a number
		  position: new google.maps.LatLng(lat, lon),
		  map: $scope.map,
		  title: city.city,
		  animation: google.maps.Animation.DROP
		});

		var contentString =
			'<div class="city-info">'+
			'<h1>'+ city.city +'</h1>'+
			'<h5>Total Population:&nbsp;'+ city.yearEstimate + '</h5>'+
			'<h5>2010 Census:&nbsp;' + city.lastCensus + '</h5>'+
			'<h5>Population Change:&nbsp;' + city.change + '</h5>'+
			'<h5>Population Density:&nbsp;' + city.lastPopDensity + '</h5>'+
			'<h5>State:&nbsp;' + city.state + '</h5>'+
			'<h5>Land Area:&nbsp;' + city.landArea + '</h5>'+
			'<a href="" ng-click="getDirections('+lat+','+lon+')">Get Directions</a>'+
			'</div>';

		var compiledContent = $compile(contentString)($scope);

		marker.addListener('click', function() {
			infowindow.setContent(compiledContent[0]);
			infowindow.open($scope.map, marker);	
		});

		// add the current marker to the markers array
		$scope.markers.push(marker);
	} // end createMarker

	// this loop creates a marker for each city by calling createMarker
	for (i=0; i<cities.length; i++) {
		createMarker(cities[i]);
	}

	$scope.showInfo = function(i){
		// trigger the click event on a particular marker when the appropriate side-panel button is clicked
    	google.maps.event.trigger($scope.markers[i], 'click');
  	}

  	$scope.zoomTo = function(i){
  		var latLon = cities[i].latLon.split(",");
		var newLat = Number(latLon[0]);
		var newLon = Number(latLon[1]);
		$scope.map.setCenter({
			lat: newLat,
			lng: newLon
		});

		$scope.map.setZoom(9);
  	}

  	$scope.getDirections = function(lat,lon){
  		var latLon = cities[38].latLon.split(",");
		var atlLat = latLon[0];
		var atlLon = latLon[1];
		var start = new google.maps.LatLng(atlLat, atlLon);
  		var end = new google.maps.LatLng(lat, lon);
	
  		var request = {
    		origin: start,
    		destination: end,
    		travelMode: google.maps.TravelMode.DRIVING
  		};
  		
  		infowindow.close();

  		$scope.directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
		  		$scope.directionsDisplay.setDirections(result);
			}
		});
  	}
})