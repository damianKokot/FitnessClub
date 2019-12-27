angular.module('app')
.controller('ClassesCtrl', function ($scope, ClassesSvc) {
	$scope.save = function (name, description, duration) {
		ClassesSvc.create({
			name, description, duration
		}).success(() => {
			window.location.assign("/#/classes");
		});
	};
	
	ClassesSvc.fetch().success(function(classes) {
		$scope.classes = classes;
	});
});