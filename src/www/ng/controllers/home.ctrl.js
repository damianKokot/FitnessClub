angular.module('app')
.controller('HomeCtrl', function () {
   showPhotos();
});

function showPhotos() {
   const slides = document.querySelectorAll('.mySlide');
   let slideIdx = 1;

   setInterval(() => {
      display(slides, slideIdx);
      slideIdx = (slideIdx + 1) % slides.length;
   }, 3000);


}

function display(slides, index) {
   const last = (index + slides.length - 1) % slides.length;
   
   slides[last].classList.add('hidden');
   slides[index].classList.remove('hidden');
}
