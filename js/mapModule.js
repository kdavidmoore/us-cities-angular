var mapApp = angular.module('mapApp', ['ngAnimate', 'ngRoute', 'ngAria', 'ngMaterial']);

mapApp.factory('cityService', function(){
	var selectedCity = {};
	var masterMap;
	function set(map) {
		masterMap = map;
	}

	function get() {
		if (typeof(masterMap) === "undefined"){
			return "noMap";
		} else {
			return masterMap;
		}
	}

	return {
		set: set,
		get: get
	}

});

mapApp.run(function($rootScope, $location){
	$rootScope.$watch(function(){
		return $location.path();
	},
	function(a){
		if (a !== '/'){
			console.log('url has changed: ' + a);
		}
	});
});

mapApp.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'pages/front.html',
		controller: 'mapController'
	});
	$routeProvider.when('/city/:cityIndex',{
		templateUrl: 'pages/city.html',
		controller: 'cityController'
	});
	// send the user back to the home page if the route is not valid
	$routeProvider.otherwise({
		redirectTo: '/'
	});
});