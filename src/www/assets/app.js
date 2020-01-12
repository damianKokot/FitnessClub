let app = angular.module('app', [
		'ngRoute'
	]);
const staticObj = {
	oldClass: {}
};
angular.module('app')
.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when('/', { controller: 'HomeCtrl', templateUrl: 'home.html' })
	.when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html'})
	.when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html'})
	.when('/classes', { controller: 'ClassesCtrl', templateUrl: './classes/classes.html'})
	.when('/classes/edit', { controller: 'ClassesCtrl', templateUrl: './classes/classesEdit.html'})
	.when('/classes/showSpecial', { controller: 'SpecialClassesCtrl', templateUrl: './classes/showSpecial.html'})
	.when('/classes/editSpecial', { controller: 'SpecialClassesEditCtrl', templateUrl: './classes/editSpecial.html'})
	.when('/myinfo', { controller: 'MyDataCtrl', templateUrl: './users/myinfo.html'})
	.when('/editdata', { controller: 'EditDataCtrl', templateUrl: './users/editdata.html'})
	.when('/listusers', { controller: 'ListUsersCtrl', templateUrl: './users/listusers.html'})
}]);
angular.module('app')
.controller('ApplicationCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.$on('login', function(_, user){
		user.name = user.firstname + " " + user.lastname;
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
}]);
angular.module('app')
.controller('HomeCtrl', function () {
   showPhotos();
});

function showPhotos() {
   const slides = document.querySelectorAll('.mySlide');
   let slideIdx = 1;

   setInterval(() => {
      display(slides, slideIdx);
      slideIdx = (slideIdx + 1) % slides.length;
   }, 3000);


}

function display(slides, index) {
   const last = (index + slides.length - 1) % slides.length;
   
   slides[last].classList.add('hidden');
   slides[index].classList.remove('hidden');
}

