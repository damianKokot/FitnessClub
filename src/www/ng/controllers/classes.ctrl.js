angular.module('app')
.controller('ClassesCtrl', function ($scope, ClassesSvc) {
	ClassesSvc.fetch()
	.success(function(classes) {
		$scope.classes = classes;
	});

	$scope.showSpecial = function(name) {
		$scope.className = name;
		window.location.assign("/#/classes/showSpecial");
	}

	$scope.save = function (name, description, duration) {
		ClassesSvc.create({
			name, description, duration
		}).success(() => {
			window.location.assign("/#/classes");
		});
	};
});
