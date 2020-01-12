angular.module('app')
.controller('ListUsersCtrl', function ($scope, ListUsersSvc) {
  
    ListUsersSvc.fetch().success(function(data) {
        $scope.data = data;
        console.log(data);
    });
    
    $scope.editAsAdmin = function(User) {
		staticObj.user = User;
		staticObj.oldUser = Object.assign({}, User);
		window.location.assign("/#/editdata");
	}
});