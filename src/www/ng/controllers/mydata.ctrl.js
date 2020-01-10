angular.module('app')
.controller('MyDataCtrl', function ($scope, MyDataSvc) {
	MyDataSvc.fetch().success(function(data) {
		$scope.data = data;
	});
});