angular.module('app')
.service('SpecialClassesSvc', function ($http) {
   this.fetch = function (classId) {
      return $http({
         method: 'GET',
         url: '/api/specialClasses',
         headers: { id: classId }
      });
   }

   this.getReservations = function() {
      return $http.get('/api/reservation');
   }

   this.reservate = function (action, classId) {
      return $http.post('/api/reservation', { action, classId });
   }

   this.getTrainers = function() {
      return $http.get('/api/trainers');
   }

   this.update = function(Class) {
      return $http.put('/api/specialClasses', Class)
   }

   this.create = function (newClass) {
      return $http.post('/api/specialClasses', newClass);
   }
});