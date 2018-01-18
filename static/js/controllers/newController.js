app.controller("newController", ["$scope", "$location", "$filter", "emsService", "fileUpload", function($scope, $location, $filter, emsService, fileUpload) {
  $scope.employee = {
    "manager_id": null,
    "name": "",
    "title": "",
    "gender": "",
    "startDate": "",
    "phone": "",
    "cell": "",
    "sms": "",
    "email": "",
    "imageUrl": "image/default.png"
  };
  $scope.startDate = new Date();

  $scope.managers = [{id : null, name : "none"}];
  getManagers();

  function getManagers() {
    emsService.getManagers()
    .then(function(res) {
      $scope.managers = $scope.managers.concat(res.data);
    }, function(res) {
      console.log("Get managers error");
    });
  }

  $scope.uploadFile = function(){
      var file = $scope.imgFile;
      var uploadUrl = "/saveimage";
      fileUpload.uploadFileToUrl(file, uploadUrl)
      .then(function(res){
          console.log("angular file upload success");
          $scope.employee.imageUrl = "uploads/" + res.data.filename;
      }, function(err){
          console.log(err);
      });
  };

/*
  $scope.passw1 = "";
  $scope.passw2 = "";
  $scope.error = false;
  $scope.incomplete = true;

  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('user.fName', function() {$scope.test();});
  $scope.$watch('user.lName', function() {$scope.test();});
  $scope.$watch('user.age', function() {$scope.test();});

  $scope.test = function() {
    if ($scope.passw1 && $scope.passw2 && $scope.passw1 !== $scope.passw2) {
      $scope.error = true;
    } else {
      $scope.error = false;
    }
    $scope.incomplete = true;
    if ($scope.user.fName && $scope.user.lName && $scope.user.age &&
        $scope.passw1 && $scope.passw2) {
        $scope.incomplete = false;
    }
  };
*/
  $scope.save = function($event) {
    $event.preventDefault();
    $scope.employee.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
    handlePhoneNumber();
    console.log($scope.employee);
    emsService.create($scope.employee)
    .then(function(res) {
      $location.path("/");
    });
  };

  $scope.cancel = function($event) {
    $event.preventDefault();
    $location.path("/");
  };

  function handlePhoneNumber() {
    $scope.employee.phone = getNumFromStr($scope.employee.phone);
    $scope.employee.cell = getNumFromStr($scope.employee.cell);
    $scope.employee.sms = getNumFromStr($scope.employee.sms);
  }

  function getNumFromStr(str) {
    if (!str)    return "";
    return str.match(/\d/g).join("");
  }
}]);