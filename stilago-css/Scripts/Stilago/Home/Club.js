stilago.home.club = {};

stilago.home.club.updateSaleCountdown = function (sale) {
    var endOnContainer = sale.find('.end-on');
    var endOnAttribute = endOnContainer.attr('data-end-on');

    if (endOnAttribute.length > 0) {
        var endOn = new Date(endOnAttribute * 1);
        var currentTime = new Date();

        var diffInMilliseconds = endOn.getTime() - currentTime.getTime();
        if (diffInMilliseconds <= 0) {
            sale.hide();
        }

        var days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        diffInMilliseconds -= days * (1000 * 60 * 60 * 24);

        var hours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));

        var translations = stilago.home.club.translations;

        endOnContainer.find('.days .value').text(days);
        endOnContainer.find('.days .unit').text(days == 1 ? translations.day.singular : translations.day.plural);
        endOnContainer.find('.hours .value').text(hours);
        endOnContainer.find('.hours .unit').text(hours == 1 ? translations.hour.singular : translations.hour.plural);
    }
};

stilago.home.club.updateSaleCountdowns = function () {
    for (var i = 0; i < stilago.home.club.sales.size() ; i++) {
        //stilago.home.club.updateSaleCountdown($(stilago.home.club.sales[i]));
    }
};

stilago.home.club.initSaleCountdowns = function () {
    var container = stilago.home.club.container;
    var translationsContainer = container.find('.countdown-translations');

    stilago.home.club.translations = {
        "day": {
            "singular": translationsContainer.find('.day-singular').text(),
            "plural": translationsContainer.find('.day-plural').text()
        },
        "hour": {
            "singular": translationsContainer.find('.hour-singular').text(),
            "plural": translationsContainer.find('.hour-plural').text()
        }
    };

    stilago.home.club.sales = container.find('.sale');

    stilago.home.club.updateSaleCountdowns();
    setInterval(function () { stilago.home.club.updateSaleCountdowns(); }, 5000);
};

// --- Adult popup ---

stilago.home.club.initAdultPopup = function() {
    var adultPopupForm = stilago.home.club.container.find('.yes-adult-button').closest('form');
    adultPopupForm.on('submit', stilago.home.club.adultPopupFormSubmitted);
    stilago.home.club.container.find('.not-18-error-message').removeClass('visible');
};

stilago.home.club.adultPopupFormSubmitted = function () {
    if (stilago.home.club.checkIfAdult()) {
        stilago.home.club.container.find('.not-18-error-message').removeClass('visible');
        return true;
    } else {
        stilago.home.club.container.find('.not-18-error-message').addClass('visible');
        return false;
    }
};

stilago.home.club.checkIfAdult = function() {
    var adultAge = stilago.home.club.container.find('.adult-age-in-years').val();

    var day = stilago.home.club.container.find('.input-day').val();
    var month = stilago.home.club.container.find('.input-month').val();
    var year = stilago.home.club.container.find('.input-year').val();

    // correct day is needed to max day in given month
    var maxDaysInMonth = new Date(year, month, 0).getDate();
    day = Math.min(day, maxDaysInMonth);

    var birthdate = new Date(year, month - 1, day);

    var minimumDate = new Date();
    minimumDate.setFullYear(minimumDate.getFullYear() - adultAge);

    return (birthdate < minimumDate);
};

// --- Adult popup END ---

$(document).ready(function () {
    stilago.home.club.container = stilago.home.container.find('#club');
    var container = stilago.home.club.container;

    stilago.home.club.initSaleCountdowns();

    container.find('.carousel-wrapper.main-banners .carousel').carouFredSel({
        circular: true,
        infinite: true,
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

    //TODO: This function should not be called here but as an event handler when the popup is opened
    stilago.home.club.initAdultPopup();
});