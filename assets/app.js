let app = angular.module('app', []);

app.service('PostsSvc', function($http) {
	this.fetch = function () {
		return $http.get('/api/posts');
	}
	this.create = function(post) {
		return $http.post('/api/posts', post);
	}
});

app.controller('PostsCtrl', function ($scope, PostsSvc) {
	$scope.addPost = function (){
		if($scope.postBody){
			PostsSvc.create({
				username: 'dickeyxxx',
				body: $scope.postBody	
			}).success((post)=>{
				$scope.posts.unshift(post);
				$scope.postBody = null;
			})
		}
	};
	PostsSvc.fetch().success((posts) => {
		$scope.posts = posts;
	});
});