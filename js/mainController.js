var mapsApp = angular.module('mapsApp', ['ngRoute']);

mapsApp.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'pages/front.html',
		controller: 'mapsController'
	});
	$routeProvider.when('/zoom',{
		templateUrl: 'pages/zoom.html',
		controller: 'zoomController'
	});
	// send the user back to the home page if the route is not valid
	$routeProvider.otherwise({
		templateUrl: 'pages/front.html',
		controller: 'mapsController'
	});
})

mapsApp.controller('mapsController', function($scope, $compile){
	// variable declarations
	var kansas = new google.maps.LatLng(40.00, -98.00);
	$scope.markers = [];
	var searchMarkers = [];
	$scope.cities = cities;
	$scope.map;
	$scope.directionsService;
	$scope.directionsDisplay;
	var placesService;
	var infowindow;
	$scope.placeTypes = placeTypes;
	var myType = '';

	function initMap() {
		$scope.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: kansas
		});

		infowindow = new google.maps.InfoWindow;
		// initialize autocomplete stuff
		var filterInput =  /** @type {!HTMLInputElement} */(
			document.getElementById('filter-input'));
		var autocomplete = new google.maps.places.Autocomplete(filterInput);
		autocomplete.bindTo('bounds', $scope.map);
		// initialize places service
		placesService = new google.maps.places.PlacesService($scope.map);
		// initialize directions service
		$scope.directionsService = new google.maps.DirectionsService();
		$scope.directionsDisplay = new google.maps.DirectionsRenderer();
		$scope.directionsDisplay.setMap($scope.map);
		$scope.directionsDisplay.setPanel(document.getElementById('directions-panel'));

		// this loop creates a marker for each city by calling createMarker
		for (i=0; i<cities.length; i++) {
			createMarker(cities[i]);
		}

		// add a listener to the autocomplete
		autocomplete.addListener('place_changed', function() {
		    infowindow.close();
		    var place = autocomplete.getPlace();
		    if (!place.geometry) {
		      window.alert("Autocomplete's returned place contains no geometry");
		      return;
		    }
		});
	}

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
			'<h1 class="city-header">'+ city.city +'</h1>'+
			'<div class="city-info-text"><span>Total Population:&nbsp;</span>'+ city.yearEstimate + '</div>'+
			'<div class="city-info-text"><span>2010 Census:&nbsp;</span>' + city.lastCensus + '</div>'+
			'<div class="city-info-text"><span>Population Change:&nbsp;</span>' + city.change + '</div>'+
			'<div class="city-info-text"><span>Population Density:&nbsp;</span>' + city.lastPopDensity + '</div>'+
			'<div class="city-info-text"><span>State:&nbsp;</span>' + city.state + '</div>'+
			'<div class="city-info-text"><span>Land Area:&nbsp;</span>' + city.landArea + '</div>'+
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

	$scope.showInfo = function(i){
		var j = Number(i)-1;
		console.log(j);
		// trigger the click event on a particular marker when the appropriate side-panel button is clicked
    	google.maps.event.trigger($scope.markers[j], 'click');
  	}

  	$scope.zoomTo = function(i){
  		infowindow.close();
  		var j = Number(i)-1;
  		console.log(j);
  		myType = $scope.cities[j].place.type;
  		var latLon = cities[j].latLon.split(",");
		var newLat = Number(latLon[0]);
		var newLon = Number(latLon[1]);
		var newLocation = new google.maps.LatLng(newLat, newLon);
		$scope.map.setCenter({lat: newLat, lng: newLon});
		$scope.map.setZoom(11);
		placesService.nearbySearch({
          	location: newLocation,
          	radius: 10000,
          	type: [myType]
        }, callback);
    }

    function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			clearMarkers();
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				createSearchMarker(results[i]);
			}
		}
	}

	function createSearchMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: $scope.map,
          position: place.geometry.location
        });
        searchMarkers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open($scope.map, this);
        });
    }

    function clearMarkers() {
    	for (var i=0; i<searchMarkers.length; i++) {
    		searchMarkers[i].setMap(null);
  		}	
  		searchMarkers = [];
    }

  	$scope.getDirections = function(lat,lon){
  		infowindow.close();
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
  		
  		$scope.directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
		  		$scope.directionsDisplay.setDirections(result);
			}
		});
  	}

  	$scope.resetMap = function() {
  		clearMarkers();
  		$scope.directionsDisplay.set('directions', null);
		$scope.map.setCenter(kansas);
		$scope.map.setZoom(4);
  	}

	initMap();
})