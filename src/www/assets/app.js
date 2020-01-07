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
	.when('/classes/showSpecial', { controller: 'SpecialClassesCtrl', templateUrl: './classes/showSpecial.html'})
	.when('/myinfo', { controller: 'MyDataCtrl', templateUrl: './users/myinfo.html'})
	.when('/editdata', { controller: 'EditDataCtrl', templateUrl: './users/editdata.html'})
}]);
angular.module('app')
.controller('ApplicationCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.$on('login', function(_, user){
		$scope.currentUser = user;
	});
	
	$scope.logout = function(){
		$scope.currentUser = null;
		UserSvc.logout()
		window.location.assign('/#/');
	};
}]);
angular.module('app')
.controller('ClassesCtrl', ["$scope", "ClassesSvc", function ($scope, ClassesSvc) {
	ClassesSvc.fetch()
	.success(function(classes) {
		$scope.classes = classes;
	});

	$scope.showSpecial = function(name) {
		$scope.className = name;
		window.location.assign("/#/classes/showSpecial");
	}

	$scope.save = function (name, description, duration) {
		ClassesSvc.create({
			name, description, duration
		}).success(() => {
			window.location.assign("/#/classes");
		});
	};
}]);

angular.module('app')
.controller('EditDataCtrl', ["$scope", "EditDataSvc", function ($scope, EditDataSvc) {
	$scope.save = function (firstname, lastname, email, telephone) {
		EditDataSvc.update({
			firstname, lastname, email, telephone
		}).success(() => {
			window.location.assign("/#/mydata");
		});
    };
    
    EditDataSvc.fetch().success(function(data) {
        $scope.data = data;
        console.log(data);
	});
}]);
angular.module('app')
.controller('LoginCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
		.then(function(response){ 
			$scope.$emit('login', response.data); 
		}).then(function() {
			window.location.assign('/#/');
		});
	}
	$scope.login("kokocik1213@gmail.com", "1234");
}]);
angular.module('app')
.controller('MyDataCtrl', ["$scope", "MyDataSvc", function ($scope, MyDataSvc) {
	$scope.save = function (firstname, lastname, email, telephone) {
		MyDataSvc.create({
			firstname, lastname, email, telephone
		}).success(() => {
			window.location.assign("/#/mydata");
		});
	};
	
	MyDataSvc.fetch().success(function(data) {
		$scope.data = data;
	});
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
			}).then(function () {
				window.location.assign('/#/');
			})

			document.querySelectorAll("input")[5].setCustomValidity("");
		} else {
			document.querySelectorAll("input")[5].setCustomValidity("Passwords Don't Match");
		}
	}
}]);


