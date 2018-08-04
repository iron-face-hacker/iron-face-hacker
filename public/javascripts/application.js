let likesCount = 0;

$(window).on('scroll', function(){
    
    let ultimoScroll = 0;
    let scrollActual = $(window).scrollTop();
    
    if (scrollActual > ultimoScroll) {
        $('.main-nav').addClass('oculto');
    } else {
        $('.main-nav').removeClass('oculto');
    }
    ultimoScroll = scrollActual; 
});


var image = document.querySelector("img");

image.onclick = function() {
    
    if (image.mozRequestFullScreen) {
        image.mozRequestFullScreen();
    }
};



// new Vivus('svgStar', {
//     file: 'img/svg/svgStar.svg',
//     duration: 200,
//     animTimingFunction: Vivus.EASE_IN
// });