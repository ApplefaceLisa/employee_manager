app.controller("reportsController", ["$scope", "$routeParams", "$location", "$window", "emsService", function($scope, $routeParams, $location, $window, emsService) {
    var id = Number($routeParams.id);
    console.log("reports.html employeeId is " + id);

    $scope.dataReady = false;
    emsService.getReports(id)
    .then(function(res) {
        console.log(res.data);
        $scope.reports = res.data;
        $scope.dataReady = true;
    }, function(res) {
        console.log("Get reports failed");
    });

    $scope.back = function($event) {
        $event.preventDefault();
        $location.path("/details/" + id);
    };
}]);