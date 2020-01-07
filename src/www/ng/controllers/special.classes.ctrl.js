angular.module('app')
.controller('SpecialClassesCtrl', function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.fetch($scope.className)
   .success(function(classes) {
      $scope.classes = classes;
   });

   $scope.save = function (name, description, duration) {
      SpecialClassesSvc.create({
         name, description, duration
      }).success(() => {
         window.location.assign("/#/classes");
      });
   };
});
