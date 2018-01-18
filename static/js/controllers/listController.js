app.controller("listController", ["$scope", "$q", "$route", "$location", "$window", "emsService", function($scope, $q, $route, $location, $window, emsService) {
    $scope.dataReady = false;
    $scope.employees = [];
    getAll();

    function getAll() {
        emsService.getAll()
        .then(function(response) {
            $scope.employees = response.data;
            $scope.dataReady = true;
        });
    }

    $scope.create = function($event) {
        $event.preventDefault();
        $location.path("/new");
    };

    $scope.edit = function($event, id) {
        $event.preventDefault();
        var url = "/edit/" + id;
        $location.path(url);
    };

    $scope.delete = function($event, id) {
        $event.preventDefault();
        emsService.getReports(id)
        .then(function(res) {
            console.log(res.data);
            var promises = res.data.map(function(employee) {
                let ep = {
                    manager_id : null,
                    name : employee.name,
                    title : employee.title,
                    gender : employee.gender,
                    startDate : employee.startDate,
                    phone : employee.phone,
                    cell : employee.cell,
                    sms : employee.sms,
                    email : employee.email,
                    imageUrl : employee.imageUrl
                };
                return emsService.update(employee.id, ep);
            });
            promises.push(emsService.delete(id));
            $q.all(promises).then(function(res) {
                console.log("delete user completed");
                $route.reload();
            });
        });
    };
}]);