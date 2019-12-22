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

	svc.login = function(username, password){
		return $http.post('/api/sessions', {
			username: username,
			password: password
		}).then(function(val){
			$http.defaults.headers.common['X-Auth'] = val.data;
			return svc.getUser();
		});
	}

	svc.logout = function(){
		$http.defaults.headers.common['X-Auth'] = '';
	};
	
	svc.createUser = function(username, password){
		return $http.post('/api/users', {
			username: username,
			password: password
		}).then(function(val){
			console.log(val);
			return svc.login(username, password);
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
	$scope.login = function(username, password){
		UserSvc.login(username, password)
			.then(function(response){ 
				$scope.$emit('login', response.data); 
			})
	}
}]);
angular.module('app')
.controller('RegisterCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.register = function(username, password){
		UserSvc.createUser(username, password)
			.then(function(response){ 
				$scope.$emit('login', response.data); 
			})
	}
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsInVzZXIuc3ZjLmpzIiwiY29udHJvbGxlcnMvYXBwbGljYXRpb24uY3RybC5qcyIsImNvbnRyb2xsZXJzL2xvZ2luLmN0cmwuanMiLCJjb250cm9sbGVycy9yZWdpc3Rlci5jdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBOztBQ0RBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxhQUFBLEVBQUEsWUFBQSxnQkFBQSxhQUFBO0VBQ0EsS0FBQSxVQUFBLEVBQUEsWUFBQSxhQUFBLGFBQUE7O0FDSkEsUUFBQSxPQUFBO0NBQ0EsUUFBQSxxQkFBQSxTQUFBLE1BQUE7Q0FDQSxJQUFBLE1BQUE7O0NBRUEsSUFBQSxVQUFBLFVBQUE7RUFDQSxPQUFBLE1BQUEsSUFBQTs7O0NBR0EsSUFBQSxRQUFBLFNBQUEsVUFBQSxTQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsaUJBQUE7R0FDQSxVQUFBO0dBQ0EsVUFBQTtLQUNBLEtBQUEsU0FBQSxJQUFBO0dBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLElBQUE7R0FDQSxPQUFBLElBQUE7Ozs7Q0FJQSxJQUFBLFNBQUEsVUFBQTtFQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQTs7O0NBR0EsSUFBQSxhQUFBLFNBQUEsVUFBQSxTQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtHQUNBLFVBQUE7R0FDQSxVQUFBO0tBQ0EsS0FBQSxTQUFBLElBQUE7R0FDQSxRQUFBLElBQUE7R0FDQSxPQUFBLElBQUEsTUFBQSxVQUFBOzs7OztBQzVCQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxRQUFBO0NBQ0EsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLEtBQUE7RUFDQSxPQUFBLGNBQUE7OztDQUdBLE9BQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsUUFBQTs7O0FDUkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxtQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsUUFBQSxTQUFBLFVBQUEsU0FBQTtFQUNBLFFBQUEsTUFBQSxVQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7O0FDTEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsV0FBQSxTQUFBLFVBQUEsU0FBQTtFQUNBLFFBQUEsV0FBQSxVQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7SUFHQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcblx0XHQnbmdSb3V0ZSdcblx0XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcblx0JHJvdXRlUHJvdmlkZXJcblx0LndoZW4oJy9yZWdpc3RlcicsIHsgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCd9KVxuXHQud2hlbignL2xvZ2luJywgeyBjb250cm9sbGVyOiAnTG9naW5DdHJsJywgdGVtcGxhdGVVcmw6ICdsb2dpbi5odG1sJ30pXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHApe1xuXHRsZXQgc3ZjID0gdGhpcztcblx0XG5cdHN2Yy5nZXRVc2VyID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJylcblx0fVxuXG5cdHN2Yy5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2Vzc2lvbnMnLCB7XG5cdFx0XHR1c2VybmFtZTogdXNlcm5hbWUsXG5cdFx0XHRwYXNzd29yZDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSB2YWwuZGF0YTtcblx0XHRcdHJldHVybiBzdmMuZ2V0VXNlcigpO1xuXHRcdH0pO1xuXHR9XG5cblx0c3ZjLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gJyc7XG5cdH07XG5cdFxuXHRzdmMuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnMnLCB7XG5cdFx0XHR1c2VybmFtZTogdXNlcm5hbWUsXG5cdFx0XHRwYXNzd29yZDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHRjb25zb2xlLmxvZyh2YWwpO1xuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcil7XG5cdFx0JHNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcblx0fSk7XG5cdFxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuXHRcdFVzZXJTdmMubG9nb3V0KCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMpe1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyBcblx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pXG5cdH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5jcmVhdGVVc2VyKHVzZXJuYW1lLCBwYXNzd29yZClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgXG5cdFx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTsgXG5cdFx0XHR9KVxuXHR9XG59KTsiXX0=
