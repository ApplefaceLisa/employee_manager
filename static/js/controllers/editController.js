app.controller("editController", ["$scope", "$routeParams", "$location", "$filter", "emsService", "fileUpload", function($scope, $routeParams, $location, $filter, emsService, fileUpload) {
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
  $scope.hasloop = false;

  const id = Number($routeParams.id);
  emsService.getById(id)
  .then(function(res) {
    console.log(res.data);
    $scope.employee.name = res.data.name;
    $scope.employee.title = res.data.title;
    $scope.employee.gender = res.data.gender;
    $scope.employee.phone = res.data.phone;
    $scope.employee.cell = res.data.cell;
    $scope.employee.sms = res.data.sms;
    $scope.employee.email = res.data.email;
    $scope.employee.imageUrl = res.data.imageUrl || "image/default.png";
    $scope.employee.manager_id = res.data.manager_id;
    $scope.employee.startDate = res.data.startDate;
    $scope.startDate = res.data.startDate ? new Date(res.data.startDate) : new Date();
  }, function(res) {
    $window.alert("User Not Found");
    $location.path("/");
  });

  $scope.managers = [{id : null, name : "none"}];
  getManagers();

  function getManagers() {
    emsService.getManagers()
    .then(function(res) {
      $scope.managers = $scope.managers.concat(res.data);
      console.log(res.data);
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
    loopDetect(id, $scope.employee.manager_id);
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

  function loopDetect(id, manager_id) {
    if (manager_id) {
      if (manager_id === id)  {
        $scope.hasloop = true;
        return;
      }
      emsService.getById(manager_id).then(function(res) {
        return loopDetect(id, res.data.manager_id);
      });
    } else {
      $scope.hasloop = false;
      emsService.update(id, $scope.employee)
      .then(function(res) {
          $location.path("/");
      }, function(res) {
          $window.alert("User Not Found");
          $location.path("/");
      });
    }
  }
}]);