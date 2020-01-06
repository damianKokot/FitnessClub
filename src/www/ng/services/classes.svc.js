angular.module('app')
.service('ClassesSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/classes');
   }

   this.update = function(updatedClass) {
      return $http.put('/api/classes', updatedClass);
   }

   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
});