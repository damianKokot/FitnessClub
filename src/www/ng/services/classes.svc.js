angular.module('app')
.service('ClassesSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/classes');
   }
   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
});