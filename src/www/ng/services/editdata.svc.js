angular.module('app')
.service('EditDataSvc', function ($http) {
   const svc = this;
   
   svc.getUser = function(email) {
      return $http({
         method: 'GET',
         url: '/api/users',
         headers: { email: email }
      });
   }

   svc.update = function (data){
      return $http.put('/api/users', data)
      .then(function(res) {
         $http.defaults.headers.common['X-Auth'] = res.data;
         return svc.getUser(data.email);
      })
   }
});