angular.module('app')
.controller('SpecialClassesCtrl', ["$scope", "SpecialClassesSvc", function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.fetch($scope.className)
   .success(function(classes) {
      $scope.classes = classes;
   });

   $scope.save = function (name, description, duration) {
      SpecialClassesSvc.create({
         name, description, duration
      }).success(() => {
         window.location.assign("/#/classes");
      });
   };
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
.service('EditDataSvc', ["$http", function ($http) {
   this.update = function (data){
      return $http.put('/api/mydata', data)
   }


   this.fetch = function () {
      return $http.get('/api/mydata');
   }
}]);
angular.module('app')
.service('MyDataSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/mydata');
   }
   this.create = function (newData) {
      return $http.post('/api/mydata', newData);
   }
}]);
angular.module('app')
.service('SpecialClassesSvc', ["$http", function ($http) {
   this.fetch = function (className) {
      console.log("Special classname: ", className);
      return $http.get('/api/showSpecial', { name: className });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2FwcGxpY2F0aW9uLmN0cmwuanMiLCJjb250cm9sbGVycy9jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9lZGl0ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW4uY3RybC5qcyIsImNvbnRyb2xsZXJzL215ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXIuY3RybC5qcyIsImNvbnRyb2xsZXJzL3NwZWNpYWwuY2xhc3Nlcy5jdHJsLmpzIiwic2VydmljZXMvY2xhc3Nlcy5zdmMuanMiLCJzZXJ2aWNlcy9lZGl0ZGF0YS5zdmMuanMiLCJzZXJ2aWNlcy9teWRhdGEuc3ZjLmpzIiwic2VydmljZXMvc3BlY2lhbC5jbGFzc2VzLnN2Yy5qcyIsInNlcnZpY2VzL3VzZXIuc3ZjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBOztBQ0RBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxhQUFBLEVBQUEsWUFBQSxnQkFBQSxhQUFBO0VBQ0EsS0FBQSxVQUFBLEVBQUEsWUFBQSxhQUFBLGFBQUE7RUFDQSxLQUFBLFlBQUEsRUFBQSxZQUFBLGVBQUEsYUFBQTtFQUNBLEtBQUEsaUJBQUEsRUFBQSxZQUFBLGVBQUEsYUFBQTtFQUNBLEtBQUEsd0JBQUEsRUFBQSxZQUFBLHNCQUFBLGFBQUE7RUFDQSxLQUFBLFdBQUEsRUFBQSxZQUFBLGNBQUEsYUFBQTtFQUNBLEtBQUEsYUFBQSxFQUFBLFlBQUEsZ0JBQUEsYUFBQTs7QUNUQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxRQUFBO0NBQ0EsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLEtBQUE7RUFDQSxPQUFBLGNBQUE7OztDQUdBLE9BQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBOzs7QUNUQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHdDQUFBLFVBQUEsUUFBQSxZQUFBO0NBQ0EsV0FBQTtFQUNBLFFBQUEsU0FBQSxTQUFBO0VBQ0EsT0FBQSxVQUFBOzs7Q0FHQSxPQUFBLGNBQUEsU0FBQSxNQUFBO0VBQ0EsT0FBQSxZQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7OztDQUdBLE9BQUEsT0FBQSxVQUFBLE1BQUEsYUFBQSxVQUFBO0VBQ0EsV0FBQSxPQUFBO0dBQ0EsTUFBQSxhQUFBO0tBQ0EsUUFBQTs7Ozs7O0FDZkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSwwQ0FBQSxVQUFBLFFBQUEsYUFBQTtDQUNBLE9BQUEsT0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUE7RUFDQSxZQUFBLE9BQUE7R0FDQSxXQUFBLFVBQUEsT0FBQTtLQUNBLFFBQUE7Ozs7O0lBS0EsWUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBO1FBQ0EsUUFBQSxJQUFBOzs7QUNaQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLG1DQUFBLFNBQUEsUUFBQSxRQUFBO0NBQ0EsT0FBQSxRQUFBLFNBQUEsT0FBQSxTQUFBO0VBQ0EsUUFBQSxNQUFBLE9BQUE7R0FDQSxLQUFBLFNBQUEsU0FBQTtHQUNBLE9BQUEsTUFBQSxTQUFBLFNBQUE7S0FDQSxLQUFBLFdBQUE7R0FDQSxPQUFBLFNBQUEsT0FBQTs7O0NBR0EsT0FBQSxNQUFBLHlCQUFBOztBQ1ZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsc0NBQUEsVUFBQSxRQUFBLFdBQUE7Q0FDQSxPQUFBLE9BQUEsVUFBQSxXQUFBLFVBQUEsT0FBQSxXQUFBO0VBQ0EsVUFBQSxPQUFBO0dBQ0EsV0FBQSxVQUFBLE9BQUE7S0FDQSxRQUFBOzs7OztDQUtBLFVBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTtFQUNBLE9BQUEsT0FBQTs7O0FDWEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsV0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUEsVUFBQSxnQkFBQTs7RUFFQSxHQUFBLGFBQUEsaUJBQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0EsS0FBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBO01BQ0EsS0FBQSxZQUFBO0lBQ0EsT0FBQSxTQUFBLE9BQUE7OztHQUdBLFNBQUEsaUJBQUEsU0FBQSxHQUFBLGtCQUFBO1NBQ0E7R0FDQSxTQUFBLGlCQUFBLFNBQUEsR0FBQSxrQkFBQTs7Ozs7O0FDbkJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsc0RBQUEsVUFBQSxRQUFBLG1CQUFBO0dBQ0Esa0JBQUEsTUFBQSxPQUFBO0lBQ0EsUUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLFVBQUE7OztHQUdBLE9BQUEsT0FBQSxVQUFBLE1BQUEsYUFBQSxVQUFBO01BQ0Esa0JBQUEsT0FBQTtTQUNBLE1BQUEsYUFBQTtTQUNBLFFBQUE7Ozs7OztBQ1ZBLFFBQUEsT0FBQTtDQUNBLFFBQUEsd0JBQUEsVUFBQSxPQUFBO0dBQ0EsS0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQTs7R0FFQSxLQUFBLFNBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxNQUFBLEtBQUEsZ0JBQUE7OztBQ05BLFFBQUEsT0FBQTtDQUNBLFFBQUEseUJBQUEsVUFBQSxPQUFBO0dBQ0EsS0FBQSxTQUFBLFVBQUEsS0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBLGVBQUE7Ozs7R0FJQSxLQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7QUNSQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHVCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxZQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7O0dBRUEsS0FBQSxTQUFBLFVBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLGVBQUE7OztBQ05BLFFBQUEsT0FBQTtDQUNBLFFBQUEsK0JBQUEsVUFBQSxPQUFBO0dBQ0EsS0FBQSxRQUFBLFVBQUEsV0FBQTtNQUNBLFFBQUEsSUFBQSx1QkFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBLG9CQUFBLEVBQUEsTUFBQTs7R0FFQSxLQUFBLFNBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxNQUFBLEtBQUEsZ0JBQUE7OztBQ1BBLFFBQUEsT0FBQTtDQUNBLFFBQUEscUJBQUEsU0FBQSxNQUFBO0NBQ0EsSUFBQSxNQUFBOztDQUVBLElBQUEsVUFBQSxVQUFBO0VBQ0EsT0FBQSxNQUFBLElBQUE7OztDQUdBLElBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQTtFQUNBLE9BQUEsTUFBQSxLQUFBLGlCQUFBO0dBQ0EsT0FBQTtHQUNBLFVBQUE7S0FDQSxLQUFBLFNBQUEsSUFBQTtHQUNBLE1BQUEsU0FBQSxRQUFBLE9BQUEsWUFBQSxJQUFBO0dBQ0EsT0FBQSxJQUFBOzs7O0NBSUEsSUFBQSxTQUFBLFVBQUE7RUFDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUE7OztDQUdBLElBQUEsYUFBQSxTQUFBLEtBQUE7RUFDQSxPQUFBLE1BQUEsS0FBQSxjQUFBO0dBQ0EsS0FBQSxVQUFBO0dBQ0EsT0FBQSxJQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7Ozs7QUFJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcblx0XHQnbmdSb3V0ZSdcblx0XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcblx0JHJvdXRlUHJvdmlkZXJcblx0LndoZW4oJy9yZWdpc3RlcicsIHsgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCd9KVxuXHQud2hlbignL2xvZ2luJywgeyBjb250cm9sbGVyOiAnTG9naW5DdHJsJywgdGVtcGxhdGVVcmw6ICdsb2dpbi5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3NlcycsIHsgY29udHJvbGxlcjogJ0NsYXNzZXNDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvY2xhc3Nlcy5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3Nlcy9lZGl0JywgeyBjb250cm9sbGVyOiAnQ2xhc3Nlc0N0cmwnLCB0ZW1wbGF0ZVVybDogJy4vY2xhc3Nlcy9jbGFzc2VzRWRpdC5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3Nlcy9zaG93U3BlY2lhbCcsIHsgY29udHJvbGxlcjogJ1NwZWNpYWxDbGFzc2VzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL3Nob3dTcGVjaWFsLmh0bWwnfSlcblx0LndoZW4oJy9teWluZm8nLCB7IGNvbnRyb2xsZXI6ICdNeURhdGFDdHJsJywgdGVtcGxhdGVVcmw6ICcuL3VzZXJzL215aW5mby5odG1sJ30pXG5cdC53aGVuKCcvZWRpdGRhdGEnLCB7IGNvbnRyb2xsZXI6ICdFZGl0RGF0YUN0cmwnLCB0ZW1wbGF0ZVVybDogJy4vdXNlcnMvZWRpdGRhdGEuaHRtbCd9KVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuXHR9KTtcblx0XG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cdFx0VXNlclN2Yy5sb2dvdXQoKVxuXHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8jLycpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQ2xhc3Nlc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBDbGFzc2VzU3ZjKSB7XG5cdENsYXNzZXNTdmMuZmV0Y2goKVxuXHQuc3VjY2VzcyhmdW5jdGlvbihjbGFzc2VzKSB7XG5cdFx0JHNjb3BlLmNsYXNzZXMgPSBjbGFzc2VzO1xuXHR9KTtcblxuXHQkc2NvcGUuc2hvd1NwZWNpYWwgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0JHNjb3BlLmNsYXNzTmFtZSA9IG5hbWU7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvc2hvd1NwZWNpYWxcIik7XG5cdH1cblxuXHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb24pIHtcblx0XHRDbGFzc2VzU3ZjLmNyZWF0ZSh7XG5cdFx0XHRuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb25cblx0XHR9KS5zdWNjZXNzKCgpID0+IHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9jbGFzc2VzXCIpO1xuXHRcdH0pO1xuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdFZGl0RGF0YUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBFZGl0RGF0YVN2Yykge1xuXHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChmaXJzdG5hbWUsIGxhc3RuYW1lLCBlbWFpbCwgdGVsZXBob25lKSB7XG5cdFx0RWRpdERhdGFTdmMudXBkYXRlKHtcblx0XHRcdGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmVcblx0XHR9KS5zdWNjZXNzKCgpID0+IHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9teWRhdGFcIik7XG5cdFx0fSk7XG4gICAgfTtcbiAgICBcbiAgICBFZGl0RGF0YVN2Yy5mZXRjaCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUuZGF0YSA9IGRhdGE7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXHR9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5sb2dpbihlbWFpbCwgcGFzc3dvcmQpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpeyBcblx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTsgXG5cdFx0fSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8jLycpO1xuXHRcdH0pO1xuXHR9XG5cdCRzY29wZS5sb2dpbihcImtva29jaWsxMjEzQGdtYWlsLmNvbVwiLCBcIjEyMzRcIik7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdNeURhdGFDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgTXlEYXRhU3ZjKSB7XG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmUpIHtcblx0XHRNeURhdGFTdmMuY3JlYXRlKHtcblx0XHRcdGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmVcblx0XHR9KS5zdWNjZXNzKCgpID0+IHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9teWRhdGFcIik7XG5cdFx0fSk7XG5cdH07XG5cdFxuXHRNeURhdGFTdmMuZmV0Y2goKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQkc2NvcGUuZGF0YSA9IGRhdGE7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmUsIHBhc3N3b3JkLCByZXBlYXRfcGFzc3dvcmQpe1xuXHRcdFxuXHRcdGlmKHBhc3N3b3JkID09PSByZXBlYXRfcGFzc3dvcmQpIHtcblx0XHRcdFVzZXJTdmMuY3JlYXRlVXNlcih7XG5cdFx0XHRcdGZpcnN0bmFtZSxcblx0XHRcdFx0bGFzdG5hbWUsXG5cdFx0XHRcdGVtYWlsLFxuXHRcdFx0XHR0ZWxlcGhvbmUsXG5cdFx0XHRcdHBhc3N3b3JkXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgXG5cdFx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvIy8nKTtcblx0XHRcdH0pXG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdLnNldEN1c3RvbVZhbGlkaXR5KFwiUGFzc3dvcmRzIERvbid0IE1hdGNoXCIpO1xuXHRcdH1cblx0fVxufSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1NwZWNpYWxDbGFzc2VzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFNwZWNpYWxDbGFzc2VzU3ZjKSB7XG4gICBTcGVjaWFsQ2xhc3Nlc1N2Yy5mZXRjaCgkc2NvcGUuY2xhc3NOYW1lKVxuICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY2xhc3Nlcykge1xuICAgICAgJHNjb3BlLmNsYXNzZXMgPSBjbGFzc2VzO1xuICAgfSk7XG5cbiAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKG5hbWUsIGRlc2NyaXB0aW9uLCBkdXJhdGlvbikge1xuICAgICAgU3BlY2lhbENsYXNzZXNTdmMuY3JlYXRlKHtcbiAgICAgICAgIG5hbWUsIGRlc2NyaXB0aW9uLCBkdXJhdGlvblxuICAgICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlc1wiKTtcbiAgICAgIH0pO1xuICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnQ2xhc3Nlc1N2YycsIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2xhc3NlcycpO1xuICAgfVxuICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobmV3Q2xhc3MpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2NsYXNzZXMnLCBuZXdDbGFzcyk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdFZGl0RGF0YVN2YycsIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSl7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL215ZGF0YScsIGRhdGEpXG4gICB9XG5cblxuICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbXlkYXRhJyk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdNeURhdGFTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL215ZGF0YScpO1xuICAgfVxuICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvbXlkYXRhJywgbmV3RGF0YSk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdTcGVjaWFsQ2xhc3Nlc1N2YycsIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3BlY2lhbCBjbGFzc25hbWU6IFwiLCBjbGFzc05hbWUpO1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zaG93U3BlY2lhbCcsIHsgbmFtZTogY2xhc3NOYW1lIH0pO1xuICAgfVxuICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobmV3Q2xhc3MpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2NsYXNzZXMnLCBuZXdDbGFzcyk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHApe1xuXHRsZXQgc3ZjID0gdGhpcztcblx0XG5cdHN2Yy5nZXRVc2VyID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJylcblx0fVxuXG5cdHN2Yy5sb2dpbiA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2Vzc2lvbnMnLCB7XG5cdFx0XHRlbWFpbDogZW1haWwsXG5cdFx0XHRwYXNzd29yZDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSB2YWwuZGF0YTtcblx0XHRcdHJldHVybiBzdmMuZ2V0VXNlcigpO1xuXHRcdH0pO1xuXHR9XG5cblx0c3ZjLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gJyc7XG5cdH07XG5cdFxuXHRzdmMuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKFVzZXIpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXJzJywgVXNlcilcblx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbihVc2VyLmVtYWlsLCBVc2VyLnBhc3N3b3JkKTtcblx0XHR9KTtcblx0fVxufSk7XG4iXX0=
