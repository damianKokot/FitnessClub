let app = angular.module('app', [
		'ngRoute'
	]);
angular.module('app')
.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html'})
	.when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
}]);
angular.module('app')
.service('UserSvc', ["$http", function($http){
	let svc = this;
	
	svc.getUser = function(){
		return $http.get('/api/users')
	}

	svc.login = function(email, password){
		return $http.post('/api/sessions', {
			email: email,
			password: password
		}).then(function(val){
			$http.defaults.headers.common['X-Auth'] = val.data;
			return svc.getUser();
		});
	}

	svc.logout = function(){
		$http.defaults.headers.common['X-Auth'] = '';
	};
	
	svc.createUser = function(User){
		return $http.post('/api/users', User)
		.then(function(){
			return svc.login(User.email, User.password);
		});
	}
}]);

angular.module('app')
.controller('ApplicationCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.$on('login', function(_, user){
		$scope.currentUser = user;
	});
	
	$scope.logout = function(){
		$scope.currentUser = null;
		UserSvc.logout();
	};
}]);
angular.module('app')
.controller('LoginCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
			.then(function(response){ 
				$scope.$emit('login', response.data); 
			})
	}
}]);
angular.module('app')
.controller('RegisterCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
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
}]);


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsInVzZXIuc3ZjLmpzIiwiY29udHJvbGxlcnMvYXBwbGljYXRpb24uY3RybC5qcyIsImNvbnRyb2xsZXJzL2xvZ2luLmN0cmwuanMiLCJjb250cm9sbGVycy9yZWdpc3Rlci5jdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBOztBQ0RBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxhQUFBLEVBQUEsWUFBQSxnQkFBQSxhQUFBO0VBQ0EsS0FBQSxVQUFBLEVBQUEsWUFBQSxhQUFBLGFBQUE7O0FDSkEsUUFBQSxPQUFBO0NBQ0EsUUFBQSxxQkFBQSxTQUFBLE1BQUE7Q0FDQSxJQUFBLE1BQUE7O0NBRUEsSUFBQSxVQUFBLFVBQUE7RUFDQSxPQUFBLE1BQUEsSUFBQTs7O0NBR0EsSUFBQSxRQUFBLFNBQUEsT0FBQSxTQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsaUJBQUE7R0FDQSxPQUFBO0dBQ0EsVUFBQTtLQUNBLEtBQUEsU0FBQSxJQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLElBQUE7R0FDQSxPQUFBLElBQUE7Ozs7Q0FJQSxJQUFBLFNBQUEsVUFBQTtFQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQTs7O0NBR0EsSUFBQSxhQUFBLFNBQUEsS0FBQTtFQUNBLE9BQUEsTUFBQSxLQUFBLGNBQUE7R0FDQSxLQUFBLFVBQUE7R0FDQSxPQUFBLElBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7QUN6QkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsSUFBQSxTQUFBLFNBQUEsR0FBQSxLQUFBO0VBQ0EsT0FBQSxjQUFBOzs7Q0FHQSxPQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLFFBQUE7OztBQ1JBLFFBQUEsT0FBQTtDQUNBLFdBQUEsbUNBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxRQUFBLE1BQUEsT0FBQTtJQUNBLEtBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7OztBQ0xBLFFBQUEsT0FBQTtDQUNBLFdBQUEsc0NBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLFdBQUEsVUFBQSxXQUFBLFVBQUEsT0FBQSxXQUFBLFVBQUEsZ0JBQUE7RUFDQSxRQUFBLElBQUE7RUFDQSxRQUFBLElBQUE7RUFDQSxRQUFBLElBQUE7RUFDQSxRQUFBLElBQUE7RUFDQSxRQUFBLElBQUE7RUFDQSxRQUFBLElBQUE7O0VBRUEsR0FBQSxhQUFBLGlCQUFBO0dBQ0EsUUFBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBLEtBQUEsU0FBQSxTQUFBO0tBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTs7O0dBR0EsU0FBQSxpQkFBQSxTQUFBLEdBQUEsa0JBQUE7U0FDQTtHQUNBLFNBQUEsaUJBQUEsU0FBQSxHQUFBLGtCQUFBOzs7OztBQUtBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuXHRcdCduZ1JvdXRlJ1xuXHRdKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuXHQkcm91dGVQcm92aWRlclxuXHQud2hlbignL3JlZ2lzdGVyJywgeyBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJywgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJ30pXG5cdC53aGVuKCcvbG9naW4nLCB7IGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLCB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnfSlcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCl7XG5cdGxldCBzdmMgPSB0aGlzO1xuXHRcblx0c3ZjLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcnMnKVxuXHR9XG5cblx0c3ZjLmxvZ2luID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcblx0XHRcdGVtYWlsOiBlbWFpbCxcblx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUF1dGgnXSA9IHZhbC5kYXRhO1xuXHRcdFx0cmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzdmMubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSAnJztcblx0fTtcblx0XG5cdHN2Yy5jcmVhdGVVc2VyID0gZnVuY3Rpb24oVXNlcil7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnMnLCBVc2VyKVxuXHRcdC50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gc3ZjLmxvZ2luKFVzZXIuZW1haWwsIFVzZXIucGFzc3dvcmQpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcil7XG5cdFx0JHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcblx0fSk7XG5cdFxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuXHRcdFVzZXJTdmMubG9nb3V0KCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMpe1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMubG9naW4oZW1haWwsIHBhc3N3b3JkKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyBcblx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pXG5cdH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChmaXJzdG5hbWUsIGxhc3RuYW1lLCBlbWFpbCwgdGVsZXBob25lLCBwYXNzd29yZCwgcmVwZWF0X3Bhc3N3b3JkKXtcblx0XHRjb25zb2xlLmxvZyhmaXJzdG5hbWUpO1xuXHRcdGNvbnNvbGUubG9nKGxhc3RuYW1lKTtcblx0XHRjb25zb2xlLmxvZyhlbWFpbCk7XG5cdFx0Y29uc29sZS5sb2codGVsZXBob25lKTtcblx0XHRjb25zb2xlLmxvZyhwYXNzd29yZCk7XG5cdFx0Y29uc29sZS5sb2cocmVwZWF0X3Bhc3N3b3JkKTtcblx0XHRcblx0XHRpZihwYXNzd29yZCA9PT0gcmVwZWF0X3Bhc3N3b3JkKSB7XG5cdFx0XHRVc2VyU3ZjLmNyZWF0ZVVzZXIoe1xuXHRcdFx0XHRmaXJzdG5hbWUsXG5cdFx0XHRcdGxhc3RuYW1lLFxuXHRcdFx0XHRlbWFpbCxcblx0XHRcdFx0dGVsZXBob25lLFxuXHRcdFx0XHRwYXNzd29yZFxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7IFxuXHRcdFx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTsgXG5cdFx0XHRcdH0pXG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdLnNldEN1c3RvbVZhbGlkaXR5KFwiUGFzc3dvcmRzIERvbid0IE1hdGNoXCIpO1xuXHRcdH1cblx0fVxufSk7XG5cbiJdfQ==
