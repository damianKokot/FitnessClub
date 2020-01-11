angular.module('app')
.controller('LoginCtrl', function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
		.then(function(response){ 
			$scope.$emit('login', response.data); 
			staticObj.name = response.data.firstname + " " + response.data.lastname;
		}).then(function() {
			window.location.assign('/#/');
		});
	}
});