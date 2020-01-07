angular.module('app')
.service('MyDataSvc', function ($http) {
   this.fetch = function () {
      return $http.get('/api/mydata');
   }
   this.create = function (newData) {
      return $http.post('/api/mydata', newData);
   }
});