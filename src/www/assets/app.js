let app = angular.module('app', [
		'ngRoute'
	]);
const staticObj = {
	oldClass: {}
};
angular.module('app')
.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html'})
	.when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
	.when('/classes', { controller: 'ClassesCtrl', templateUrl: './classes/classes.html'})
	.when('/classes/edit', { controller: 'ClassesCtrl', templateUrl: './classes/classesEdit.html'})
	.when('/classes/showSpecial', { controller: 'SpecialClassesCtrl', templateUrl: './classes/showSpecial.html'})
	.when('/classes/editSpecial', { controller: 'SpecialClassesEditCtrl', templateUrl: './classes/editSpecial.html'})
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
	$scope.class = staticObj.class;
	
	$scope.showSpecial = function(name) {
		staticObj.className = name;
		staticObj.classId = $scope.classes.find(item => item.name === name).id;
		window.location.assign("/#/classes/showSpecial");
	}
	
	$scope.edit = function(Class) {
		staticObj.class = Class;
		staticObj.oldClass = Object.assign({}, Class);
		window.location.assign("/#/classes/edit");
	}

	$scope.save = function (name, description, duration) {
		if (JSON.stringify(staticObj.oldClass) !== '{}') {
			if (JSON.stringify(staticObj.oldClass) !== JSON.stringify($scope.class)) {
				ClassesSvc.update({
					name, description, duration, 
					oldName: staticObj.oldClass.name
				})
			}
			staticObj.oldClass = {};
			window.location.assign("/#/classes");
		} else {
			ClassesSvc.create({
				name, description, duration
			}).success(() => {
				window.location.assign("/#/classes");
			});
		}
	};
}]);

angular.module('app')
.controller('EditDataCtrl', ["$scope", "EditDataSvc", function ($scope, EditDataSvc) {
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
	$scope.login("admin@admin.com", "1234");
}]);
angular.module('app')
.controller('MyDataCtrl', ["$scope", "MyDataSvc", function ($scope, MyDataSvc) {
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
   SpecialClassesSvc.fetch(staticObj.className)
   .success(function(classes) {
      $scope.classes = classes.map(item => {
         item.start = item.start.slice(0, 16);
         return item; 
      }).sort(item => item.reserved);
   });
   
   $scope.edit = function(Class) {
      staticObj.class = Class;
      staticObj.oldClass = Object.assign({}, Class);
      window.location.assign('/#/classes/editSpecial');
   }

   $scope.reservation = function() {
      const button = window.myButton.children[0];
      const action = (button.classList.contains("collapsed"))? "assign" : "unAssign"; 
      
      SpecialClassesSvc.reservate(action, (button.title * 1))
      .success(function(status) {
         console.log(status)
         if(status[0][0].OK) {
            button.classList.toggle("collapsed");
         } else {
            alert("Jesteś już zapisany w tym czasie do zajęć")
         }
      })
   }
}]);

angular.module('app')
.controller('SpecialClassesEditCtrl', ["$scope", "SpecialClassesSvc", function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.getTrainers()
   .success(function(trainers) {
      $scope.trainers = trainers;
   });
   $scope.class = staticObj.class;

   $scope.save = function (start, trainerName, max_participants) {      
      if (JSON.stringify(staticObj.oldClass) !== '{}') {
         if (JSON.stringify(staticObj.oldClass) !== JSON.stringify($scope.class)) {
            SpecialClassesSvc.update({
               trainerId: $scope.trainers.find((item) => item.name === trainerName).id, 
               className: staticObj.className,
               start: (start + ":00").replace("T", " "), 
               max_participants,
               id: staticObj.oldClass.id
            })
         }
         staticObj.oldClass = {};
         window.location.assign("/#/classes/showSpecial");
      } else {
         SpecialClassesSvc.create({
            trainerId: $scope.trainers.find((item) => item.name === trainerName).id, 
            classId: staticObj.classId,
            start: (start + ":00").replace("T", " "), 
            max_participants
         }).success(() => {
            window.location.assign("/#/classes/showSpecial");
         }).catch((reason)=>{
            console.log("REASON: ", reason)
         });
      }
   };
}]);

