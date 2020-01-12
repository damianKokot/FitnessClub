angular.module('app')
.service('MyDataSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/users');
   }
});