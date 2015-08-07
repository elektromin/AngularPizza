angular.module('angularPizza', ['ngRoute', 'ngGeolocation'])

    .config(function($routeProvider) {
        $routeProvider.when('/', {
            controller: 'MenuController as menu',
            templateUrl: 'menu.html'
        }).when('/menu', {
            controller: 'MenuController as menu',
            templateUrl: 'menu.html'
        }).when('/restaurants', {
            controller: 'RestaurantController as restaurants',
            templateUrl: 'restaurants.html'
        })
    })

    .controller('MenuController', function($http) {
        var menu = this;
        menu.model = [];

        menu.getMenuFromServer = function() {
            $http.get('http://private-b988d-pizzaapp.apiary-mock.com/restaurant/restaurantId/menu')
                .then(function(success) {
                    menu.model = success.data;
                }, function(error) {
                    alert("fail: " + error);
                });
        };

        menu.getMenuFromServer();

        menu.byCategory = function($category) {
            var items = [];
            angular.forEach(this.model, function(item) {
                if ($category == item.category)
                    items.push(item);
            });
            return items;
        };

        menu.categories = function() {
            var cats = [];
            angular.forEach(this.model, function(item) {
                if (cats.indexOf(item.category) < 0) {
                    cats.push(item.category);
                }
            });
            return cats;
        };

    })

    .controller('RestaurantController', function($http, $geolocation) {
        var restaurants = this;
        restaurants.model = [];
        restaurants.closestRestaurant = null;

        restaurants.getRestaurantsFromServer = function() {
            $http.get('http://private-b988d-pizzaapp.apiary-mock.com/restaurants')
                .then(function(success) {
                    restaurants.model = success.data;
                }, function(error) {
                    alert("fail: " + error);
                });
        };

        restaurants.getRestaurantsFromServer();

        restaurants.getClosestRestaurant = function() {
            $geolocation.getCurrentPosition({
                timeout: 60000
            }).then(function(position) {
                myPosition = position;

                var closest = null;
                var distance = -1;
                angular.forEach(restaurants.model, function (rest) {
                    var d2 = restaurants.distanceToRestaurant(myPosition, rest);
                    rest.distance = Math.round(d2 * 1000);
                    if (distance < 0 || distance > d2) {
                        closest = rest;
                        distance = d2;
                    }
                });

                restaurants.closestRestaurant = closest;
            });

        };

        restaurants.distanceToRestaurant = function(myPosition, restaurant) {
            return distance(myPosition.coords.longitude, myPosition.coords.latitude, restaurant.longitude, restaurant.latitude);
        };

        /// code taken from http://stackoverflow.com/questions/13840516/how-to-find-my-distance-to-a-known-location-in-javascript
        function distance(lon1, lat1, lon2, lat2) {
            var R = 6371; // Radius of the earth in km
            var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
            var dLon = (lon2-lon1).toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            return d;
        }

        /** Converts numeric degrees to radians */
        if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
        }

        restaurants.getClosestRestaurant();
    });