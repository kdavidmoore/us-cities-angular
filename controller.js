var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function($scope){

	$scope.cities = cities;
	
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(40.00, -98.00)
	});

	$scope.markers = [];

	var infowindow = new google.maps.InfoWindow;

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
			'<a href="" ng-click="getDirections(city)"><h5>Get Directions</h5></a>'+
			'</div>';

		/* var infowindow = new google.maps.InfoWindow({
			content: contentString
		}); */

		marker.addListener('click', function() {
			infowindow.setContent(contentString);
			infowindow.open($scope.map, marker);
		});

		// add the current marker to the markers array
		$scope.markers.push(marker);
	}

	// this loop creates a marker for each city by calling createMarker
	for (i=0; i<cities.length; i++) {
		createMarker(cities[i]);
	}

	$scope.showInfo = function(i){
		// trigger the click event on a particular marker when the appropriate side-panel button is clicked
    	google.maps.event.trigger($scope.markers[i], 'click');
  	}

  	$scope.zoomTo = function(i){
  		// change center to cities[i].latLong blah blah
  		// increase zoom to 12ish
  		var latLon = cities[i].latLon.split(",");
		var newLat = Number(latLon[0]);
		var newLon = Number(latLon[1]);
		// var newCenter = new google.maps.LatLng(newLat, newLon);
		$scope.map.setCenter({
			lat : newLat,
			lng : newLon
		});

		$scope.map.setZoom(9);
  	}

  	$scope.getDirections = function(i){
  		console.log(i);
  	}

})