angular.module('app')
.service('ListUsersSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/listusers');
   }
});