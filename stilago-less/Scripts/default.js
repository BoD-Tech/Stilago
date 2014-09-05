$.ajaxSetup({
    cache: false
});

stilago.account = {};

//TODO: footer and related methods/properties should probably go to a separate file
stilago.footer = {};

stilago.initToTopArrow = function () {
    var toTopArrow = $('.to-top-arrow a').anchor().closest('.to-top-arrow');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            toTopArrow.show();
        } else {
            toTopArrow.hide();
        }
    }).scroll();
};

stilago.customizeInputs = function(containers, exceptFor) {
    exceptFor = (exceptFor === undefined) ? '' : exceptFor;

    containers.each(function() {
        var container = $(this);

        //radios
        if (exceptFor.indexOf('radio') == (-1)) {
            var selector = $.browser.msie ? '.radio:not(.no-customization,.ie-sensible)' : '.radio:not(.no-customization)';
            container.find(selector).buttonset();
        }

        //checkboxes
        if (exceptFor.indexOf('checkbox') == (-1)) {
            var selectorCheckbox = $.browser.msie ? 'input[type="checkbox"]:not(.no-customization,.ie-sensible)' : 'input[type="checkbox"]:not(.no-customization)';
            var checkboxes = container.find(selectorCheckbox);
            for (var i = 0, len = checkboxes.length; i < len; i++) {
                var checkbox = $(checkboxes[i]);
                $('label[for="' + checkbox.attr('id') + '"]').addClass('checkbox');
                checkbox.button();
            }
        }

        //selects
        if (exceptFor.indexOf('select') == (-1)) {
            container.find('select:visible:not(.no-customization)').selectmenu();
        }
    });
};

stilago.SSOSignoutInitialization = function () {
    $('.sign-out-link').on('click', function() {
        stilago.SSOSignOut.signOut();
    });
};

stilago.SSOSignOut = {
    signedOutSitesCount: 0,
    signOut: function(e) {
        if ($('.sign-out-link').attr('sites').length == 0)
            return true;
        e.preventDefault();
        $('[data-name=logout-popup]').popup();
        var sites = $('.sign-out-link').attr('sites').split(',');
        stilago.SSOSignOut.signedOutSitesCount = sites.length;
        for (var i = 0; i < sites.length; i++) {
            var iframe = $($('#logout-iframe').html())
                .attr('src', sites[i])
                .load(stilago.SSOSignOut.afterSignOutReload);
            $('[data-name=logout-popup]').append(iframe);
        }
        return false;
    },
    afterSignOutReload: function() {
        stilago.SSOSignOut.signedOutSitesCount--;
        if (stilago.SSOSignOut.signedOutSitesCount == 0) {
            window.location = $('.sign-out-link').attr('href');
        }
    }
};

stilago.account.showSignUpPopupIfRequired = function() {
    if (stilago.account.showSignUpPopup) {
        stilago.popup.open(stilago.account.signUpPopupName);
    }
};