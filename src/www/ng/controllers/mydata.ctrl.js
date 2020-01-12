angular.module('app')
.controller('MyDataCtrl', function ($scope, MyDataSvc) {
	MyDataSvc.fetch().success(function(data) {
		$scope.data = data;
	});

	$scope.edit = function (User) {
		staticObj.user = User;
		staticObj.oldUser = Object.assign({}, User);
		window.location.assign("/#/editdata");
	} 
});