angular.module('app')
.service('ClassesSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/classes');
   }

   this.update = function(updatedClass) {
      return $http.put('/api/classes', updatedClass);
   }

   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
}]);
angular.module('app')
.service('EditDataSvc', ["$http", function ($http) {
   const svc = this;

   svc.fetch = function () {
      return $http.get('/api/mydata');
   }

   svc.getUser = function() {
      return $http.get('/api/users');
   }

   svc.update = function (data){
      return $http.put('/api/mydata', data)
      .then(function(res) {
         $http.defaults.headers.common['X-Auth'] = res.data;
         return svc.getUser();
      })
   }
}]);
angular.module('app')
.service('MyDataSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/mydata');
   }
}]);
angular.module('app')
.service('SpecialClassesSvc', ["$http", function ($http) {
   this.fetch = function (className) {
      return $http({
         method: 'GET',
         url: '/api/specialClasses',
         headers: { name: className }
      });
   }

   this.getReservations = function() {
      return $http.get('/api/reservation');
   }

   this.reservate = function (action, classId) {
      return $http.post('/api/reservation', { action, classId });
   }

   this.getTrainers = function() {
      return $http.get('/api/trainers');
   }

   this.update = function(Class) {
      return $http.put('/api/specialClasses', Class)
   }

   this.create = function (newClass) {
      return $http.post('/api/specialClasses', newClass);
   }
}]);
angular.module('app')
.service('UserSvc', ["$http", function($http){
	const svc = this;
	
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
		window.auth = {};
		$http.defaults.headers.common['X-Auth'] = '';
	};
	
	svc.createUser = function(User){
		return $http.post('/api/users', User)
		.then(function(){
			return svc.login(User.email, User.password);
		});
	}
}]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2FwcGxpY2F0aW9uLmN0cmwuanMiLCJjb250cm9sbGVycy9jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9lZGl0ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW4uY3RybC5qcyIsImNvbnRyb2xsZXJzL215ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXIuY3RybC5qcyIsImNvbnRyb2xsZXJzL3NwZWNpYWwuY2xhc3Nlcy5jdHJsLmpzIiwiY29udHJvbGxlcnMvc3BlY2lhbC5jbGFzc2VzLmVkaXQuY3RybC5qcyIsInNlcnZpY2VzL2NsYXNzZXMuc3ZjLmpzIiwic2VydmljZXMvZWRpdGRhdGEuc3ZjLmpzIiwic2VydmljZXMvbXlkYXRhLnN2Yy5qcyIsInNlcnZpY2VzL3NwZWNpYWwuY2xhc3Nlcy5zdmMuanMiLCJzZXJ2aWNlcy91c2VyLnN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLE1BQUEsUUFBQSxPQUFBLE9BQUE7RUFDQTs7QUFFQSxNQUFBLFlBQUE7Q0FDQSxVQUFBOztBQ0pBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxhQUFBLEVBQUEsWUFBQSxnQkFBQSxhQUFBO0VBQ0EsS0FBQSxVQUFBLEVBQUEsWUFBQSxhQUFBLGFBQUE7RUFDQSxLQUFBLFlBQUEsRUFBQSxZQUFBLGVBQUEsYUFBQTtFQUNBLEtBQUEsaUJBQUEsRUFBQSxZQUFBLGVBQUEsYUFBQTtFQUNBLEtBQUEsd0JBQUEsRUFBQSxZQUFBLHNCQUFBLGFBQUE7RUFDQSxLQUFBLHdCQUFBLEVBQUEsWUFBQSwwQkFBQSxhQUFBO0VBQ0EsS0FBQSxXQUFBLEVBQUEsWUFBQSxjQUFBLGFBQUE7RUFDQSxLQUFBLGFBQUEsRUFBQSxZQUFBLGdCQUFBLGFBQUE7O0FDVkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSx5Q0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsSUFBQSxTQUFBLFNBQUEsR0FBQSxLQUFBO0VBQ0EsT0FBQSxjQUFBOzs7Q0FHQSxPQUFBLFNBQUEsVUFBQTtFQUNBLE9BQUEsY0FBQTtFQUNBLFFBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQTs7O0FDVEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSx3Q0FBQSxVQUFBLFFBQUEsWUFBQTtDQUNBLFdBQUE7RUFDQSxRQUFBLFNBQUEsU0FBQTtFQUNBLE9BQUEsVUFBQTs7Q0FFQSxPQUFBLFFBQUEsVUFBQTs7Q0FFQSxPQUFBLGNBQUEsU0FBQSxNQUFBO0VBQ0EsVUFBQSxZQUFBO0VBQ0EsVUFBQSxVQUFBLE9BQUEsUUFBQSxLQUFBLDRCQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7OztDQUdBLE9BQUEsT0FBQSxTQUFBLE9BQUE7RUFDQSxVQUFBLFFBQUE7RUFDQSxVQUFBLFdBQUEsT0FBQSxPQUFBLElBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQTs7O0NBR0EsT0FBQSxPQUFBLFVBQUEsTUFBQSxhQUFBLFVBQUE7RUFDQSxJQUFBLEtBQUEsVUFBQSxVQUFBLGNBQUEsTUFBQTtHQUNBLElBQUEsS0FBQSxVQUFBLFVBQUEsY0FBQSxLQUFBLFVBQUEsT0FBQSxRQUFBO0lBQ0EsV0FBQSxPQUFBO0tBQ0EsTUFBQSxhQUFBO0tBQ0EsU0FBQSxVQUFBLFNBQUE7OztHQUdBLFVBQUEsV0FBQTtHQUNBLE9BQUEsU0FBQSxPQUFBO1NBQ0E7R0FDQSxXQUFBLE9BQUE7SUFDQSxNQUFBLGFBQUE7TUFDQSxRQUFBOzs7Ozs7O0FDakNBLFFBQUEsT0FBQTtDQUNBLFdBQUEsMENBQUEsVUFBQSxRQUFBLGFBQUE7Q0FDQSxZQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUE7R0FDQSxPQUFBLE9BQUE7OztDQUdBLE9BQUEsT0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUE7RUFDQSxZQUFBLE9BQUE7R0FDQSxXQUFBLFVBQUEsT0FBQTtLQUNBLEtBQUE7Ozs7OztBQ1RBLFFBQUEsT0FBQTtDQUNBLFdBQUEsbUNBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxRQUFBLE1BQUEsT0FBQTtHQUNBLEtBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTtLQUNBLEtBQUEsV0FBQTtHQUNBLE9BQUEsU0FBQSxPQUFBOzs7Q0FHQSxPQUFBLE1BQUEsbUJBQUE7O0FDVkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxVQUFBLFFBQUEsV0FBQTtDQUNBLFVBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTtFQUNBLE9BQUEsT0FBQTs7O0FDSEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsV0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUEsVUFBQSxnQkFBQTs7RUFFQSxHQUFBLGFBQUEsaUJBQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0EsS0FBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBO01BQ0EsS0FBQSxZQUFBO0lBQ0EsT0FBQSxTQUFBLE9BQUE7OztHQUdBLFNBQUEsaUJBQUEsU0FBQSxHQUFBLGtCQUFBO1NBQ0E7R0FDQSxTQUFBLGlCQUFBLFNBQUEsR0FBQSxrQkFBQTs7Ozs7QUNuQkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzREFBQSxVQUFBLFFBQUEsbUJBQUE7R0FDQSxrQkFBQSxNQUFBLFVBQUE7SUFDQSxRQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsVUFBQSxRQUFBLElBQUE7OztTQUdBLEtBQUE7OztHQUdBLE9BQUEsT0FBQSxTQUFBLE9BQUE7TUFDQSxVQUFBLFFBQUE7TUFDQSxVQUFBLFdBQUEsT0FBQSxPQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsT0FBQTs7O0dBR0EsT0FBQSxjQUFBLFdBQUE7TUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLFNBQUE7TUFDQSxNQUFBLFNBQUEsQ0FBQSxPQUFBLFVBQUEsU0FBQSxlQUFBLFdBQUE7O01BRUEsa0JBQUEsVUFBQSxTQUFBLE9BQUEsUUFBQTtPQUNBLFFBQUEsU0FBQSxRQUFBO1NBQ0EsUUFBQSxJQUFBO1NBQ0EsR0FBQSxPQUFBLEdBQUEsR0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBLE9BQUE7Z0JBQ0E7WUFDQSxNQUFBOzs7Ozs7QUMxQkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSwwREFBQSxVQUFBLFFBQUEsbUJBQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQSxXQUFBOztHQUVBLE9BQUEsUUFBQSxVQUFBOztHQUVBLE9BQUEsT0FBQSxVQUFBLE9BQUEsYUFBQSxrQkFBQTtNQUNBLElBQUEsS0FBQSxVQUFBLFVBQUEsY0FBQSxNQUFBO1NBQ0EsSUFBQSxLQUFBLFVBQUEsVUFBQSxjQUFBLEtBQUEsVUFBQSxPQUFBLFFBQUE7WUFDQSxrQkFBQSxPQUFBO2VBQ0EsV0FBQSxPQUFBLFNBQUEsS0FBQSxxQ0FBQTtlQUNBLFdBQUEsVUFBQTtlQUNBLE9BQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxLQUFBO2VBQ0E7ZUFDQSxJQUFBLFVBQUEsU0FBQTs7O1NBR0EsVUFBQSxXQUFBO1NBQ0EsT0FBQSxTQUFBLE9BQUE7YUFDQTtTQUNBLGtCQUFBLE9BQUE7WUFDQSxXQUFBLE9BQUEsU0FBQSxLQUFBLHFDQUFBO1lBQ0EsU0FBQSxVQUFBO1lBQ0EsT0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQTtZQUNBLFFBQUE7O1lBRUEsTUFBQTs7Ozs7OztBQzdCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHdCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxZQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7OztHQUdBLEtBQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQSxnQkFBQTs7O0dBR0EsS0FBQSxTQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLGdCQUFBOzs7QUNYQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHlCQUFBLFVBQUEsT0FBQTtHQUNBLE1BQUEsTUFBQTs7R0FFQSxJQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7R0FHQSxJQUFBLFVBQUEsV0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7R0FHQSxJQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsT0FBQSxNQUFBLElBQUEsZUFBQTtPQUNBLEtBQUEsU0FBQSxLQUFBO1NBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLElBQUE7U0FDQSxPQUFBLElBQUE7Ozs7QUNoQkEsUUFBQSxPQUFBO0NBQ0EsUUFBQSx1QkFBQSxVQUFBLE9BQUE7R0FDQSxLQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7QUNIQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLCtCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxVQUFBLFdBQUE7TUFDQSxPQUFBLE1BQUE7U0FDQSxRQUFBO1NBQ0EsS0FBQTtTQUNBLFNBQUEsRUFBQSxNQUFBOzs7O0dBSUEsS0FBQSxrQkFBQSxXQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7OztHQUdBLEtBQUEsWUFBQSxVQUFBLFFBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLG9CQUFBLEVBQUEsUUFBQTs7O0dBR0EsS0FBQSxjQUFBLFdBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQTs7O0dBR0EsS0FBQSxTQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBLHVCQUFBOzs7R0FHQSxLQUFBLFNBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxNQUFBLEtBQUEsdUJBQUE7OztBQzNCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHFCQUFBLFNBQUEsTUFBQTtDQUNBLE1BQUEsTUFBQTs7Q0FFQSxJQUFBLFVBQUEsVUFBQTtFQUNBLE9BQUEsTUFBQSxJQUFBOzs7Q0FHQSxJQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtHQUNBLE9BQUE7R0FDQSxVQUFBO0tBQ0EsS0FBQSxTQUFBLElBQUE7R0FDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsSUFBQTtHQUNBLE9BQUEsSUFBQTs7OztDQUlBLElBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7Q0FHQSxJQUFBLGFBQUEsU0FBQSxLQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtHQUNBLEtBQUEsVUFBQTtHQUNBLE9BQUEsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG5cdFx0J25nUm91dGUnXG5cdF0pO1xuY29uc3Qgc3RhdGljT2JqID0ge1xuXHRvbGRDbGFzczoge31cbn07IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcblx0JHJvdXRlUHJvdmlkZXJcblx0LndoZW4oJy9yZWdpc3RlcicsIHsgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsIHRlbXBsYXRlVXJsOiAncmVnaXN0ZXIuaHRtbCd9KVxuXHQud2hlbignL2xvZ2luJywgeyBjb250cm9sbGVyOiAnTG9naW5DdHJsJywgdGVtcGxhdGVVcmw6ICdsb2dpbi5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3NlcycsIHsgY29udHJvbGxlcjogJ0NsYXNzZXNDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvY2xhc3Nlcy5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3Nlcy9lZGl0JywgeyBjb250cm9sbGVyOiAnQ2xhc3Nlc0N0cmwnLCB0ZW1wbGF0ZVVybDogJy4vY2xhc3Nlcy9jbGFzc2VzRWRpdC5odG1sJ30pXG5cdC53aGVuKCcvY2xhc3Nlcy9zaG93U3BlY2lhbCcsIHsgY29udHJvbGxlcjogJ1NwZWNpYWxDbGFzc2VzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL3Nob3dTcGVjaWFsLmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzL2VkaXRTcGVjaWFsJywgeyBjb250cm9sbGVyOiAnU3BlY2lhbENsYXNzZXNFZGl0Q3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL2VkaXRTcGVjaWFsLmh0bWwnfSlcblx0LndoZW4oJy9teWluZm8nLCB7IGNvbnRyb2xsZXI6ICdNeURhdGFDdHJsJywgdGVtcGxhdGVVcmw6ICcuL3VzZXJzL215aW5mby5odG1sJ30pXG5cdC53aGVuKCcvZWRpdGRhdGEnLCB7IGNvbnRyb2xsZXI6ICdFZGl0RGF0YUN0cmwnLCB0ZW1wbGF0ZVVybDogJy4vdXNlcnMvZWRpdGRhdGEuaHRtbCd9KVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuXHR9KTtcblx0XG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cdFx0VXNlclN2Yy5sb2dvdXQoKVxuXHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8jLycpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQ2xhc3Nlc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBDbGFzc2VzU3ZjKSB7XG5cdENsYXNzZXNTdmMuZmV0Y2goKVxuXHQuc3VjY2VzcyhmdW5jdGlvbihjbGFzc2VzKSB7XG5cdFx0JHNjb3BlLmNsYXNzZXMgPSBjbGFzc2VzO1xuXHR9KTtcblx0JHNjb3BlLmNsYXNzID0gc3RhdGljT2JqLmNsYXNzO1xuXHRcblx0JHNjb3BlLnNob3dTcGVjaWFsID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdHN0YXRpY09iai5jbGFzc05hbWUgPSBuYW1lO1xuXHRcdHN0YXRpY09iai5jbGFzc0lkID0gJHNjb3BlLmNsYXNzZXMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSkuaWQ7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvc2hvd1NwZWNpYWxcIik7XG5cdH1cblx0XG5cdCRzY29wZS5lZGl0ID0gZnVuY3Rpb24oQ2xhc3MpIHtcblx0XHRzdGF0aWNPYmouY2xhc3MgPSBDbGFzcztcblx0XHRzdGF0aWNPYmoub2xkQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBDbGFzcyk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvZWRpdFwiKTtcblx0fVxuXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKG5hbWUsIGRlc2NyaXB0aW9uLCBkdXJhdGlvbikge1xuXHRcdGlmIChKU09OLnN0cmluZ2lmeShzdGF0aWNPYmoub2xkQ2xhc3MpICE9PSAne30nKSB7XG5cdFx0XHRpZiAoSlNPTi5zdHJpbmdpZnkoc3RhdGljT2JqLm9sZENsYXNzKSAhPT0gSlNPTi5zdHJpbmdpZnkoJHNjb3BlLmNsYXNzKSkge1xuXHRcdFx0XHRDbGFzc2VzU3ZjLnVwZGF0ZSh7XG5cdFx0XHRcdFx0bmFtZSwgZGVzY3JpcHRpb24sIGR1cmF0aW9uLCBcblx0XHRcdFx0XHRvbGROYW1lOiBzdGF0aWNPYmoub2xkQ2xhc3MubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0c3RhdGljT2JqLm9sZENsYXNzID0ge307XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlc1wiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Q2xhc3Nlc1N2Yy5jcmVhdGUoe1xuXHRcdFx0XHRuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb25cblx0XHRcdH0pLnN1Y2Nlc3MoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlc1wiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignRWRpdERhdGFDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRWRpdERhdGFTdmMpIHtcblx0RWRpdERhdGFTdmMuZmV0Y2goKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQgJHNjb3BlLmRhdGEgPSBkYXRhO1xuICB9KTtcblxuXHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChmaXJzdG5hbWUsIGxhc3RuYW1lLCBlbWFpbCwgdGVsZXBob25lKSB7XG5cdFx0RWRpdERhdGFTdmMudXBkYXRlKHtcblx0XHRcdGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmVcblx0XHR9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL215aW5mb1wiKTtcblx0XHR9KTtcbiAgICB9OyAgXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMpe1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMubG9naW4oZW1haWwsIHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSk7IFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvIy8nKTtcblx0XHR9KTtcblx0fVxuXHQkc2NvcGUubG9naW4oXCJhZG1pbkBhZG1pbi5jb21cIiwgXCIxMjM0XCIpO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTXlEYXRhQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIE15RGF0YVN2Yykge1xuXHRNeURhdGFTdmMuZmV0Y2goKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQkc2NvcGUuZGF0YSA9IGRhdGE7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmUsIHBhc3N3b3JkLCByZXBlYXRfcGFzc3dvcmQpe1xuXHRcdFxuXHRcdGlmKHBhc3N3b3JkID09PSByZXBlYXRfcGFzc3dvcmQpIHtcblx0XHRcdFVzZXJTdmMuY3JlYXRlVXNlcih7XG5cdFx0XHRcdGZpcnN0bmFtZSxcblx0XHRcdFx0bGFzdG5hbWUsXG5cdFx0XHRcdGVtYWlsLFxuXHRcdFx0XHR0ZWxlcGhvbmUsXG5cdFx0XHRcdHBhc3N3b3JkXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgXG5cdFx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvIy8nKTtcblx0XHRcdH0pXG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdLnNldEN1c3RvbVZhbGlkaXR5KFwiUGFzc3dvcmRzIERvbid0IE1hdGNoXCIpO1xuXHRcdH1cblx0fVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdTcGVjaWFsQ2xhc3Nlc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBTcGVjaWFsQ2xhc3Nlc1N2Yykge1xuICAgU3BlY2lhbENsYXNzZXNTdmMuZmV0Y2goc3RhdGljT2JqLmNsYXNzTmFtZSlcbiAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNsYXNzZXMpIHtcbiAgICAgICRzY29wZS5jbGFzc2VzID0gY2xhc3Nlcy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICBpdGVtLnN0YXJ0ID0gaXRlbS5zdGFydC5zbGljZSgwLCAxNik7XG4gICAgICAgICByZXR1cm4gaXRlbTsgXG4gICAgICB9KS5zb3J0KGl0ZW0gPT4gaXRlbS5yZXNlcnZlZCk7XG4gICB9KTtcbiAgIFxuICAgJHNjb3BlLmVkaXQgPSBmdW5jdGlvbihDbGFzcykge1xuICAgICAgc3RhdGljT2JqLmNsYXNzID0gQ2xhc3M7XG4gICAgICBzdGF0aWNPYmoub2xkQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBDbGFzcyk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvIy9jbGFzc2VzL2VkaXRTcGVjaWFsJyk7XG4gICB9XG5cbiAgICRzY29wZS5yZXNlcnZhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYnV0dG9uID0gd2luZG93Lm15QnV0dG9uLmNoaWxkcmVuWzBdO1xuICAgICAgY29uc3QgYWN0aW9uID0gKGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJjb2xsYXBzZWRcIikpPyBcImFzc2lnblwiIDogXCJ1bkFzc2lnblwiOyBcbiAgICAgIFxuICAgICAgU3BlY2lhbENsYXNzZXNTdmMucmVzZXJ2YXRlKGFjdGlvbiwgKGJ1dHRvbi50aXRsZSAqIDEpKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICAgICBpZihzdGF0dXNbMF1bMF0uT0spIHtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiY29sbGFwc2VkXCIpO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiSmVzdGXFmyBqdcW8IHphcGlzYW55IHcgdHltIGN6YXNpZSBkbyB6YWrEmcSHXCIpXG4gICAgICAgICB9XG4gICAgICB9KVxuICAgfVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdTcGVjaWFsQ2xhc3Nlc0VkaXRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgU3BlY2lhbENsYXNzZXNTdmMpIHtcbiAgIFNwZWNpYWxDbGFzc2VzU3ZjLmdldFRyYWluZXJzKClcbiAgIC5zdWNjZXNzKGZ1bmN0aW9uKHRyYWluZXJzKSB7XG4gICAgICAkc2NvcGUudHJhaW5lcnMgPSB0cmFpbmVycztcbiAgIH0pO1xuICAgJHNjb3BlLmNsYXNzID0gc3RhdGljT2JqLmNsYXNzO1xuXG4gICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChzdGFydCwgdHJhaW5lck5hbWUsIG1heF9wYXJ0aWNpcGFudHMpIHsgICAgICBcbiAgICAgIGlmIChKU09OLnN0cmluZ2lmeShzdGF0aWNPYmoub2xkQ2xhc3MpICE9PSAne30nKSB7XG4gICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoc3RhdGljT2JqLm9sZENsYXNzKSAhPT0gSlNPTi5zdHJpbmdpZnkoJHNjb3BlLmNsYXNzKSkge1xuICAgICAgICAgICAgU3BlY2lhbENsYXNzZXNTdmMudXBkYXRlKHtcbiAgICAgICAgICAgICAgIHRyYWluZXJJZDogJHNjb3BlLnRyYWluZXJzLmZpbmQoKGl0ZW0pID0+IGl0ZW0ubmFtZSA9PT0gdHJhaW5lck5hbWUpLmlkLCBcbiAgICAgICAgICAgICAgIGNsYXNzTmFtZTogc3RhdGljT2JqLmNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgIHN0YXJ0OiAoc3RhcnQgKyBcIjowMFwiKS5yZXBsYWNlKFwiVFwiLCBcIiBcIiksIFxuICAgICAgICAgICAgICAgbWF4X3BhcnRpY2lwYW50cyxcbiAgICAgICAgICAgICAgIGlkOiBzdGF0aWNPYmoub2xkQ2xhc3MuaWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICB9XG4gICAgICAgICBzdGF0aWNPYmoub2xkQ2xhc3MgPSB7fTtcbiAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9jbGFzc2VzL3Nob3dTcGVjaWFsXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIFNwZWNpYWxDbGFzc2VzU3ZjLmNyZWF0ZSh7XG4gICAgICAgICAgICB0cmFpbmVySWQ6ICRzY29wZS50cmFpbmVycy5maW5kKChpdGVtKSA9PiBpdGVtLm5hbWUgPT09IHRyYWluZXJOYW1lKS5pZCwgXG4gICAgICAgICAgICBjbGFzc0lkOiBzdGF0aWNPYmouY2xhc3NJZCxcbiAgICAgICAgICAgIHN0YXJ0OiAoc3RhcnQgKyBcIjowMFwiKS5yZXBsYWNlKFwiVFwiLCBcIiBcIiksIFxuICAgICAgICAgICAgbWF4X3BhcnRpY2lwYW50c1xuICAgICAgICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlcy9zaG93U3BlY2lhbFwiKTtcbiAgICAgICAgIH0pLmNhdGNoKChyZWFzb24pPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFQVNPTjogXCIsIHJlYXNvbilcbiAgICAgICAgIH0pO1xuICAgICAgfVxuICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnQ2xhc3Nlc1N2YycsIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2xhc3NlcycpO1xuICAgfVxuXG4gICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHVwZGF0ZWRDbGFzcykge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS9jbGFzc2VzJywgdXBkYXRlZENsYXNzKTtcbiAgIH1cblxuICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobmV3Q2xhc3MpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2NsYXNzZXMnLCBuZXdDbGFzcyk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdFZGl0RGF0YVN2YycsIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgY29uc3Qgc3ZjID0gdGhpcztcblxuICAgc3ZjLmZldGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9teWRhdGEnKTtcbiAgIH1cblxuICAgc3ZjLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcnMnKTtcbiAgIH1cblxuICAgc3ZjLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKXtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvbXlkYXRhJywgZGF0YSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gcmVzLmRhdGE7XG4gICAgICAgICByZXR1cm4gc3ZjLmdldFVzZXIoKTtcbiAgICAgIH0pXG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdNeURhdGFTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL215ZGF0YScpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnU3BlY2lhbENsYXNzZXNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgIHVybDogJy9hcGkvc3BlY2lhbENsYXNzZXMnLFxuICAgICAgICAgaGVhZGVyczogeyBuYW1lOiBjbGFzc05hbWUgfVxuICAgICAgfSk7XG4gICB9XG5cbiAgIHRoaXMuZ2V0UmVzZXJ2YXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Jlc2VydmF0aW9uJyk7XG4gICB9XG5cbiAgIHRoaXMucmVzZXJ2YXRlID0gZnVuY3Rpb24gKGFjdGlvbiwgY2xhc3NJZCkge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcmVzZXJ2YXRpb24nLCB7IGFjdGlvbiwgY2xhc3NJZCB9KTtcbiAgIH1cblxuICAgdGhpcy5nZXRUcmFpbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmFpbmVycycpO1xuICAgfVxuXG4gICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKENsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3NwZWNpYWxDbGFzc2VzJywgQ2xhc3MpXG4gICB9XG5cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG5ld0NsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zcGVjaWFsQ2xhc3NlcycsIG5ld0NsYXNzKTtcbiAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCl7XG5cdGNvbnN0IHN2YyA9IHRoaXM7XG5cdFxuXHRzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb25zJywge1xuXHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0cGFzc3dvcmQ6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1xuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gdmFsLmRhdGE7XG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKTtcblx0XHR9KTtcblx0fVxuXG5cdHN2Yy5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5hdXRoID0ge307XG5cdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gJyc7XG5cdH07XG5cdFxuXHRzdmMuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKFVzZXIpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXJzJywgVXNlcilcblx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbihVc2VyLmVtYWlsLCBVc2VyLnBhc3N3b3JkKTtcblx0XHR9KTtcblx0fVxufSk7XG4iXX0=
