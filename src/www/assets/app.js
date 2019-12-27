let app = angular.module('app', [
		'ngRoute'
	]);
angular.module('app')
.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html'})
	.when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
	.when('/classes', { controller: 'ClassesCtrl', templateUrl: './classes/classes.html'})
	.when('/classes/edit', { controller: 'ClassesCtrl', templateUrl: './classes/classesEdit.html'})
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
.controller('ClassesCtrl', ["$scope", "ClassesSvc", function ($scope, ClassesSvc) {
	$scope.save = function (name, description, duration) {
		ClassesSvc.create({
			name, description, duration
		}).success(() => {
			window.location.assign("/#/classes");
		});
	};
	
	ClassesSvc.fetch().success(function(classes) {
		$scope.classes = classes;
	});
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


angular.module('app')
.service('ClassesSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/classes');
   }
   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2FwcGxpY2F0aW9uLmN0cmwuanMiLCJjb250cm9sbGVycy9jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbi5jdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXIuY3RybC5qcyIsInNlcnZpY2VzL2NsYXNzZXMuc3ZjLmpzIiwic2VydmljZXMvdXNlci5zdmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7O0FDREEsUUFBQSxPQUFBO0NBQ0EsMEJBQUEsU0FBQSxlQUFBO0NBQ0E7RUFDQSxLQUFBLGFBQUEsRUFBQSxZQUFBLGdCQUFBLGFBQUE7RUFDQSxLQUFBLFVBQUEsRUFBQSxZQUFBLGFBQUEsYUFBQTtFQUNBLEtBQUEsWUFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBO0VBQ0EsS0FBQSxpQkFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBOztBQ05BLFFBQUEsT0FBQTtDQUNBLFdBQUEseUNBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLElBQUEsU0FBQSxTQUFBLEdBQUEsS0FBQTtFQUNBLE9BQUEsY0FBQTs7O0NBR0EsT0FBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxRQUFBOzs7QUNSQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHdDQUFBLFVBQUEsUUFBQSxZQUFBO0NBQ0EsT0FBQSxPQUFBLFVBQUEsTUFBQSxhQUFBLFVBQUE7RUFDQSxXQUFBLE9BQUE7R0FDQSxNQUFBLGFBQUE7S0FDQSxRQUFBOzs7OztDQUtBLFdBQUEsUUFBQSxRQUFBLFNBQUEsU0FBQTtFQUNBLE9BQUEsVUFBQTs7O0FDWEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxtQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsUUFBQSxTQUFBLE9BQUEsU0FBQTtFQUNBLFFBQUEsTUFBQSxPQUFBO0lBQ0EsS0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7O0FDTEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsV0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUEsVUFBQSxnQkFBQTs7RUFFQSxHQUFBLGFBQUEsaUJBQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0EsS0FBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBOzs7R0FHQSxTQUFBLGlCQUFBLFNBQUEsR0FBQSxrQkFBQTtTQUNBO0dBQ0EsU0FBQSxpQkFBQSxTQUFBLEdBQUEsa0JBQUE7Ozs7OztBQ2pCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHdCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxZQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7O0dBRUEsS0FBQSxTQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLGdCQUFBOzs7QUNOQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHFCQUFBLFNBQUEsTUFBQTtDQUNBLElBQUEsTUFBQTs7Q0FFQSxJQUFBLFVBQUEsVUFBQTtFQUNBLE9BQUEsTUFBQSxJQUFBOzs7Q0FHQSxJQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtHQUNBLE9BQUE7R0FDQSxVQUFBO0tBQ0EsS0FBQSxTQUFBLElBQUE7R0FDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsSUFBQTtHQUNBLE9BQUEsSUFBQTs7OztDQUlBLElBQUEsU0FBQSxVQUFBO0VBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7Q0FHQSxJQUFBLGFBQUEsU0FBQSxLQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtHQUNBLEtBQUEsVUFBQTtHQUNBLE9BQUEsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG5cdFx0J25nUm91dGUnXG5cdF0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XG5cdCRyb3V0ZVByb3ZpZGVyXG5cdC53aGVuKCcvcmVnaXN0ZXInLCB7IGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnLCB0ZW1wbGF0ZVVybDogJ3JlZ2lzdGVyLmh0bWwnfSlcblx0LndoZW4oJy9sb2dpbicsIHsgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsIHRlbXBsYXRlVXJsOiAnbG9naW4uaHRtbCd9KVxuXHQud2hlbignL2NsYXNzZXMnLCB7IGNvbnRyb2xsZXI6ICdDbGFzc2VzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL2NsYXNzZXMuaHRtbCd9KVxuXHQud2hlbignL2NsYXNzZXMvZWRpdCcsIHsgY29udHJvbGxlcjogJ0NsYXNzZXNDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvY2xhc3Nlc0VkaXQuaHRtbCd9KVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuXHR9KTtcblx0XG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cdFx0VXNlclN2Yy5sb2dvdXQoKTtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0NsYXNzZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQ2xhc3Nlc1N2Yykge1xuXHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb24pIHtcblx0XHRDbGFzc2VzU3ZjLmNyZWF0ZSh7XG5cdFx0XHRuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb25cblx0XHR9KS5zdWNjZXNzKCgpID0+IHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9jbGFzc2VzXCIpO1xuXHRcdH0pO1xuXHR9O1xuXHRcblx0Q2xhc3Nlc1N2Yy5mZXRjaCgpLnN1Y2Nlc3MoZnVuY3Rpb24oY2xhc3Nlcykge1xuXHRcdCRzY29wZS5jbGFzc2VzID0gY2xhc3Nlcztcblx0fSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMpe1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMubG9naW4oZW1haWwsIHBhc3N3b3JkKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyBcblx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pXG5cdH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChmaXJzdG5hbWUsIGxhc3RuYW1lLCBlbWFpbCwgdGVsZXBob25lLCBwYXNzd29yZCwgcmVwZWF0X3Bhc3N3b3JkKXtcblx0XHRcblx0XHRpZihwYXNzd29yZCA9PT0gcmVwZWF0X3Bhc3N3b3JkKSB7XG5cdFx0XHRVc2VyU3ZjLmNyZWF0ZVVzZXIoe1xuXHRcdFx0XHRmaXJzdG5hbWUsXG5cdFx0XHRcdGxhc3RuYW1lLFxuXHRcdFx0XHRlbWFpbCxcblx0XHRcdFx0dGVsZXBob25lLFxuXHRcdFx0XHRwYXNzd29yZFxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7IFxuXHRcdFx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTsgXG5cdFx0XHRcdH0pXG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdLnNldEN1c3RvbVZhbGlkaXR5KFwiUGFzc3dvcmRzIERvbid0IE1hdGNoXCIpO1xuXHRcdH1cblx0fVxufSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ0NsYXNzZXNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NsYXNzZXMnKTtcbiAgIH1cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG5ld0NsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jbGFzc2VzJywgbmV3Q2xhc3MpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnVXNlclN2YycsIGZ1bmN0aW9uKCRodHRwKXtcblx0bGV0IHN2YyA9IHRoaXM7XG5cdFxuXHRzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb25zJywge1xuXHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0cGFzc3dvcmQ6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1xuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gdmFsLmRhdGE7XG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKTtcblx0XHR9KTtcblx0fVxuXG5cdHN2Yy5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUF1dGgnXSA9ICcnO1xuXHR9O1xuXHRcblx0c3ZjLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbihVc2VyKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VycycsIFVzZXIpXG5cdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBzdmMubG9naW4oVXNlci5lbWFpbCwgVXNlci5wYXNzd29yZCk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuIl19
