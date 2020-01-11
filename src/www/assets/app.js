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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsInJvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2FwcGxpY2F0aW9uLmN0cmwuanMiLCJjb250cm9sbGVycy9jbGFzc2VzLmN0cmwuanMiLCJjb250cm9sbGVycy9lZGl0ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZS5jdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW4uY3RybC5qcyIsImNvbnRyb2xsZXJzL215ZGF0YS5jdHJsLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXIuY3RybC5qcyIsImNvbnRyb2xsZXJzL3NwZWNpYWwuY2xhc3Nlcy5jdHJsLmpzIiwiY29udHJvbGxlcnMvc3BlY2lhbC5jbGFzc2VzLmVkaXQuY3RybC5qcyIsInNlcnZpY2VzL2NsYXNzZXMuc3ZjLmpzIiwic2VydmljZXMvZWRpdGRhdGEuc3ZjLmpzIiwic2VydmljZXMvbXlkYXRhLnN2Yy5qcyIsInNlcnZpY2VzL3NwZWNpYWwuY2xhc3Nlcy5zdmMuanMiLCJzZXJ2aWNlcy91c2VyLnN2Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLE1BQUEsUUFBQSxPQUFBLE9BQUE7RUFDQTs7QUFFQSxNQUFBLFlBQUE7Q0FDQSxVQUFBOztBQ0pBLFFBQUEsT0FBQTtDQUNBLDBCQUFBLFNBQUEsZUFBQTtDQUNBO0VBQ0EsS0FBQSxLQUFBLEVBQUEsWUFBQSxZQUFBLGFBQUE7RUFDQSxLQUFBLGFBQUEsRUFBQSxZQUFBLGdCQUFBLGFBQUE7RUFDQSxLQUFBLFVBQUEsRUFBQSxZQUFBLGFBQUEsYUFBQTtFQUNBLEtBQUEsWUFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBO0VBQ0EsS0FBQSxpQkFBQSxFQUFBLFlBQUEsZUFBQSxhQUFBO0VBQ0EsS0FBQSx3QkFBQSxFQUFBLFlBQUEsc0JBQUEsYUFBQTtFQUNBLEtBQUEsd0JBQUEsRUFBQSxZQUFBLDBCQUFBLGFBQUE7RUFDQSxLQUFBLFdBQUEsRUFBQSxZQUFBLGNBQUEsYUFBQTtFQUNBLEtBQUEsYUFBQSxFQUFBLFlBQUEsZ0JBQUEsYUFBQTs7QUNYQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHlDQUFBLFNBQUEsUUFBQSxRQUFBO0NBQ0EsT0FBQSxJQUFBLFNBQUEsU0FBQSxHQUFBLEtBQUE7RUFDQSxPQUFBLGNBQUE7OztDQUdBLE9BQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxjQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBOzs7QUNUQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHdDQUFBLFVBQUEsUUFBQSxZQUFBO0NBQ0EsV0FBQTtFQUNBLFFBQUEsU0FBQSxTQUFBO0VBQ0EsT0FBQSxVQUFBOztDQUVBLE9BQUEsUUFBQSxVQUFBOztDQUVBLE9BQUEsY0FBQSxTQUFBLE1BQUE7RUFDQSxVQUFBLFlBQUE7RUFDQSxVQUFBLFVBQUEsT0FBQSxRQUFBLEtBQUEsNEJBQUE7RUFDQSxPQUFBLFNBQUEsT0FBQTs7O0NBR0EsT0FBQSxPQUFBLFNBQUEsT0FBQTtFQUNBLFVBQUEsUUFBQTtFQUNBLFVBQUEsV0FBQSxPQUFBLE9BQUEsSUFBQTtFQUNBLE9BQUEsU0FBQSxPQUFBOzs7Q0FHQSxPQUFBLE9BQUEsVUFBQSxNQUFBLGFBQUEsVUFBQTtFQUNBLElBQUEsS0FBQSxVQUFBLFVBQUEsY0FBQSxNQUFBO0dBQ0EsSUFBQSxLQUFBLFVBQUEsVUFBQSxjQUFBLEtBQUEsVUFBQSxPQUFBLFFBQUE7SUFDQSxXQUFBLE9BQUE7S0FDQSxNQUFBLGFBQUE7S0FDQSxTQUFBLFVBQUEsU0FBQTs7O0dBR0EsVUFBQSxXQUFBO0dBQ0EsT0FBQSxTQUFBLE9BQUE7U0FDQTtHQUNBLFdBQUEsT0FBQTtJQUNBLE1BQUEsYUFBQTtNQUNBLFFBQUE7Ozs7Ozs7QUNqQ0EsUUFBQSxPQUFBO0NBQ0EsV0FBQSwwQ0FBQSxVQUFBLFFBQUEsYUFBQTtDQUNBLFlBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTtHQUNBLE9BQUEsT0FBQTs7O0NBR0EsT0FBQSxPQUFBLFVBQUEsV0FBQSxVQUFBLE9BQUEsV0FBQTtFQUNBLFlBQUEsT0FBQTtHQUNBLFdBQUEsVUFBQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7O0FDVEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxZQUFBLFlBQUE7R0FDQTs7O0FBR0EsU0FBQSxhQUFBO0dBQ0EsTUFBQSxTQUFBLFNBQUEsaUJBQUE7R0FDQSxJQUFBLFdBQUE7O0dBRUEsWUFBQTs7O01BR0E7Ozs7O0FBS0EsU0FBQSxRQUFBLFFBQUEsT0FBQTtHQUNBLE1BQUEsT0FBQSxDQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQTs7R0FFQSxPQUFBLE1BQUEsVUFBQSxJQUFBO0dBQ0EsT0FBQSxPQUFBLFVBQUEsT0FBQTs7O0FDckJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsbUNBQUEsU0FBQSxRQUFBLFFBQUE7Q0FDQSxPQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxRQUFBLE1BQUEsT0FBQTtHQUNBLEtBQUEsU0FBQSxTQUFBO0dBQ0EsT0FBQSxNQUFBLFNBQUEsU0FBQTtLQUNBLEtBQUEsV0FBQTtHQUNBLE9BQUEsU0FBQSxPQUFBOzs7Q0FHQSxPQUFBLE1BQUEsbUJBQUE7O0FDVkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxVQUFBLFFBQUEsV0FBQTtDQUNBLFVBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTtFQUNBLE9BQUEsT0FBQTs7O0FDSEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzQ0FBQSxTQUFBLFFBQUEsUUFBQTtDQUNBLE9BQUEsV0FBQSxVQUFBLFdBQUEsVUFBQSxPQUFBLFdBQUEsVUFBQSxnQkFBQTs7RUFFQSxHQUFBLGFBQUEsaUJBQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0EsS0FBQSxTQUFBLFNBQUE7S0FDQSxPQUFBLE1BQUEsU0FBQSxTQUFBO01BQ0EsS0FBQSxZQUFBO0lBQ0EsT0FBQSxTQUFBLE9BQUE7OztHQUdBLFNBQUEsaUJBQUEsU0FBQSxHQUFBLGtCQUFBO1NBQ0E7R0FDQSxTQUFBLGlCQUFBLFNBQUEsR0FBQSxrQkFBQTs7Ozs7QUNuQkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxzREFBQSxVQUFBLFFBQUEsbUJBQUE7R0FDQSxrQkFBQSxNQUFBLFVBQUE7SUFDQSxRQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsVUFBQSxRQUFBLElBQUE7OztTQUdBLEtBQUE7OztHQUdBLE9BQUEsT0FBQSxTQUFBLE9BQUE7TUFDQSxVQUFBLFFBQUE7TUFDQSxVQUFBLFdBQUEsT0FBQSxPQUFBLElBQUE7TUFDQSxPQUFBLFNBQUEsT0FBQTs7O0dBR0EsT0FBQSxjQUFBLFdBQUE7TUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLFNBQUE7TUFDQSxNQUFBLFNBQUEsQ0FBQSxPQUFBLFVBQUEsU0FBQSxlQUFBLFdBQUE7O01BRUEsa0JBQUEsVUFBQSxTQUFBLE9BQUEsUUFBQTtPQUNBLFFBQUEsU0FBQSxRQUFBO1NBQ0EsUUFBQSxJQUFBO1NBQ0EsR0FBQSxPQUFBLEdBQUEsR0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBLE9BQUE7Z0JBQ0E7WUFDQSxNQUFBOzs7Ozs7QUMxQkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSwwREFBQSxVQUFBLFFBQUEsbUJBQUE7R0FDQSxrQkFBQTtJQUNBLFFBQUEsU0FBQSxVQUFBO01BQ0EsT0FBQSxXQUFBOztHQUVBLE9BQUEsUUFBQSxVQUFBOztHQUVBLE9BQUEsT0FBQSxVQUFBLE9BQUEsYUFBQSxrQkFBQTtNQUNBLElBQUEsS0FBQSxVQUFBLFVBQUEsY0FBQSxNQUFBO1NBQ0EsSUFBQSxLQUFBLFVBQUEsVUFBQSxjQUFBLEtBQUEsVUFBQSxPQUFBLFFBQUE7WUFDQSxrQkFBQSxPQUFBO2VBQ0EsV0FBQSxPQUFBLFNBQUEsS0FBQSxxQ0FBQTtlQUNBLFdBQUEsVUFBQTtlQUNBLE9BQUEsQ0FBQSxRQUFBLE9BQUEsUUFBQSxLQUFBO2VBQ0E7ZUFDQSxJQUFBLFVBQUEsU0FBQTs7O1NBR0EsVUFBQSxXQUFBO1NBQ0EsT0FBQSxTQUFBLE9BQUE7YUFDQTtTQUNBLGtCQUFBLE9BQUE7WUFDQSxXQUFBLE9BQUEsU0FBQSxLQUFBLHFDQUFBO1lBQ0EsU0FBQSxVQUFBO1lBQ0EsT0FBQSxDQUFBLFFBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQTtZQUNBLFFBQUE7O1lBRUEsTUFBQTs7Ozs7OztBQzdCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHdCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxZQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7OztHQUdBLEtBQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQSxnQkFBQTs7O0dBR0EsS0FBQSxTQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLGdCQUFBOzs7QUNYQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHlCQUFBLFVBQUEsT0FBQTtHQUNBLE1BQUEsTUFBQTs7R0FFQSxJQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7R0FHQSxJQUFBLFVBQUEsV0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7R0FHQSxJQUFBLFNBQUEsVUFBQSxLQUFBO01BQ0EsT0FBQSxNQUFBLElBQUEsZUFBQTtPQUNBLEtBQUEsU0FBQSxLQUFBO1NBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBLElBQUE7U0FDQSxPQUFBLElBQUE7Ozs7QUNoQkEsUUFBQSxPQUFBO0NBQ0EsUUFBQSx1QkFBQSxVQUFBLE9BQUE7R0FDQSxLQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsTUFBQSxJQUFBOzs7QUNIQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLCtCQUFBLFVBQUEsT0FBQTtHQUNBLEtBQUEsUUFBQSxVQUFBLFdBQUE7TUFDQSxPQUFBLE1BQUE7U0FDQSxRQUFBO1NBQ0EsS0FBQTtTQUNBLFNBQUEsRUFBQSxNQUFBOzs7O0dBSUEsS0FBQSxrQkFBQSxXQUFBO01BQ0EsT0FBQSxNQUFBLElBQUE7OztHQUdBLEtBQUEsWUFBQSxVQUFBLFFBQUEsU0FBQTtNQUNBLE9BQUEsTUFBQSxLQUFBLG9CQUFBLEVBQUEsUUFBQTs7O0dBR0EsS0FBQSxjQUFBLFdBQUE7TUFDQSxPQUFBLE1BQUEsSUFBQTs7O0dBR0EsS0FBQSxTQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsTUFBQSxJQUFBLHVCQUFBOzs7R0FHQSxLQUFBLFNBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxNQUFBLEtBQUEsdUJBQUE7OztBQzNCQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLHFCQUFBLFNBQUEsTUFBQTtDQUNBLE1BQUEsTUFBQTs7Q0FFQSxJQUFBLFVBQUEsVUFBQTtFQUNBLE9BQUEsTUFBQSxJQUFBOzs7Q0FHQSxJQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUE7RUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTtHQUNBLE9BQUE7R0FDQSxVQUFBO0tBQ0EsS0FBQSxTQUFBLElBQUE7R0FDQSxNQUFBLFNBQUEsUUFBQSxPQUFBLFlBQUEsSUFBQTtHQUNBLE9BQUEsSUFBQTs7OztDQUlBLElBQUEsU0FBQSxVQUFBO0VBQ0EsT0FBQSxPQUFBO0VBQ0EsTUFBQSxTQUFBLFFBQUEsT0FBQSxZQUFBOzs7Q0FHQSxJQUFBLGFBQUEsU0FBQSxLQUFBO0VBQ0EsT0FBQSxNQUFBLEtBQUEsY0FBQTtHQUNBLEtBQUEsVUFBQTtHQUNBLE9BQUEsSUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG5cdFx0J25nUm91dGUnXG5cdF0pO1xuY29uc3Qgc3RhdGljT2JqID0ge1xuXHRvbGRDbGFzczoge31cbn07IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKXtcblx0JHJvdXRlUHJvdmlkZXJcblx0LndoZW4oJy8nLCB7IGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyB9KVxuXHQud2hlbignL3JlZ2lzdGVyJywgeyBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJywgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJ30pXG5cdC53aGVuKCcvbG9naW4nLCB7IGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLCB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzJywgeyBjb250cm9sbGVyOiAnQ2xhc3Nlc0N0cmwnLCB0ZW1wbGF0ZVVybDogJy4vY2xhc3Nlcy9jbGFzc2VzLmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzL2VkaXQnLCB7IGNvbnRyb2xsZXI6ICdDbGFzc2VzQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2VzL2NsYXNzZXNFZGl0Lmh0bWwnfSlcblx0LndoZW4oJy9jbGFzc2VzL3Nob3dTcGVjaWFsJywgeyBjb250cm9sbGVyOiAnU3BlY2lhbENsYXNzZXNDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvc2hvd1NwZWNpYWwuaHRtbCd9KVxuXHQud2hlbignL2NsYXNzZXMvZWRpdFNwZWNpYWwnLCB7IGNvbnRyb2xsZXI6ICdTcGVjaWFsQ2xhc3Nlc0VkaXRDdHJsJywgdGVtcGxhdGVVcmw6ICcuL2NsYXNzZXMvZWRpdFNwZWNpYWwuaHRtbCd9KVxuXHQud2hlbignL215aW5mbycsIHsgY29udHJvbGxlcjogJ015RGF0YUN0cmwnLCB0ZW1wbGF0ZVVybDogJy4vdXNlcnMvbXlpbmZvLmh0bWwnfSlcblx0LndoZW4oJy9lZGl0ZGF0YScsIHsgY29udHJvbGxlcjogJ0VkaXREYXRhQ3RybCcsIHRlbXBsYXRlVXJsOiAnLi91c2Vycy9lZGl0ZGF0YS5odG1sJ30pXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTdmMpe1xuXHQkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKF8sIHVzZXIpe1xuXHRcdCRzY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG5cdH0pO1xuXHRcblx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblx0XHRVc2VyU3ZjLmxvZ291dCgpXG5cdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvJyk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdDbGFzc2VzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIENsYXNzZXNTdmMpIHtcblx0Q2xhc3Nlc1N2Yy5mZXRjaCgpXG5cdC5zdWNjZXNzKGZ1bmN0aW9uKGNsYXNzZXMpIHtcblx0XHQkc2NvcGUuY2xhc3NlcyA9IGNsYXNzZXM7XG5cdH0pO1xuXHQkc2NvcGUuY2xhc3MgPSBzdGF0aWNPYmouY2xhc3M7XG5cdFxuXHQkc2NvcGUuc2hvd1NwZWNpYWwgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0c3RhdGljT2JqLmNsYXNzTmFtZSA9IG5hbWU7XG5cdFx0c3RhdGljT2JqLmNsYXNzSWQgPSAkc2NvcGUuY2xhc3Nlcy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKS5pZDtcblx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlcy9zaG93U3BlY2lhbFwiKTtcblx0fVxuXHRcblx0JHNjb3BlLmVkaXQgPSBmdW5jdGlvbihDbGFzcykge1xuXHRcdHN0YXRpY09iai5jbGFzcyA9IENsYXNzO1xuXHRcdHN0YXRpY09iai5vbGRDbGFzcyA9IE9iamVjdC5hc3NpZ24oe30sIENsYXNzKTtcblx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlcy9lZGl0XCIpO1xuXHR9XG5cblx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAobmFtZSwgZGVzY3JpcHRpb24sIGR1cmF0aW9uKSB7XG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KHN0YXRpY09iai5vbGRDbGFzcykgIT09ICd7fScpIHtcblx0XHRcdGlmIChKU09OLnN0cmluZ2lmeShzdGF0aWNPYmoub2xkQ2xhc3MpICE9PSBKU09OLnN0cmluZ2lmeSgkc2NvcGUuY2xhc3MpKSB7XG5cdFx0XHRcdENsYXNzZXNTdmMudXBkYXRlKHtcblx0XHRcdFx0XHRuYW1lLCBkZXNjcmlwdGlvbiwgZHVyYXRpb24sIFxuXHRcdFx0XHRcdG9sZE5hbWU6IHN0YXRpY09iai5vbGRDbGFzcy5uYW1lXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRzdGF0aWNPYmoub2xkQ2xhc3MgPSB7fTtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9jbGFzc2VzXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRDbGFzc2VzU3ZjLmNyZWF0ZSh7XG5cdFx0XHRcdG5hbWUsIGRlc2NyaXB0aW9uLCBkdXJhdGlvblxuXHRcdFx0fSkuc3VjY2VzcygoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXCIvIy9jbGFzc2VzXCIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdFZGl0RGF0YUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBFZGl0RGF0YVN2Yykge1xuXHRFZGl0RGF0YVN2Yy5mZXRjaCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuXHRcdCAkc2NvcGUuZGF0YSA9IGRhdGE7XG4gIH0pO1xuXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24gKGZpcnN0bmFtZSwgbGFzdG5hbWUsIGVtYWlsLCB0ZWxlcGhvbmUpIHtcblx0XHRFZGl0RGF0YVN2Yy51cGRhdGUoe1xuXHRcdFx0Zmlyc3RuYW1lLCBsYXN0bmFtZSwgZW1haWwsIHRlbGVwaG9uZVxuXHRcdH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJywgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvbXlpbmZvXCIpO1xuXHRcdH0pO1xuICAgIH07ICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCkge1xuICAgc2hvd1Bob3RvcygpO1xufSk7XG5cbmZ1bmN0aW9uIHNob3dQaG90b3MoKSB7XG4gICBjb25zdCBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubXlTbGlkZScpO1xuICAgbGV0IHNsaWRlSWR4ID0gMTtcblxuICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgZGlzcGxheShzbGlkZXMsIHNsaWRlSWR4KTtcbiAgICAgIHNsaWRlSWR4ID0gKHNsaWRlSWR4ICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgfSwgMzAwMCk7XG5cblxufVxuXG5mdW5jdGlvbiBkaXNwbGF5KHNsaWRlcywgaW5kZXgpIHtcbiAgIGNvbnN0IGxhc3QgPSAoaW5kZXggKyBzbGlkZXMubGVuZ3RoIC0gMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgXG4gICBzbGlkZXNbbGFzdF0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICBzbGlkZXNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xufVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3ZjKXtcblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKXtcblx0XHRVc2VyU3ZjLmxvZ2luKGVtYWlsLCBwYXNzd29yZClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7IFxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicsIHJlc3BvbnNlLmRhdGEpOyBcblx0XHR9KS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvJyk7XG5cdFx0fSk7XG5cdH1cblx0JHNjb3BlLmxvZ2luKFwiYWRtaW5AYWRtaW4uY29tXCIsIFwiMTIzNFwiKTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ015RGF0YUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBNeURhdGFTdmMpIHtcblx0TXlEYXRhU3ZjLmZldGNoKCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0JHNjb3BlLmRhdGEgPSBkYXRhO1xuXHR9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2Yyl7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChmaXJzdG5hbWUsIGxhc3RuYW1lLCBlbWFpbCwgdGVsZXBob25lLCBwYXNzd29yZCwgcmVwZWF0X3Bhc3N3b3JkKXtcblx0XHRcblx0XHRpZihwYXNzd29yZCA9PT0gcmVwZWF0X3Bhc3N3b3JkKSB7XG5cdFx0XHRVc2VyU3ZjLmNyZWF0ZVVzZXIoe1xuXHRcdFx0XHRmaXJzdG5hbWUsXG5cdFx0XHRcdGxhc3RuYW1lLFxuXHRcdFx0XHRlbWFpbCxcblx0XHRcdFx0dGVsZXBob25lLFxuXHRcdFx0XHRwYXNzd29yZFxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7IFxuXHRcdFx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKTsgXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvJyk7XG5cdFx0XHR9KVxuXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbNV0uc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs1XS5zZXRDdXN0b21WYWxpZGl0eShcIlBhc3N3b3JkcyBEb24ndCBNYXRjaFwiKTtcblx0XHR9XG5cdH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignU3BlY2lhbENsYXNzZXNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgU3BlY2lhbENsYXNzZXNTdmMpIHtcbiAgIFNwZWNpYWxDbGFzc2VzU3ZjLmZldGNoKHN0YXRpY09iai5jbGFzc05hbWUpXG4gICAuc3VjY2VzcyhmdW5jdGlvbihjbGFzc2VzKSB7XG4gICAgICAkc2NvcGUuY2xhc3NlcyA9IGNsYXNzZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgaXRlbS5zdGFydCA9IGl0ZW0uc3RhcnQuc2xpY2UoMCwgMTYpO1xuICAgICAgICAgcmV0dXJuIGl0ZW07IFxuICAgICAgfSkuc29ydChpdGVtID0+IGl0ZW0ucmVzZXJ2ZWQpO1xuICAgfSk7XG4gICBcbiAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24oQ2xhc3MpIHtcbiAgICAgIHN0YXRpY09iai5jbGFzcyA9IENsYXNzO1xuICAgICAgc3RhdGljT2JqLm9sZENsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgQ2xhc3MpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbignLyMvY2xhc3Nlcy9lZGl0U3BlY2lhbCcpO1xuICAgfVxuXG4gICAkc2NvcGUucmVzZXJ2YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHdpbmRvdy5teUJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29sbGFwc2VkXCIpKT8gXCJhc3NpZ25cIiA6IFwidW5Bc3NpZ25cIjsgXG4gICAgICBcbiAgICAgIFNwZWNpYWxDbGFzc2VzU3ZjLnJlc2VydmF0ZShhY3Rpb24sIChidXR0b24udGl0bGUgKiAxKSlcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgaWYoc3RhdHVzWzBdWzBdLk9LKSB7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIkplc3RlxZsganXFvCB6YXBpc2FueSB3IHR5bSBjemFzaWUgZG8gemFqxJnEh1wiKVxuICAgICAgICAgfVxuICAgICAgfSlcbiAgIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignU3BlY2lhbENsYXNzZXNFZGl0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFNwZWNpYWxDbGFzc2VzU3ZjKSB7XG4gICBTcGVjaWFsQ2xhc3Nlc1N2Yy5nZXRUcmFpbmVycygpXG4gICAuc3VjY2VzcyhmdW5jdGlvbih0cmFpbmVycykge1xuICAgICAgJHNjb3BlLnRyYWluZXJzID0gdHJhaW5lcnM7XG4gICB9KTtcbiAgICRzY29wZS5jbGFzcyA9IHN0YXRpY09iai5jbGFzcztcblxuICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoc3RhcnQsIHRyYWluZXJOYW1lLCBtYXhfcGFydGljaXBhbnRzKSB7ICAgICAgXG4gICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoc3RhdGljT2JqLm9sZENsYXNzKSAhPT0gJ3t9Jykge1xuICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHN0YXRpY09iai5vbGRDbGFzcykgIT09IEpTT04uc3RyaW5naWZ5KCRzY29wZS5jbGFzcykpIHtcbiAgICAgICAgICAgIFNwZWNpYWxDbGFzc2VzU3ZjLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICB0cmFpbmVySWQ6ICRzY29wZS50cmFpbmVycy5maW5kKChpdGVtKSA9PiBpdGVtLm5hbWUgPT09IHRyYWluZXJOYW1lKS5pZCwgXG4gICAgICAgICAgICAgICBjbGFzc05hbWU6IHN0YXRpY09iai5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICBzdGFydDogKHN0YXJ0ICsgXCI6MDBcIikucmVwbGFjZShcIlRcIiwgXCIgXCIpLCBcbiAgICAgICAgICAgICAgIG1heF9wYXJ0aWNpcGFudHMsXG4gICAgICAgICAgICAgICBpZDogc3RhdGljT2JqLm9sZENsYXNzLmlkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgfVxuICAgICAgICAgc3RhdGljT2JqLm9sZENsYXNzID0ge307XG4gICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFwiLyMvY2xhc3Nlcy9zaG93U3BlY2lhbFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBTcGVjaWFsQ2xhc3Nlc1N2Yy5jcmVhdGUoe1xuICAgICAgICAgICAgdHJhaW5lcklkOiAkc2NvcGUudHJhaW5lcnMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lID09PSB0cmFpbmVyTmFtZSkuaWQsIFxuICAgICAgICAgICAgY2xhc3NJZDogc3RhdGljT2JqLmNsYXNzSWQsXG4gICAgICAgICAgICBzdGFydDogKHN0YXJ0ICsgXCI6MDBcIikucmVwbGFjZShcIlRcIiwgXCIgXCIpLCBcbiAgICAgICAgICAgIG1heF9wYXJ0aWNpcGFudHNcbiAgICAgICAgIH0pLnN1Y2Nlc3MoKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcIi8jL2NsYXNzZXMvc2hvd1NwZWNpYWxcIik7XG4gICAgICAgICB9KS5jYXRjaCgocmVhc29uKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRUFTT046IFwiLCByZWFzb24pXG4gICAgICAgICB9KTtcbiAgICAgIH1cbiAgIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ0NsYXNzZXNTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NsYXNzZXMnKTtcbiAgIH1cblxuICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbih1cGRhdGVkQ2xhc3MpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvY2xhc3NlcycsIHVwZGF0ZWRDbGFzcyk7XG4gICB9XG5cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG5ld0NsYXNzKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9jbGFzc2VzJywgbmV3Q2xhc3MpO1xuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnRWRpdERhdGFTdmMnLCBmdW5jdGlvbiAoJGh0dHApIHtcbiAgIGNvbnN0IHN2YyA9IHRoaXM7XG5cbiAgIHN2Yy5mZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbXlkYXRhJyk7XG4gICB9XG5cbiAgIHN2Yy5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzJyk7XG4gICB9XG5cbiAgIHN2Yy51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSl7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL215ZGF0YScsIGRhdGEpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUF1dGgnXSA9IHJlcy5kYXRhO1xuICAgICAgICAgcmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG4gICAgICB9KVxuICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnTXlEYXRhU3ZjJywgZnVuY3Rpb24gKCRodHRwKSB7XG4gICB0aGlzLmZldGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9teWRhdGEnKTtcbiAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1NwZWNpYWxDbGFzc2VzU3ZjJywgZnVuY3Rpb24gKCRodHRwKSB7XG4gICB0aGlzLmZldGNoID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICB1cmw6ICcvYXBpL3NwZWNpYWxDbGFzc2VzJyxcbiAgICAgICAgIGhlYWRlcnM6IHsgbmFtZTogY2xhc3NOYW1lIH1cbiAgICAgIH0pO1xuICAgfVxuXG4gICB0aGlzLmdldFJlc2VydmF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9yZXNlcnZhdGlvbicpO1xuICAgfVxuXG4gICB0aGlzLnJlc2VydmF0ZSA9IGZ1bmN0aW9uIChhY3Rpb24sIGNsYXNzSWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Jlc2VydmF0aW9uJywgeyBhY3Rpb24sIGNsYXNzSWQgfSk7XG4gICB9XG5cbiAgIHRoaXMuZ2V0VHJhaW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHJhaW5lcnMnKTtcbiAgIH1cblxuICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihDbGFzcykge1xuICAgICAgcmV0dXJuICRodHRwLnB1dCgnL2FwaS9zcGVjaWFsQ2xhc3NlcycsIENsYXNzKVxuICAgfVxuXG4gICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChuZXdDbGFzcykge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc3BlY2lhbENsYXNzZXMnLCBuZXdDbGFzcyk7XG4gICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdVc2VyU3ZjJywgZnVuY3Rpb24oJGh0dHApe1xuXHRjb25zdCBzdmMgPSB0aGlzO1xuXHRcblx0c3ZjLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcnMnKVxuXHR9XG5cblx0c3ZjLmxvZ2luID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zZXNzaW9ucycsIHtcblx0XHRcdGVtYWlsOiBlbWFpbCxcblx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcblx0XHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUF1dGgnXSA9IHZhbC5kYXRhO1xuXHRcdFx0cmV0dXJuIHN2Yy5nZXRVc2VyKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzdmMubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuYXV0aCA9IHt9O1xuXHRcdCRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUF1dGgnXSA9ICcnO1xuXHR9O1xuXHRcblx0c3ZjLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbihVc2VyKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VycycsIFVzZXIpXG5cdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBzdmMubG9naW4oVXNlci5lbWFpbCwgVXNlci5wYXNzd29yZCk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuIl19
