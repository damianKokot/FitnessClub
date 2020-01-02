angular.module('app')
.service('SpecialClassesSvc', function ($http) {
   this.fetch = function (className) {
      console.log("Special classname: ", className);
      return $http.get('/api/showSpecial', { name: className });
   }
   this.create = function (newClass) {
      return $http.post('/api/classes', newClass);
   }
});