angular.module('app')
.controller('ListUsersCtrl', ["$scope", "ListUsersSvc", function ($scope, ListUsersSvc) {
  
    ListUsersSvc.fetch().success(function(data) {
        $scope.data = data;
        console.log(data);
    });
    
    $scope.editAsAdmin = function(User) {
		staticObj.user = User;
		staticObj.oldUser = Object.assign({}, User);
		window.location.assign("/#/editdata");
	}
}]);
angular.module('app')
.controller('LoginCtrl', ["$scope", "UserSvc", function($scope, UserSvc){
	$scope.login = function(email, password){
		UserSvc.login(email, password)
		.then(function(response){
			$scope.$emit('login', response.data); 
			staticObj.name = response.data.firstname + " " + response.data.lastname;
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

	$scope.edit = function (User) {
		staticObj.user = User;
		staticObj.oldUser = Object.assign({}, User);
		window.location.assign("/#/editdata");
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
   SpecialClassesSvc.fetch(staticObj.classId)
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
   
   svc.getUser = function(email) {
      return $http({
         method: 'GET',
         url: '/api/users',
         headers: { email: email }
      });
   }

   svc.update = function (data){
      return $http.put('/api/users', data)
      .then(function(res) {
         $http.defaults.headers.common['X-Auth'] = res.data;
         return svc.getUser(data.email);
      })
   }
}]);
angular.module('app')
.service('ListUsersSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/listusers');
   }
}]);
angular.module('app')
.service('MyDataSvc', ["$http", function ($http) {
   this.fetch = function () {
      return $http.get('/api/users');
   }
}]);
angular.module('app')
.service('SpecialClassesSvc', ["$http", function ($http) {
   this.fetch = function (classId) {
      return $http({
         method: 'GET',
         url: '/api/specialClasses',
         headers: { id: classId }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2FwcGxpY2F0aW9uLmN0cmwuanMiLCJjb250cm9sbGVycy9jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9lZGl0ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZS5jdHJsLmpzIiwiY29udHJvbGxlcnMvbGlzdHVzZXJzLmN0cmwuanMiLCJjb250cm9sbGVycy9sb2dpbi5jdHJsLmpzIiwiY29udHJvbGxlcnMvbXlkYXRhLmN0cmwuanMiLCJjb250cm9sbGVycy9yZWdpc3Rlci5jdHJsLmpzIiwiY29udHJvbGxlcnMvc3BlY2lhbC5jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9zcGVjaWFsLmNsYXNzZXMuZWRpdC5jdHJsLmpzIiwic2VydmljZXMvY2xhc3Nlcy5zdmMuanMiLCJzZXJ2aWNlcy9lZGl0ZGF0YS5zdmMuanMiLCJzZXJ2aWNlcy9saXN0dXNlcnMuc3ZjLmpzIiwic2VydmljZXMvbXlkYXRhLnN2Yy5qcyIsInNlcnZpY2VzL3NwZWNpYWwuY2xhc3Nlcy5zdmMuanMiLCJzZXJ2aWNlcy91c2VyLnN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLE1BQUEsUUFBQSxPQUFBLE9BQUE7RUFDQTs7QUFFQSxNQUFBLFlBQUE7Q0FDQSxVQUFBOztBQ0pBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxLQUFBLEVBQUEsWUFBQSxZQUFBLGFBQUE7RUFDQSxLQUFBLGFBQUEsRUFBQSxZQUFBLGdCQUFBLGFBQUE7RUFDQSxLQUFBLFVBQUEsRUFBQSxZQUFBLGFBQUEsYUFBQTtFQUNBLEtBQUEsWUFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBO0VBQ0EsS0FBQSxpQkFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBO0VBQ0EsS0FBQSx3QkFBQSxFQUFBLFlBQUEsc0JBQUEsYUFBQTtFQUNBLEtBQUEsd0JBQUEsRUFBQSxZQUFBLDBCQUFBLGFBQUE7RUFDQSxLQUFBLFdBQUEsRUFBQSxZQUFBLGNBQUEsYUFBQTtFQUNBLEtBQUEsYUFBQSxFQUFBLFlBQUEsZ0JBQUEsYUFBQTtFQUNBLEtBQUEsY0FBQSxFQUFBLFlBQUEsaUJBQUEsYUFBQTs7QUNaQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxRQUFBO0NBQ0EsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLEtBQUE7RUFDQSxLQUFBLE9BQUEsS0FBQSxZQUFBLE1BQUEsS0FBQTtFQUNBLE9BQUEsY0FBQTs7O0NBR0EsT0FBQSxTQUFBLFVBQUE7RUFDQSxPQUFBLGNBQUE7RUFDQSxRQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7OztBQ1ZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsd0NBQUEsVUFBQSxRQUFBLFlBQUE7Q0FDQSxXQUFBO0VBQ0EsUUFBQSxTQUFBLFNBQUE7RUFDQSxPQUFBLFVBQUE7O0NBRUEsT0FBQSxRQUFBLFVBQUE7O0NBRUEsT0FBQSxjQUFBLFNBQUEsTUFBQTtFQUNBLFVBQUEsWUFBQTtFQUNBLFVBQUEsVUFBQSxPQUFBLFFBQUEsS0FBQSw0QkFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBOzs7Q0FHQSxPQUFBLE9BQUEsU0FBQSxPQUFBO0VBQ0EsVUFBQSxRQUFBO0VBQ0EsVUFBQSxXQUFBLE9BQUEsT0FBQSxJQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7OztDQUdBLE9BQUEsT0FBQSxVQUFBLE1BQUEsYUFBQSxVQUFBO0VBQ0EsSUFBQSxLQUFBLFVBQUEsVUFBQSxjQUFBLE1BQUE7R0FDQSxJQUFBLEtBQUEsVUFBQSxVQUFBLGNBQUEsS0FBQSxVQUFBLE9BQUEsUUFBQTtJQUNBLFdBQUEsT0FBQTtLQUNBLE1BQUEsYUFBQTtLQUNBLFNBQUEsVUFBQSxTQUFBOzs7R0FHQSxVQUFBLFdBQUE7R0FDQSxPQUFBLFNBQUEsT0FBQTtTQUNBO0dBQ0EsV0FBQSxPQUFBO0lBQ0EsTUFBQSxhQUFBO01BQ0EsUUFBQTs7Ozs7OztBQ2pDQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLDBDQUFBLFVBQUEsUUFBQSxhQUFBO0NBQ0EsT0FBQSxPQUFBLFVBQUEsV0FBQSxVQUFBLE9BQUEsV0FBQSxhQUFBLGFBQUE7RUFDQSxZQUFBLE9BQUE7R0FDQTtHQUNBO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7R0FDQSxVQUFBLFVBQUEsS0FBQTs7OztDQUlBLFlBQUEsUUFBQSxVQUFBLEtBQUE7RUFDQSxLQUFBLFNBQUEsS0FBQTtFQUNBLFFBQUEsSUFBQSxJQUFBO0VBQ0EsT0FBQSxPQUFBLElBQUE7OztBQ2pCQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLFlBQUEsWUFBQTtHQUNBOzs7QUFHQSxTQUFBLGFBQUE7R0FDQSxNQUFBLFNBQUEsU0FBQSxpQkFBQTtHQUNBLElBQUEsV0FBQTs7R0FFQSxZQUFBOzs7TUFHQTs7Ozs7QUFLQSxTQUFBLFFBQUEsUUFBQSxPQUFBO0dBQ0EsTUFBQSxPQUFBLENBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQSxPQUFBOztHQUVBLE9BQUEsTUFBQSxVQUFBLElBQUE7R0FDQSxPQUFBLE9BQUEsVUFBQSxPQUFBOzs7QUNyQkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSw0Q0FBQSxVQUFBLFFBQUEsY0FBQTs7SUFFQSxhQUFBLFFBQUEsUUFBQSxTQUFBLE1BQUE7UUFDQSxPQUFBLE9BQUE7UUFDQSxRQUFBLElBQUE7OztJQUdBLE9BQUEsY0FBQSxTQUFBLE1BQUE7RUFDQSxVQUFBLE9BQUE7RUFDQSxVQUFBLFVBQUEsT0FBQSxPQUFBLElBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQTs7O0FDWEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxtQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsUUFBQSxTQUFBLE9BQUEsU0FBQTtFQUNBLFFBQUEsTUFBQSxPQUFBO0dBQ0EsS0FBQSxTQUFBLFNBQUE7R0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBO0dBQ0EsVUFBQSxPQUFBLFNBQUEsS0FBQSxZQUFBLE1BQUEsU0FBQSxLQUFBO0tBQ0EsS0FBQSxXQUFBO0dBQ0EsT0FBQSxTQUFBLE9BQUE7OztDQUdBLE9BQUEsTUFBQSxtQkFBQTs7QUNYQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHNDQUFBLFVBQUEsUUFBQSxXQUFBO0NBQ0EsVUFBQSxRQUFBLFFBQUEsU0FBQSxNQUFBO0VBQ0EsT0FBQSxPQUFBOzs7Q0FHQSxPQUFBLE9BQUEsVUFBQSxNQUFBO0VBQ0EsVUFBQSxPQUFBO0VBQ0EsVUFBQSxVQUFBLE9BQUEsT0FBQSxJQUFBO0VBQ0EsT0FBQSxTQUFBLE9BQUE7OztBQ1RBLFFBQUEsT0FBQTtDQUNBLFdBQUEsc0NBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLFdBQUEsVUFBQSxXQUFBLFVBQUEsT0FBQSxXQUFBLFVBQUEsZ0JBQUE7O0VBRUEsR0FBQSxhQUFBLGlCQUFBO0dBQ0EsUUFBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBLEtBQUEsU0FBQSxTQUFBO0tBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTtNQUNBLEtBQUEsWUFBQTtJQUNBLE9BQUEsU0FBQSxPQUFBOzs7R0FHQSxTQUFBLGlCQUFBLFNBQUEsR0FBQSxrQkFBQTtTQUNBO0dBQ0EsU0FBQSxpQkFBQSxTQUFBLEdBQUEsa0JBQUE7Ozs7O0FDbkJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsc0RBQUEsVUFBQSxRQUFBLG1CQUFBO0dBQ0Esa0JBQUEsTUFBQSxVQUFBO0lBQ0EsUUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLFVBQUEsUUFBQSxJQUFBOzs7U0FHQSxLQUFBOzs7R0FHQSxPQUFBLE9BQUEsU0FBQSxPQUFBO01BQ0EsVUFBQSxRQUFBO01BQ0EsVUFBQSxXQUFBLE9BQUEsT0FBQSxJQUFBO01BQ0EsT0FBQSxTQUFBLE9BQUE7OztHQUdBLE9BQUEsY0FBQSxXQUFBO01BQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxTQUFBO01BQ0EsTUFBQSxTQUFBLENBQUEsT0FBQSxVQUFBLFNBQUEsZUFBQSxXQUFBOztNQUVBLGtCQUFBLFVBQUEsU0FBQSxPQUFBLFFBQUE7T0FDQSxRQUFBLFNBQUEsUUFBQTtTQUNBLEdBQUEsT0FBQSxHQUFBLEdBQUEsSUFBQTtZQUNBLE9BQUEsVUFBQSxPQUFBO2dCQUNBO1lBQ0EsTUFBQTs7Ozs7O0FDekJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsMERBQUEsVUFBQSxRQUFBLG1CQUFBO0dBQ0Esa0JBQUE7SUFDQSxRQUFBLFNBQUEsVUFBQTtNQUNBLE9BQUEsV0FBQTs7R0FFQSxPQUFBLFFBQUEsVUFBQTs7R0FFQSxPQUFBLE9BQUEsVUFBQSxPQUFBLGFBQUEsa0JBQUE7TUFDQSxJQUFBLEtBQUEsVUFBQSxVQUFBLGNBQUEsTUFBQTtTQUNBLElBQUEsS0FBQSxVQUFBLFVBQUEsY0FBQSxLQUFBLFVBQUEsT0FBQSxRQUFBO1lBQ0Esa0JBQUEsT0FBQTtlQUNBLFdBQUEsT0FBQSxTQUFBLEtBQUEscUNBQUE7ZUFDQSxXQUFBLFVBQUE7ZUFDQSxPQUFBLENBQUEsUUFBQSxPQUFBLFFBQUEsS0FBQTtlQUNBO2VBQ0EsSUFBQSxVQUFBLFNBQUE7OztTQUdBLFVBQUEsV0FBQTtTQUNBLE9BQUEsU0FBQSxPQUFBO2FBQ0E7U0FDQSxrQkFBQSxPQUFBO1lBQ0EsV0FBQSxPQUFBLFNBQUEsS0FBQSxxQ0FBQTtZQUNBLFNBQUEsVUFBQTtZQUNBLE9BQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0E7WUFDQSxRQUFBOztZQUVBLE1BQUE7Ozs7Ozs7QUM3QkEsUUFBQSxPQUFBO0NBQ0EsUUFBQSx3QkFBQSxVQUFBLE9BQUE7R0FDQSxLQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7R0FHQSxLQUFBLFNBQUEsU0FBQSxjQUFBO01BQ0EsT0FBQSxNQUFBLElBQUEsZ0JBQUE7OztHQUdBLEtBQUEsU0FBQSxVQUFBLFVBQUE7TUFDQSxPQUFBLE1BQUEsS0FBQSxnQkFBQTs7O0FDWEEsUUFBQSxPQUFBO0NBQ0EsUUFBQSx5QkFBQSxVQUFBLE9BQUE7R0FDQSxNQUFBLE1BQUE7O0dBRUEsSUFBQSxVQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsTUFBQTtTQUNBLFFBQUE7U0FDQSxLQUFBO1NBQ0EsU0FBQSxFQUFBLE9BQUE7Ozs7R0FJQSxJQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsT0FBQSxNQUFBLElBQUEsY0FBQTtPQUNBLEtBQUEsU0FBQSxLQUFBO1NBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLElBQUE7U0FDQSxPQUFBLElBQUEsUUFBQSxLQUFBOzs7O0FDaEJBLFFBQUEsT0FBQTtDQUNBLFFBQUEsMEJBQUEsVUFBQSxPQUFBO0dBQ0EsS0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQTs7O0FDSEEsUUFBQSxPQUFBO0NBQ0EsUUFBQSx1QkFBQSxVQUFBLE9BQUE7R0FDQSxLQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7QUNIQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLCtCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxVQUFBLFNBQUE7TUFDQSxPQUFBLE1BQUE7U0FDQSxRQUFBO1NBQ0EsS0FBQTtTQUNBLFNBQUEsRUFBQSxJQUFBOzs7O0dBSUEsS0FBQSxrQkFBQSxXQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7OztHQUdBLEtBQUEsWUFBQSxVQUFBLFFBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLG9CQUFBLEVBQUEsUUFBQTs7O0dBR0EsS0FBQSxjQUFBLFdBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQTs7O0dBR0EsS0FBQSxTQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBLHVCQUFBOzs7R0FHQSxLQUFBLFNBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxNQUFBLEtBQUEsdUJBQUE7OztBQzNCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHFCQUFBLFNBQUEsTUFBQTtDQUNBLE1BQUEsTUFBQTs7Q0FFQSxJQUFBLFVBQUEsVUFBQTtFQUNBLE9BQUEsTUFBQSxJQUFBOzs7Q0FHQSxJQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtHQUNBLE9BQUE7R0FDQSxVQUFBO0tBQ0EsS0FBQSxTQUFBLElBQUE7R0FDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsSUFBQTtHQUNBLE9BQUEsSUFBQTs7OztDQUlBLElBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7Q0FHQSxJQUFBLGFBQUEsU0FBQSxLQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtHQUNBLEtBQUEsVUFBQTtHQUNBLE9BQUEsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG5cdFx0J25nUm91dGUnXG5cdF0pO1xuY29uc3Qgc3RhdGljT2JqID0ge1xuXHRvbGRDbGFzczoge31cbn07IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcblx0JHJvdXRlUHJvdmlkZXJcblx0LndoZW4oJy8nLCB7IGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyB9KVxuXHQud2hlbignL3JlZ2lzdGVyJywgeyBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJywgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJ30pXG5cdC53aGVuKCcvbG9naW4nLCB7IGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLCB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzJywgeyBjb250cm9sbGVyOiAnQ2xhc3Nlc0N0cmwnLCB0ZW1wbGF0ZVVybDogJy4vY2xhc3Nlcy9jbGFzc2VzLmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzL2VkaXQnLCB7IGNvbnRyb2xsZXI6ICdDbGFzc2VzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL2NsYXNzZXNFZGl0Lmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzL3Nob3dTcGVjaWFsJywgeyBjb250cm9sbGVyOiAnU3BlY2lhbENsYXNzZXNDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvc2hvd1NwZWNpYWwuaHRtbCd9KVxuXHQud2hlbignL2NsYXNzZXMvZWRpdFNwZWNpYWwnLCB7IGNvbnRyb2xsZXI6ICdTcGVjaWFsQ2xhc3Nlc0VkaXRDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvZWRpdFNwZWNpYWwuaHRtbCd9KVxuXHQud2hlbignL215aW5mbycsIHsgY29udHJvbGxlcjogJ015RGF0YUN0cmwnLCB0ZW1wbGF0ZVVybDogJy4vdXNlcnMvbXlpbmZvLmh0bWwnfSlcblx0LndoZW4oJy9lZGl0ZGF0YScsIHsgY29udHJvbGxlcjogJ0VkaXREYXRhQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi91c2Vycy9lZGl0ZGF0YS5odG1sJ30pXG5cdC53aGVuKCcvbGlzdHVzZXJzJywgeyBjb250cm9sbGVyOiAnTGlzdFVzZXJzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi91c2Vycy9saXN0dXNlcnMuaHRtbCd9KVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKXtcblx0XHR1c2VyLm5hbWUgPSB1c2VyLmZpcnN0bmFtZSArIFwiIFwiICsgdXNlci5sYXN0bmFtZTtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuXHR9KTtcblx0XG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cdFx0VXNlclN2Yy5sb2dvdXQoKVxuXHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8jLycpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignQ2xhc3Nlc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBDbGFzc2VzU3ZjKSB7XG5cdENsYXNzZXNTdmMuZmV0Y2goKVxuXHQuc3VjY2VzcyhmdW5jdGlvbihjbGFzc2VzKSB7XG5cdFx0JHNjb3BlLmNsYXNzZXMgPSBjbGFzc2VzO1xuXHR9KTtcblx0JHNjb3BlLmNsYXNzID0gc3RhdGljT2JqLmNsYXNzO1xuXHRcblx0JHNjb3BlLnNob3dTcGVjaWFsID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdHN0YXRpY09iai5jbGFzc05hbWUgPSBuYW1lO1xuXHRcdHN0YXRpY09iai5jbGFzc0lkID0gJHNjb3BlLmNsYXNzZXMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSkuaWQ7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvc2hvd1NwZWNpYWxcIik7XG5cdH1cblx0XG5cdCRzY29wZS5lZGl0ID0gZnVuY3Rpb24oQ2xhc3MpIHtcblx0XHRzdGF0aWNPYmouY2xhc3MgPSBDbGFzcztcblx0XHRzdGF0aWNPYmoub2xkQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBDbGFzcyk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvZWRpdFwiKTtcblx0fVxuXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKG5hbWUsIGRlc2NyaXB0aW9uLCBkdXJhdGlvbikge1xuXHRcdGlmIChKU09OLnN0cmluZ2lmeShzdGF0aWNPYmoub2xkQ2xhc3MpICE9PSAne30nKSB7XG5cdFx0XHRpZiAoSlNPTi5zdHJpbmdpZnkoc3RhdGljT2JqLm9sZENsYXNzKSAhPT0gSlNPTi5zdHJpbmdpZnkoJHNjb3BlLmNsYXNzKSkge1xuXHRcdFx0XHRDbGFzc2VzU3ZjLnVwZGF0ZSh7XG5cdFx0XHRcdFx0bmFtZSwgZGVzY3JpcHRpb24sIGR1cmF0aW9uLCBcblx0XHRcdFx0XHRvbGROYW1lOiBzdGF0aWNPYmoub2xkQ2xhc3MubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0c3RhdGljT2JqLm9sZENsYXNzID0ge307XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlc1wiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Q2xhc3Nlc1N2Yy5jcmVhdGUoe1xuXHRcdFx0XHRuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb25cblx0XHRcdH0pLnN1Y2Nlc3MoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlc1wiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignRWRpdERhdGFDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRWRpdERhdGFTdmMpIHtcblx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoZmlyc3RuYW1lLCBsYXN0bmFtZSwgZW1haWwsIHRlbGVwaG9uZSwgcGVybWlzc2lvbnMsIGRlc2NyaXB0aW9uKSB7XG5cdFx0RWRpdERhdGFTdmMudXBkYXRlKHtcblx0XHRcdGZpcnN0bmFtZSwgXG5cdFx0XHRsYXN0bmFtZSwgXG5cdFx0XHRlbWFpbCwgXG5cdFx0XHR0ZWxlcGhvbmUsIFxuXHRcdFx0cGVybWlzc2lvbnMsXG5cdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdG9sZEVtYWlsOiBzdGF0aWNPYmoudXNlci5lbWFpbFxuXHRcdH0pXG4gICAgfTtcbiAgICBcblx0RWRpdERhdGFTdmMuZ2V0VXNlcihzdGF0aWNPYmoudXNlci5lbWFpbClcblx0LnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0Y29uc29sZS5sb2cocmVzLmRhdGEpXG5cdFx0JHNjb3BlLmRhdGEgPSByZXMuZGF0YTtcblx0fSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uICgpIHtcbiAgIHNob3dQaG90b3MoKTtcbn0pO1xuXG5mdW5jdGlvbiBzaG93UGhvdG9zKCkge1xuICAgY29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm15U2xpZGUnKTtcbiAgIGxldCBzbGlkZUlkeCA9IDE7XG5cbiAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGRpc3BsYXkoc2xpZGVzLCBzbGlkZUlkeCk7XG4gICAgICBzbGlkZUlkeCA9IChzbGlkZUlkeCArIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgIH0sIDMwMDApO1xuXG5cbn1cblxuZnVuY3Rpb24gZGlzcGxheShzbGlkZXMsIGluZGV4KSB7XG4gICBjb25zdCBsYXN0ID0gKGluZGV4ICsgc2xpZGVzLmxlbmd0aCAtIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgIFxuICAgc2xpZGVzW2xhc3RdLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgc2xpZGVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0xpc3RVc2Vyc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBMaXN0VXNlcnNTdmMpIHtcbiAgXG4gICAgTGlzdFVzZXJzU3ZjLmZldGNoKCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5kYXRhID0gZGF0YTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgfSk7XG4gICAgXG4gICAgJHNjb3BlLmVkaXRBc0FkbWluID0gZnVuY3Rpb24oVXNlcikge1xuXHRcdHN0YXRpY09iai51c2VyID0gVXNlcjtcblx0XHRzdGF0aWNPYmoub2xkVXNlciA9IE9iamVjdC5hc3NpZ24oe30sIFVzZXIpO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9lZGl0ZGF0YVwiKTtcblx0fVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKXtcblx0XHRVc2VyU3ZjLmxvZ2luKGVtYWlsLCBwYXNzd29yZClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSk7IFxuXHRcdFx0c3RhdGljT2JqLm5hbWUgPSByZXNwb25zZS5kYXRhLmZpcnN0bmFtZSArIFwiIFwiICsgcmVzcG9uc2UuZGF0YS5sYXN0bmFtZTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvJyk7XG5cdFx0fSk7XG5cdH1cblx0JHNjb3BlLmxvZ2luKFwiYWRtaW5AYWRtaW4uY29tXCIsIFwiMTIzNFwiKTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ015RGF0YUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNeURhdGFTdmMpIHtcblx0TXlEYXRhU3ZjLmZldGNoKCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0JHNjb3BlLmRhdGEgPSBkYXRhO1xuXHR9KTtcblxuXHQkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uIChVc2VyKSB7XG5cdFx0c3RhdGljT2JqLnVzZXIgPSBVc2VyO1xuXHRcdHN0YXRpY09iai5vbGRVc2VyID0gT2JqZWN0LmFzc2lnbih7fSwgVXNlcik7XG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2VkaXRkYXRhXCIpO1xuXHR9IFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmUsIHBhc3N3b3JkLCByZXBlYXRfcGFzc3dvcmQpe1xuXHRcdFxuXHRcdGlmKHBhc3N3b3JkID09PSByZXBlYXRfcGFzc3dvcmQpIHtcblx0XHRcdFVzZXJTdmMuY3JlYXRlVXNlcih7XG5cdFx0XHRcdGZpcnN0bmFtZSxcblx0XHRcdFx0bGFzdG5hbWUsXG5cdFx0XHRcdGVtYWlsLFxuXHRcdFx0XHR0ZWxlcGhvbmUsXG5cdFx0XHRcdHBhc3N3b3JkXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXsgXG5cdFx0XHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvIy8nKTtcblx0XHRcdH0pXG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdLnNldEN1c3RvbVZhbGlkaXR5KFwiUGFzc3dvcmRzIERvbid0IE1hdGNoXCIpO1xuXHRcdH1cblx0fVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdTcGVjaWFsQ2xhc3Nlc0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBTcGVjaWFsQ2xhc3Nlc1N2Yykge1xuICAgU3BlY2lhbENsYXNzZXNTdmMuZmV0Y2goc3RhdGljT2JqLmNsYXNzSWQpXG4gICAuc3VjY2VzcyhmdW5jdGlvbihjbGFzc2VzKSB7XG4gICAgICAkc2NvcGUuY2xhc3NlcyA9IGNsYXNzZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgaXRlbS5zdGFydCA9IGl0ZW0uc3RhcnQuc2xpY2UoMCwgMTYpO1xuICAgICAgICAgcmV0dXJuIGl0ZW07IFxuICAgICAgfSkuc29ydChpdGVtID0+IGl0ZW0ucmVzZXJ2ZWQpO1xuICAgfSk7XG4gICBcbiAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24oQ2xhc3MpIHtcbiAgICAgIHN0YXRpY09iai5jbGFzcyA9IENsYXNzO1xuICAgICAgc3RhdGljT2JqLm9sZENsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgQ2xhc3MpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvY2xhc3Nlcy9lZGl0U3BlY2lhbCcpO1xuICAgfVxuXG4gICAkc2NvcGUucmVzZXJ2YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHdpbmRvdy5teUJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29sbGFwc2VkXCIpKT8gXCJhc3NpZ25cIiA6IFwidW5Bc3NpZ25cIjsgXG4gICAgICBcbiAgICAgIFNwZWNpYWxDbGFzc2VzU3ZjLnJlc2VydmF0ZShhY3Rpb24sIChidXR0b24udGl0bGUgKiAxKSlcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgaWYoc3RhdHVzWzBdWzBdLk9LKSB7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIkplc3RlxZsganXFvCB6YXBpc2FueSB3IHR5bSBjemFzaWUgZG8gemFqxJnEh1wiKVxuICAgICAgICAgfVxuICAgICAgfSlcbiAgIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignU3BlY2lhbENsYXNzZXNFZGl0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFNwZWNpYWxDbGFzc2VzU3ZjKSB7XG4gICBTcGVjaWFsQ2xhc3Nlc1N2Yy5nZXRUcmFpbmVycygpXG4gICAuc3VjY2VzcyhmdW5jdGlvbih0cmFpbmVycykge1xuICAgICAgJHNjb3BlLnRyYWluZXJzID0gdHJhaW5lcnM7XG4gICB9KTtcbiAgICRzY29wZS5jbGFzcyA9IHN0YXRpY09iai5jbGFzcztcblxuICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoc3RhcnQsIHRyYWluZXJOYW1lLCBtYXhfcGFydGljaXBhbnRzKSB7ICAgICAgXG4gICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoc3RhdGljT2JqLm9sZENsYXNzKSAhPT0gJ3t9Jykge1xuICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHN0YXRpY09iai5vbGRDbGFzcykgIT09IEpTT04uc3RyaW5naWZ5KCRzY29wZS5jbGFzcykpIHtcbiAgICAgICAgICAgIFNwZWNpYWxDbGFzc2VzU3ZjLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICB0cmFpbmVySWQ6ICRzY29wZS50cmFpbmVycy5maW5kKChpdGVtKSA9PiBpdGVtLm5hbWUgPT09IHRyYWluZXJOYW1lKS5pZCwgXG4gICAgICAgICAgICAgICBjbGFzc05hbWU6IHN0YXRpY09iai5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICBzdGFydDogKHN0YXJ0ICsgXCI6MDBcIikucmVwbGFjZShcIlRcIiwgXCIgXCIpLCBcbiAgICAgICAgICAgICAgIG1heF9wYXJ0aWNpcGFudHMsXG4gICAgICAgICAgICAgICBpZDogc3RhdGljT2JqLm9sZENsYXNzLmlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgfVxuICAgICAgICAgc3RhdGljT2JqLm9sZENsYXNzID0ge307XG4gICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlcy9zaG93U3BlY2lhbFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBTcGVjaWFsQ2xhc3Nlc1N2Yy5jcmVhdGUoe1xuICAgICAgICAgICAgdHJhaW5lcklkOiAkc2NvcGUudHJhaW5lcnMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lID09PSB0cmFpbmVyTmFtZSkuaWQsIFxuICAgICAgICAgICAgY2xhc3NJZDogc3RhdGljT2JqLmNsYXNzSWQsXG4gICAgICAgICAgICBzdGFydDogKHN0YXJ0ICsgXCI6MDBcIikucmVwbGFjZShcIlRcIiwgXCIgXCIpLCBcbiAgICAgICAgICAgIG1heF9wYXJ0aWNpcGFudHNcbiAgICAgICAgIH0pLnN1Y2Nlc3MoKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvc2hvd1NwZWNpYWxcIik7XG4gICAgICAgICB9KS5jYXRjaCgocmVhc29uKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUFTT046IFwiLCByZWFzb24pXG4gICAgICAgICB9KTtcbiAgICAgIH1cbiAgIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ0NsYXNzZXNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NsYXNzZXMnKTtcbiAgIH1cblxuICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbih1cGRhdGVkQ2xhc3MpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvY2xhc3NlcycsIHVwZGF0ZWRDbGFzcyk7XG4gICB9XG5cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG5ld0NsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jbGFzc2VzJywgbmV3Q2xhc3MpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnRWRpdERhdGFTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIGNvbnN0IHN2YyA9IHRoaXM7XG4gICBcbiAgIHN2Yy5nZXRVc2VyID0gZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgdXJsOiAnL2FwaS91c2VycycsXG4gICAgICAgICBoZWFkZXJzOiB7IGVtYWlsOiBlbWFpbCB9XG4gICAgICB9KTtcbiAgIH1cblxuICAgc3ZjLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKXtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdXNlcnMnLCBkYXRhKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoJ10gPSByZXMuZGF0YTtcbiAgICAgICAgIHJldHVybiBzdmMuZ2V0VXNlcihkYXRhLmVtYWlsKTtcbiAgICAgIH0pXG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdMaXN0VXNlcnNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2xpc3R1c2VycycpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnTXlEYXRhU3ZjJywgZnVuY3Rpb24gKCRodHRwKSB7XG4gICB0aGlzLmZldGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnU3BlY2lhbENsYXNzZXNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoY2xhc3NJZCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICB1cmw6ICcvYXBpL3NwZWNpYWxDbGFzc2VzJyxcbiAgICAgICAgIGhlYWRlcnM6IHsgaWQ6IGNsYXNzSWQgfVxuICAgICAgfSk7XG4gICB9XG5cbiAgIHRoaXMuZ2V0UmVzZXJ2YXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Jlc2VydmF0aW9uJyk7XG4gICB9XG5cbiAgIHRoaXMucmVzZXJ2YXRlID0gZnVuY3Rpb24gKGFjdGlvbiwgY2xhc3NJZCkge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcmVzZXJ2YXRpb24nLCB7IGFjdGlvbiwgY2xhc3NJZCB9KTtcbiAgIH1cblxuICAgdGhpcy5nZXRUcmFpbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90cmFpbmVycycpO1xuICAgfVxuXG4gICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKENsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3NwZWNpYWxDbGFzc2VzJywgQ2xhc3MpXG4gICB9XG5cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG5ld0NsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zcGVjaWFsQ2xhc3NlcycsIG5ld0NsYXNzKTtcbiAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCl7XG5cdGNvbnN0IHN2YyA9IHRoaXM7XG5cdFxuXHRzdmMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb25zJywge1xuXHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0cGFzc3dvcmQ6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1xuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gdmFsLmRhdGE7XG5cdFx0XHRyZXR1cm4gc3ZjLmdldFVzZXIoKTtcblx0XHR9KTtcblx0fVxuXG5cdHN2Yy5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5hdXRoID0ge307XG5cdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aCddID0gJyc7XG5cdH07XG5cdFxuXHRzdmMuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKFVzZXIpe1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXJzJywgVXNlcilcblx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN2Yy5sb2dpbihVc2VyLmVtYWlsLCBVc2VyLnBhc3N3b3JkKTtcblx0XHR9KTtcblx0fVxufSk7XG4iXX0=
