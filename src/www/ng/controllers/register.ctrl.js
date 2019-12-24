angular.module('app')
.controller('RegisterCtrl', function($scope, UserSvc){
	$scope.register = function (firstname, lastname, email, telephone, password, repeat_password){
		console.log(firstname);
		console.log(lastname);
		console.log(email);
		console.log(telephone);
		console.log(password);
		console.log(repeat_password);
		
		if(password === repeat_password) {
			UserSvc.createUser({
				firstname,
				lastname,
				email,
				telephone,
				password
			}).then(function(response){ 
					$scope.$emit('login', response.data); 
				})

			document.querySelectorAll("input")[5].setCustomValidity("");
		} else {
			document.querySelectorAll("input")[5].setCustomValidity("Passwords Don't Match");
		}
	}
});

