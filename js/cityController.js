mapApp.controller("cityController", function($scope, $compile, $http, $routeParams, cityService){
	// get the current city from $routeParams
	var cityIndex = $routeParams.cityIndex;
	$scope.cities = cities;
	var checkedPlaces = [];
	$scope.places = places;
	var searchMarkers = [];
	var latLon = cities[cityIndex-1].latLon.split(',');
	var lat = latLon[0];
	var lon = latLon[1];
	var center = new google.maps.LatLng(lat, lon);
	var myType = $scope.cities[cityIndex-1].place;
	//console.log($scope.cities[cityIndex-1].place);
	var infowindow = new google.maps.InfoWindow;
	
	var storedMap = cityService.get();
	console.log("According to my service, the next line is the stored map.");
	console.log(storedMap);
	if(storedMap === 'noMap'){
		$scope.map = new google.maps.Map(document.getElementById('city-map'), {
			center: center,
			zoom: 12
		});		
		cityService.set($scope.map);
		storedMap = cityService.get();
		console.log("According to my service, the next line is the stored map.");
		console.log(storedMap);
	} else {
		$scope.map = storedMap;
		$scope.map.setCenter(center);
		$scope.map.setZoom(12);    		
	}

    var service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch({
		location: center,
		radius: 10000,
		type: [myType]
	}, callback);
          
	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			clearMarkers();
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	}
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          position: placeLoc,
          map: $scope.map,
          title: place.city,
          animation: google.maps.Animation.DROP,
          place: {
        	placeId: place.place_id,
        	location: place.geometry.location
      		}
        });

	    // copypasta from my old version of the app
	    var request = {
	  		placeId: place.place_id
		};

		service.getDetails(request, detailCallback);

		function detailCallback(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var lat = place.geometry.location.lat();
				var long = place.geometry.location.lng();
				var contentString = 
		    		'<div class="city-info">'+
					'<h1 class="city-header">'+ place.name + '</h1>'+
					'<div class="city-info-text">'+ place.formatted_address + '</div>'+
					'<a href="" ng-click="getDirections('+lat+','+long+')">Get Directions</a>'+
					'</div>';

		   		var compiledContent = $compile(contentString)($scope);

		        google.maps.event.addListener(marker, 'click', function() {
		          infowindow.setContent(compiledContent[0]);
		          infowindow.open($scope.map, this);
		        });

		        searchMarkers.push(marker);

	  		} else {
	  			var contentString = 
		    		'<div class="city-info">'+
					'<div class="city-info-text">Unable to get details</div>'+
					'</div>';

		   		var compiledContent = $compile(contentString)($scope);

		        google.maps.event.addListener(marker, 'click', function() {
		          infowindow.setContent(compiledContent[0]);
		          infowindow.open($scope.map, this);
		        });

		        searchMarkers.push(marker);
	  			}
			}
		}

    function clearMarkers() {
    	for (var i=0; i<searchMarkers.length; i++) {
    		searchMarkers[i].setMap(null);
  		}	
  		searchMarkers = [];
    }

  	$scope.getDirections = function(lat, lon){
  		var mapPanel = document.getElementById("map-panel")
  		mapPanel.classList.add("hidden");
  		var dirPanel = document.getElementById("directions-panel");
		dirPanel.classList.add("view-height");

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var map = new google.maps.Map(document.getElementById('city-map'),{
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
});