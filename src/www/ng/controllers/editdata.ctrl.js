angular.module('app')
.controller('EditDataCtrl', function ($scope, EditDataSvc) {
	EditDataSvc.fetch().success(function(data) {
		 $scope.data = data;
  });

	$scope.save = function (firstname, lastname, email, telephone) {
		EditDataSvc.update({
			firstname, lastname, email, telephone
		}).then((response) => {
			$scope.$emit('login', response.data);
			window.location.assign("/#/myinfo");
		});
    };  
});