


$(window).scroll(function(){
  if ($(window).scrollTop() >= 200) {
    document.querySelector('nav').classList.add('fixed-header');
  }
  else {
    document.querySelector('nav').classList.remove('fixed-header');
  }
});


(function () {
  const header = document.querySelector('.header');
	const icon = document.querySelector('.icon-container');
	icon.onclick = function () {
		header.classList.toggle('menu-open');
	}
}());
