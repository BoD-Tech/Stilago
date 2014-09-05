stilago.minicart = {};
stilago.minicart.maxVisibleItemCount = 3;
stilago.minicart.showContentTime = 400;
stilago.minicart.hideContentTime = 300;
stilago.minicart.showHideActionsEnabled = true;
stilago.minicart.shoppingCartSelector = '.shopping-cart';
stilago.minicart.shoppingCartContentSelector = '.shopping-cart-content';

stilago.minicart.getCartItemsCount = function () {
    var shoppingCartContent = stilago.minicart.container.find(stilago.minicart.shoppingCartContentSelector);
    return shoppingCartContent.find('ul.items li').size();
};

stilago.minicart.showContentIfNotEmpty = function (persistent, immediately) {
    var showContentTime = immediately ? 0 : stilago.minicart.showContentTime;
    var shoppingCartContent = stilago.minicart.container.find(stilago.minicart.shoppingCartContentSelector);
    var closeButton = shoppingCartContent.find('.close-button');

    if (!stilago.minicart.showHideActionsEnabled) {
        return false;
    }
    if (stilago.minicart.getCartItemsCount() == 0) {
        return false;
    }

    closeButton.off('click');

    if (persistent) {
        stilago.minicart.showHideActionsEnabled = false;

        $('.shade').addClass('active').fadeOut(0).fadeIn(showContentTime, function() {
            $(this).add(closeButton).one('click', function(event) {
                shoppingCartContent.stop(true, true).slideUp(stilago.minicart.hideContentTime);
                $('.shade').fadeOut(stilago.minicart.hideContentTime, function() {
                    $(this).removeClass('active');
                    stilago.minicart.showHideActionsEnabled = true;
                    stilago.minicart.hideContent();
                });
                event.preventDefault();
            });
        });

        $('html, body').animate({ scrollTop: 0 }, showContentTime);
    } else {
        closeButton.click(function() {
            stilago.minicart.hideContent();
        });
    }

    shoppingCartContent.stop(true, true).slideDown(showContentTime).addClass('active');

    return true;
};

stilago.minicart.hideContent = function () {
    if (stilago.minicart.showHideActionsEnabled) {
        stilago.minicart.container.find(stilago.minicart.shoppingCartContentSelector).stop(true, true).hide().removeClass('active');
    }
};

stilago.minicart.refresh = function () {
    stilago.CartCountdown.init(this.container);
    stilago.minicart.makeScrollableIfTooManyItems();
};

stilago.minicart.refreshAndShowContentIfNotEmpty = function (persistent, immediately) {
    stilago.minicart.refresh();
    stilago.minicart.showContentIfNotEmpty(persistent, immediately);
};

stilago.minicart.makeScrollableIfTooManyItems = function () {
    //if (stilago.minicart.getCartItemsCount() > stilago.minicart.maxVisibleItemCount) {
    //    var shoppingCartContent = stilago.minicart.container.find(stilago.minicart.shoppingCartContentSelector);
    //    shoppingCartContent.addClass('invisible').show();

    //    shoppingCartContent.find('table.cart-items-table').carouFredSel({
    //        direction: "up",
    //        circular: false,
    //        infinite: false,
    //        width: 290,
    //        height: "variable",
    //        padding: [0, 0, 0, 0],
    //        items: {
    //            width: 290,
    //            minimum: 3,
    //            visible: 3
    //        },
    //        auto: false,
    //        prev: shoppingCart.find('.prev'),
    //        next: shoppingCart.find('.next')
    //    });

    //    shoppingCartContent.removeClass('invisible').hide();
    //}
};

stilago.minicart.initHover = function () {
    var shoppingCart = this.container.find(stilago.minicart.shoppingCartSelector);

    shoppingCart.mouseenter(function () {
        stilago.minicart.showContentIfNotEmpty(false, false);
    });

    shoppingCart.mouseleave(function () {
        stilago.minicart.hideContent();
    });
};

stilago.minicart.replaceContent = function (htmlContent) {
    if (this.container) {
        this.container.html(htmlContent);
        stilago.CartCountdown.initSeconds(this.container);
        this.initHover();
    }
};

stilago.minicart.dynamicLoad = function() {
    if ($('#header-cart').length > 0 && $('#header-cart').attr('data-cart-href')) {
        $.ajax({
            type: "POST",
            cache: false,
            data: { returnUrl: JSON.stringify(window.location.href) },
            url: $('#header-cart').attr('data-cart-href'),
            success: function(data) {
                $('#header-cart').html($(data));
                stilago.minicart.initialize();
            }
        });
    }
};

stilago.minicart.initialize = function() {
    stilago.minicart.container = $('#header-cart');

    stilago.minicart.initHover();

    stilago.minicart.makeScrollableIfTooManyItems();

    if (stilago.minicart.showContentIfNotEmptyOnLoad) {
        stilago.minicart.showContentIfNotEmpty(true, true);
    }

    stilago.CartCountdown.init(stilago.minicart.container);
    stilago.CartCountdown.addTimeContainer(stilago.minicart.container);

    stilago.popup.openAllActive();
};

$(document).ready(function() {
    stilago.minicart.dynamicLoad();
});