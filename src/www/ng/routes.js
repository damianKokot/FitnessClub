angular.module('app')
.config(function($routeProvider){
	$routeProvider
	.when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html'})
	.when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
	.when('/classes', { controller: 'ClassesCtrl', templateUrl: './classes/classes.html'})
	.when('/classes/edit', { controller: 'ClassesCtrl', templateUrl: './classes/classesEdit.html'})
	.when('/classes/showSpecial', { controller: 'SpecialClassesCtrl', templateUrl: './classes/showSpecial.html'})
	.when('/classes/editSpecial', { controller: 'SpecialClassesEditCtrl', templateUrl: './classes/editSpecial.html'})
	.when('/myinfo', { controller: 'MyDataCtrl', templateUrl: './users/myinfo.html'})
	.when('/editdata', { controller: 'EditDataCtrl', templateUrl: './users/editdata.html'})
});