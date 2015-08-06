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
                    if (distance < 0 || distance > d2) {
                        closest = rest;
                        distance = d2;
                    }
                });

                restaurants.closestRestaurant = closest;
            });

        };

        restaurants.distanceToRestaurant = function(myPosition, restaurant) {
            var a = myPosition.coords.latitude - restaurant.latitude;
            var b = myPosition.coords.longitude - restaurant.longitude;
            var c = Math.sqrt(a * a + b * b);
            return c;
        };

        restaurants.getClosestRestaurant();
    });