angular.module('app')
.controller('ApplicationCtrl', function($scope, UserSvc){
	$scope.$on('login', function(_, user){
		user.name = user.firstname + " " + user.lastname;
		$scope.currentUser = user;
	});
	
	$scope.logout = function(){
		$scope.currentUser = null;
		UserSvc.logout()
		window.location.assign('/#/');
	};
});