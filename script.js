tippy('.skill', {
  content: "I'm a Tippy tooltip!",
  placement: 'bottom',
  trigger: 'click',
  interactive: true,
  theme: 'myTheme',
  positionFixed: true,
  zIndex: 1,
});

// функция для того, чтобы делать стики элемент (переводим позише абсолют в фиксд), когда он упирается в верхнюю часть экрана
// $(window).scroll(function(){
//   if ($(window).scrollTop() >= 52) {
//     document.querySelector('.closeButton').classList.add('fixed-header');
//   }
//   else {
//     document.querySelector('.closeButton').classList.remove('fixed-header');
//   }
// });

// это ксс
// /* PAGE PROJECT - CLOSE BUTTON */

// .closeButton {
//   background-image: url(close.svg);
//   position: absolute;
//   width: 16px;
//   height: 16px;
//   top: 64px;
//   right: 16px;
// }

// .fixed-header {
//   top: 12px !important;
//   position: fixed !important;
// }


// @media only screen and (min-width: 1400px) {
//   .closeButton {
//       position: absolute;
//       top: 64px;
// left: 50%;
// margin: 0 0 0 666px;
//   }
// }


// функция кнопки закрыть - возврат назад
// var $window = $(window),
//     $trigger = $('.backLink'),
//     fallback = 'index.html';
//     hasHistory = false;

// $window.on('beforeunload', function(){
//     hasHistory = true;
// });

// $trigger.on('click', function(){

//     window.history.go(-1);

//     setTimeout(function(){
//         if (!hasHistory){
//             window.location.href = fallback;
//         }
//     }, 200);

//     return false;
// });

(function () {
    const header = document.querySelector('.mobileMenu');


    const contact = document.querySelector('.mobileMenuButtonContainer');
    contact.onclick = function () {
      header.classList.toggle('menuOpen');
  }


      const icon = document.querySelector('.menuIconContainer');
      icon.onclick = function () {
          header.classList.toggle('menuOpen');
      }

      const linkCloseMenu1 = document.querySelector('.linkCloseMenu1');
      linkCloseMenu1.onclick = function () {
        header.classList.toggle('menuOpen');
    }



      const linkCloseMenu2 = document.querySelector('.linkCloseMenu2');
      linkCloseMenu2.onclick = function () {
        header.classList.toggle('menuOpen');
  }

  const linkCloseMenu3 = document.querySelector('.linkCloseMenu3');
  linkCloseMenu3.onclick = function () {
    header.classList.toggle('menuOpen');
}


  }());

  