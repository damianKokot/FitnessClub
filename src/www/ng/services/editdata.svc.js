angular.module('app')
.service('EditDataSvc', function ($http) {
   this.update = function (data){
      return $http.put('/api/mydata', data)
   }


   this.fetch = function () {
      return $http.get('/api/mydata');
   }
});