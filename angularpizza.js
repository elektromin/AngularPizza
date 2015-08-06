angular.module('angularPizza', ['ngRoute'])

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

    .controller('RestaurantController', function($http) {
        var restaurants = this;
        restaurants.model = [];

        restaurants.getRestaurantsFromServer = function() {
            $http.get('http://private-b988d-pizzaapp.apiary-mock.com/restaurants')
                .then(function(success) {
                    restaurants.model = success.data;
                }, function(error) {
                    alert("fail: " + error);
                });
        };

        restaurants.getRestaurantsFromServer();
    });