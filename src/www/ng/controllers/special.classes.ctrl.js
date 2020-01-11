angular.module('app')
.controller('SpecialClassesCtrl', function ($scope, SpecialClassesSvc) {
   SpecialClassesSvc.fetch(staticObj.classId)
   .success(function(classes) {
      $scope.classes = classes.map(item => {
         item.start = item.start.slice(0, 16);
         return item; 
      }).sort(item => item.reserved);
   });
   
   $scope.edit = function(Class) {
      staticObj.class = Class;
      staticObj.oldClass = Object.assign({}, Class);
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
});
