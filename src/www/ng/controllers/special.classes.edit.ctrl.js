angular.module('app')
.controller('SpecialClassesEditCtrl', function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.getTrainers()
   .success(function(trainers) {
      $scope.trainers = trainers;
   });
   $scope.class = staticObj.class;

   $scope.save = function (start, trainerName, max_participants) {      
      if (JSON.stringify(staticObj.oldClass) !== '{}') {
         if (JSON.stringify(staticObj.oldClass) !== JSON.stringify($scope.class)) {
            SpecialClassesSvc.update({
               trainerId: $scope.trainers.find((item) => item.name === trainerName).id, 
               className: staticObj.className,
               start: (start + ":00").replace("T", " "), 
               max_participants,
               id: staticObj.oldClass.id
            })
         }
         staticObj.oldClass = {};
         window.location.assign("/#/classes/showSpecial");
      } else {
         SpecialClassesSvc.create({
            trainerId: $scope.trainers.find((item) => item.name === trainerName).id, 
            classId: staticObj.classId,
            start: (start + ":00").replace("T", " "), 
            max_participants
         }).success(() => {
            window.location.assign("/#/classes/showSpecial");
         }).catch((reason)=>{
            console.log("REASON: ", reason)
         });
      }
   };
});
