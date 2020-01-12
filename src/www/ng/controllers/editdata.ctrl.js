angular.module('app')
.controller('EditDataCtrl', function ($scope, EditDataSvc) {
	$scope.save = function (firstname, lastname, email, telephone, permissions, description) {
		EditDataSvc.update({
			firstname, 
			lastname, 
			email, 
			telephone, 
			permissions,
			description,
			oldEmail: staticObj.user.email
		})
    };
    
	EditDataSvc.getUser(staticObj.user.email)
	.then(function(res) {
		console.log(res.data)
		$scope.data = res.data;
	});
});