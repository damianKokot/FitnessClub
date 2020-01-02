angular.module('app')
.service('SpecialClassesSvc', function ($http) {
   this.fetch = function (className) {
      return $http({
         method: 'GET',
         url: '/api/showSpecial',
         headers: { name: className }
      });
   }

   this.getTrainers = function() {
      return $http.get('/api/trainers');
   }

   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
});