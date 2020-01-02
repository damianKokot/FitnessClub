angular.module('app')
.controller('ClassesCtrl', function ($scope, ClassesSvc) {
	ClassesSvc.fetch()
	.success(function(classes) {
		$scope.classes = classes;
	});
	const oldClass = window.class;
	$scope.class = Object.assign({}, window.class);
	delete window.class;
	
	$scope.showSpecial = function(name) {
		window.className = name;
		window.location.assign("/#/classes/showSpecial");
	}
	
	$scope.edit = function(Class) {
		window.class = Class;
		window.location.assign("/#/classes/edit");
	}

	$scope.save = function (name, description, duration) {
		if (oldClass) {
			if(JSON.stringify(oldClass) !== JSON.stringify($scope.class)) {
				ClassesSvc.update({
					name, 
					description, 
					duration, 
					oldName: oldClass.name
				})
			}
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
