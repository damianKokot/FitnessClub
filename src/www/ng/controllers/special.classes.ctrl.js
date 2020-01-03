angular.module('app')
.controller('SpecialClassesCtrl', function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.fetch(window.className)
   .success(function(classes) {
      classes = classes[0];
      console.log(classes[0])

      SpecialClassesSvc.getReservations()
      .success(function(reservated) {

         $scope.classes = classes.map((item) => {
            if(reservated.find(elem => item.id === elem.specific_class_id) === -1) {
               item.reserved = true;
            }
            item.start = item.start.slice(0, 16);
            return item;
         }).sort(item => item.reserved);
      })
   });
   const oldClass = Object.assign({}, window.class);
   $scope.class = window.class;
   delete window.class;

   SpecialClassesSvc.getTrainers()
   .success(function(trainers) {
      $scope.trainers = trainers;
   });

   $scope.edit = function(Class) {
      window.class = Class;
      window.location.assign('/#/classes/editSpecial');
   }

   $scope.reservation = function() {
      const button = window.myButton.children[0];
      const action = (button.classList.contains("collapsed"))? "assign" : "unAssign"; 
      
      SpecialClassesSvc.reservate(action, (button.title * 1))
      .success(function(status) {
         if(status[0][0].OK) {
            button.classList.toggle("collapsed");
         } else {
            alert("Jesteś już zapisany w tym czasie do zajęć")
         }
      })
   }

   $scope.save = function (className, start, trainerName, max_participants) {
      console.log(start + ":10.000Z")
      
      const trainerId = $scope.trainers.find((item) => item.name === trainerName).id;
      if (oldClass) {
         if (JSON.stringify(oldClass) !== JSON.stringify($scope.class)) {
            SpecialClassesSvc.update({
               className, 
               start: start + ":00.000Z", 
               trainerId, 
               max_participants,
               oldName: oldClass.className
            })
         }
         window.location.assign("/#/classes/showSpecial");
      } else {
         SpecialClassesSvc.create({
            className, start: start + ":00.000Z", trainerId, max_participants
         }).success(() => {
            window.location.assign("/#/classes/showSpecial");
         });
      }
   };
});
