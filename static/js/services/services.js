angular.module("customServices", [])
.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
}])
.factory("emsService", ["$http", function($http) {
    var service = {};
    const e_url = "/employees";

    /************************************************/
    /* RESTful API */
    service.getAll = function() {
        return $http({
            method : "GET",
            url : e_url
        });
    };

    service.getById = function(id) {
        let url = e_url + "/" + id;
        return $http({
            method : "GET",
            url : url
        });
    };

    service.update = function(id, obj) {
        let url = e_url + "/" + id;
        return $http({
            method : "PUT",
            url : url,
            data : obj
        });
    };

    service.create = function(obj) {
        return $http({
            method : "POST",
            url : e_url,
            data : obj
        });
    };

    service.delete = function(id) {
        let url = e_url + "/" + id;
        return $http({
            method : "DELETE",
            url : url
        });
    };

    service.getManagers = function() {
        let url = e_url + "/" + "managers";
        return $http({
            method : "GET",
            url : url
        });
    };

    service.getReports = function(id) {
        let url = e_url + "/reports/" + id;
        return $http({
            method : "GET",
            url : url
        });
    };
    /************************************************/
    /*
    service.orderBy = function(name, order) {
        let url = e_url + "/sort";
        return $http({
            method : "GET",
            url : url,
            params : {orderBy: name, order: order}
        });
    }

    service.search = function(searchby, key) {
        let url = e_url + "/search";
        return $http({
            method : "GET",
            url : url,
            params : {searchby : searchby, key : key}
        });
    }
    */
    return service;
}]);