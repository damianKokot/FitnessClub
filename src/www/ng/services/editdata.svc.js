angular.module('app')
.service('EditDataSvc', function ($http) {
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
});