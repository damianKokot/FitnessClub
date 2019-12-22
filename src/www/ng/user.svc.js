angular.module('app')
.service('UserSvc', function($http){
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
});
