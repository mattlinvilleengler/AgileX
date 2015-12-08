'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'ngRoute',
    'myApp.controllers',
    'ngAnimate'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/storyMaker', {templateUrl: 'views/storyMaker.html', controller: 'StoryMakerCtrl'});
        $routeProvider.when('/projectDev', {templateUrl: 'views/projectDev.html', controller: 'ProjectDevCtrl'});
        $routeProvider.when('/storys', {templateUrl: 'views/storys.html', controller: 'StorysCtrl'});
        $routeProvider.when('/globalstorys', {templateUrl: 'views/globalstorys.html', controller: 'GlobalStorysCtrl'});  
        $routeProvider.when('/dashboard', {templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl'});  
        $routeProvider.when('/register', {templateUrl: 'views/register.html', controller: 'RegisterCtrl'}); 
        $routeProvider.when('/company', {templateUrl: 'views/company.html', controller: 'CompanyCtrl'}); 
        $routeProvider.when('/analytics', {templateUrl: 'views/analytics.html', controller: 'AnalyticsCtrl'}); 
        $routeProvider.when('/codeShare', {templateUrl: 'views/codeShare.html', controller: 'CodeShareCtrl'}); 
        $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: 'LoginCtrl'});
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);


