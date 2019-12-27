angular.module('app')
.controller('MyDataCtrl', function ($scope, MyDataSvc) {
	$scope.save = function (name, description, duration) {
		MyDataSvc.create({
			name, description, duration
		}).success(() => {
			window.location.assign("/#/mydata");
		});
	};
	
	MyDataSvc.fetch().success(function(data) {
		$scope.data = data;
	});
});