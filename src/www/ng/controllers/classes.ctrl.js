angular.module('app')
.controller('ClassesCtrl', function ($scope, ClassesSvc) {
	ClassesSvc.fetch()
	.success(function(classes) {
		$scope.classes = classes;
	});
	$scope.class = staticObj.class;
	
	$scope.showSpecial = function(name) {
		staticObj.className = name;
		staticObj.classId = $scope.classes.find(item => item.name === name).id;
		window.location.assign("/#/classes/showSpecial");
	}
	
	$scope.edit = function(Class) {
		staticObj.class = Class;
		staticObj.oldClass = Object.assign({}, Class);
		window.location.assign("/#/classes/edit");
	}

	$scope.save = function (name, description, duration) {
		if (JSON.stringify(staticObj.oldClass) !== '{}') {
			if (JSON.stringify(staticObj.oldClass) !== JSON.stringify($scope.class)) {
				ClassesSvc.update({
					name, description, duration, 
					oldName: staticObj.oldClass.name
				})
			}
			staticObj.oldClass = {};
			window.location.assign("/#/classes");
		} else {
			ClassesSvc.create({
				name, description, duration
			}).success(() => {
				window.location.assign("/#/classes");
			});
		}
	};
});
