angular.module('app')
.controller('SpecialClassesCtrl', function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.fetch(window.className)
   .success(function(classes) {
      $scope.classes = classes;
   });

   SpecialClassesSvc.getTrainers()
   .success(function(trainers) {
      $scope.trainers = trainers;
   });

   $scope.save = function (name, description, duration) {
      SpecialClassesSvc.create({
         name, description, duration
      }).success(() => {
         window.location.assign("/#/classes");
      });
   };
});
