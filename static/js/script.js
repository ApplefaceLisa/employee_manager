var app = angular.module("emsApp", ["ngRoute", "customServices"]);

app.config(['$routeProvider', '$compileProvider' , function($routeProvider, $compileProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "views/list.html",
        controller: "listController"
    })
    .when("/new", {
        templateUrl: "views/new.html",
        controller: "newController"
    })
    .when("/edit/:id", {
        templateUrl: "views/edit.html",
        controller: "editController"
    })
    .when("/details/:id", {
        templateUrl: "views/details.html",
        controller: "detailsController"
    })
    .when("/reports/:id", {
        templateUrl: "views/reports.html",
        controller: "reportsController"
    })
    .otherwise({redirectTo: "/"});

    // Avoid Angular.js from adding "unsafe" tag in ng-href
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
}]);

app.controller("emsCtrl", function($scope) {});