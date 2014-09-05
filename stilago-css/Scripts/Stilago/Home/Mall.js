stilago.home.mall = {};

$(document).ready(function () {
    stilago.home.mall.container = stilago.home.container.find('#mall');
    var container = stilago.home.mall.container;

    container.find('.carousel-wrapper.main-banners .carousel').carouFredSel({
        circular: true,
        infinite: true,
        width: 661,
        height: 497,
        scroll: {
            pauseOnHover: true
        },
        auto: {
            play: true,
            timeoutDuration: 5000
        },
        pagination: {
            container: '.carousel-wrapper.main-banners .pagination'
        },
        prev: '.carousel-wrapper.main-banners .prev',
        next: '.carousel-wrapper.main-banners .next'
    });

    container.find('img.front, img.back').loadImage();

    container.find('.carousel-wrapper.brands .carousel').carouFredSel({
        circular: true,
        infinite: true,
        scroll: {
            pauseOnHover: true
        },
        auto: {
            play: true,
            timeoutDuration: 5000
        },
        prev: '.carousel-wrapper.brands .prev',
        next: '.carousel-wrapper.brands .next'
    });
});