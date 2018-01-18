app.controller("detailsController", ["$scope", "$routeParams", "$location", "emsService", function($scope, $routeParams, $location, emsService) {
  var id = Number($routeParams.id);
  console.log("edit.html employeeId is "+id);
/*
  $scope.employee = {
    "id": 2,
    "manager_id": 1,
    "name": "John",
    "title": "GM",
    "gender": "male",
    "startDate": new Date(2018, 1, 10),
    "phone": null,
    "cell": null,
    "sms": null,
    "email": null,
    "imageUrl": "",
    "manager_name": "Mary",
    "reports": 2
  };
*/

  $scope.dataReady = false;
  emsService.getById(id)
  .then(function(res) {
    $scope.employee = res.data;
    $scope.employee.imageUrl = $scope.employee.imageUrl || "image/default.png";
    $scope.dataReady = true;
  }, function(res) {
    console.log("Get employee details failed");
  });
}]);