angular.module('app')
.controller('LoginCtrl', function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
		.then(function(response){ 
			$scope.$emit('login', response.data); 
		}).then(function() {
			window.location.assign('/#/');
		});
	}
	$scope.login("kokocik1213@gmail.com", "1234");
	//$scope.login("emil@gmail.com", "1234");
});