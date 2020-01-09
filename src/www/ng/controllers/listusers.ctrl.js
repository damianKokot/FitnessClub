angular.module('app')
.controller('ListUsersCtrl', function ($scope, ListUsersSvc) {
    $scope.delete = function (email) {
	
    };

    $scope.edit = function (firstname, lastname, email, telephone) {
		
    };
    
    ListUsersSvc.fetch().success(function(data) {
        $scope.data = data;
        console.log(data);
	});
});