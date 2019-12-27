angular.module('app')
.service('ClassesSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/mydata');
   }
   this.create = function (newClass) {
      return $http.post('/api/mydata', newClass);
   }
});