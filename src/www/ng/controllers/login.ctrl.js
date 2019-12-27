angular.module('app')
.controller('LoginCtrl', function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
			.then(function(response){ 
				$scope.$emit('login', response.data); 
			})
	}
});