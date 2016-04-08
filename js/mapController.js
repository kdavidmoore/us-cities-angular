// create the controller and inject Angular's $scope, as well as our service.
mapApp.controller("mapController", function($scope, $compile, $http, $routeParams, cityService){
	console.log($routeParams);
	var checkedPlaces = [];
	$scope.places = places;
	$scope.markers = [];

	// clear previous markers
	/* if ($scope.markers.length > 0) {
		clearMarkers();
	} */

	$scope.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(40.0000, -98.0000)
	 });

	var infowindow = new google.maps.InfoWindow;

	var filterInput =  /** @type {!HTMLInputElement} */(
		document.getElementById('filter-input'));
	var autocomplete = new google.maps.places.Autocomplete(filterInput);
	autocomplete.bindTo('bounds', $scope.map);

	// add a listener to the autocomplete
	autocomplete.addListener('place_changed', function() {
	    infowindow.close();
	    var place = autocomplete.getPlace();
	    if (!place.geometry) {
	      window.alert("Autocomplete's returned place contains no geometry");
	      return;
	    }
	});

  	$scope.createMarker = function (city){
	  	var latLon = city.latLon.split(",");
	  	var lat = latLon[0];
	  	var lon = latLon[1];
		var marker = new google.maps.Marker({
			lat: Number(lat),
			lon: Number(lon),
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
	  $scope.markers.push(marker);
	}

	$scope.showInfo = function(i){
		google.maps.event.trigger($scope.markers[i-1], "click");
	}

	$scope.getDirections = function(lat, lon){
  		var mapPanel = document.getElementById("map-panel")
  		mapPanel.classList.add("hidden");
  		var dirPanel = document.getElementById("directions-panel");
		dirPanel.classList.add("view-height");

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var map = new google.maps.Map(document.getElementById('map'),{
			zoom: 7,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('directions-panel'))
			
		var request = {
			origin: "Atlanta, GA",
			destination: new google.maps.LatLng(lat,lon),
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});
		//return $scope.hidePanel;
	}

	$scope.cities = cities;
	for(var i = 0; i < cities.length; i++){
		$scope.createMarker(cities[i]);
	}

	function clearMarkers() {
    	for (var i=0; i<$scope.markers.length; i++) {
    		$scope.markers[i].setMap(null);
  		}	
  		$scope.markers = [];
    }
});