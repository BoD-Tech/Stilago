stilago.header = {};

stilago.header.adjustSubMenuPositions = function() {
    stilago.header.container.find('.header-bottom .sub-menu').each(function () {
        var subMenu = $(this);

        subMenu.css('margin-left', '0');

        var subMenuLeftEdge = subMenu.offset().left;
        var subMenuRightEdge = subMenu.outerWidth() + subMenu.offset().left;
        var contentHolder = $('.content-holder');
        var contentHolderLeftEdge = contentHolder.offset().left;
        var contentHolderRightEdge = contentHolder.width() + contentHolder.offset().left;

        var overhang = subMenuRightEdge - contentHolderRightEdge;
        var reserve = subMenuLeftEdge - contentHolderLeftEdge;

        if (overhang > 0) {
            subMenu.css('margin-left', '-' + Math.min(overhang, reserve) + 'px');
        }
    });
};

stilago.header.initMainMenu = function() {
    stilago.header.adjustSubMenuPositions();
    $(window).resize(function() {
        stilago.header.adjustSubMenuPositions();
    });
};

//TODO: footer and related methods/properties should probably go to a separate file
stilago.footer = {};

stilago.account.catalogRegistrationCallback = function (data) {
    var catalogRegistrationFormSelector = "form.catalog-registration-form";
    $(catalogRegistrationFormSelector).replaceWith($(data.responseText));
    var form = $(catalogRegistrationFormSelector);
    var redirectUrl = form.attr('data-redirect-url');
    if (redirectUrl.length > 0) {
        $('#main-loader').addClass('active-important');
        window.location = redirectUrl;
    } else {
        $.validator.unobtrusive.parse(form);
        stilago.account.initCatalogRegistrationForm(form);
    }
};

stilago.account.initCatalogRegistrationForm = function(container) {
    container.find('.zip-code-text').stilagoAutoComplete();
    container.find('.city-text').stilagoAutoComplete();
    container.find('.phone-code-text').stilagoAutoComplete();
    container.find('.become-a-member-checkbox').click(function() {
        var agreeParagraph = container.find('.agree-and-accept');
        if ($(this).is(':checked')) {
            agreeParagraph.removeClass('hidden');
        } else {
            agreeParagraph.addClass('hidden');
        }
    });
};

stilago.account.initCatalogRegistrationFormInsideOfPopup = function()
{
    stilago.account.initCatalogRegistrationForm($(this));
};

stilago.account.newsletterSignupCallback = function (data) {
    $("form.newsletter-signup").replaceWith($(data.responseText));
    stilago.customizeInputs($('form.newsletter-signup'));
    if ($("form.newsletter-signup").attr('data-success').toLocaleLowerCase() == true.toString()) {
        $('#main-loader').addClass('active-important');
        var redirectUrl = $("form.newsletter-signup").attr('returnUrl');
        $("form.newsletter-signup").attr('data-success', 'False').attr('returnUrl', '');
        window.location = redirectUrl;
    } else {
        $.validator.unobtrusive.parse(".newsletter-signup");
        stilago.popup.open('newsletter-signup-error');
    }
};

stilago.footer.inviteFriendCallback = function (data) {
    $("form.invite-friend").replaceWith($(data.responseText));
    if ($("form.invite-friend").attr('data-success').toLocaleLowerCase() == true.toString()) {
        stilago.popup.openAllActive();
    }
    $.validator.unobtrusive.parse(".invite-friend");
};

stilago.account.signInCallback = function (data) {
    var signInPopup = stilago.popup.replace(stilago.account.signInPopupName, $(data.responseText));
    var successfullAuthForm = signInPopup.find('.auth-form[data-success="True"]');
    if (successfullAuthForm.length > 0) {
        $('#main-loader').addClass('active-important');
        signInPopup.popup({ action: 'close' });
        window.location = stilago.account.signInRedirectUrl;
    } else {
        var isUserDeletedForm = signInPopup.find('.auth-form[data-is-user-deleted="True"]');
        if (isUserDeletedForm.length > 0) {
            stilago.popup.open('DeletedUserErrorPopup', { preserveOther: true });
        }
    }
};

stilago.account.signUpCallback = function (data) {
    var signUpPopup = stilago.popup.replace(stilago.account.signUpPopupName, $(data.responseText));
    var successfullAuthForm = signUpPopup.find('.auth-form[data-success="True"]');
    if (successfullAuthForm.length > 0) {
        signUpPopup.popup({ action: 'close' });
        if (!stilago.account.doubleOptInEnabled) {
            $('#main-loader').addClass('active-important');
            window.location = stilago.account.signUpRedirectUrl;
        } else {
            stilago.popup.open('ConfirmEmail');
        }
    }
};

stilago.account.forgotPasswordCallback = function (data) {
    var newPopup = $(data.responseText);
    if (newPopup.attr('data-name') == stilago.account.forgotPasswordPopupName) {
        stilago.popup.replace(stilago.account.forgotPasswordPopupName, newPopup);
    } else {
        stilago.popup.close(stilago.account.forgotPasswordPopupName);
        newPopup.appendTo('body').popup();
    }
};

stilago.account.cookieNotificationDisable = function () {
    var d = new Date();
    d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "CookieNotification" + "=1" + "; " + expires;

    $('.cookie-notification-bubble').remove();

    return false;
};

stilago.adjustExplanationTooltipPosition = function(container) {
    var explanations = container.find('.explanation-tooltip-container');
    explanations.each(function() {
        var explanation = $(this);
        var tooltip = explanation.find('.tooltip');
        var explanationMiddle = explanation.offset().top + explanation.innerHeight() / 2;
        var tooltipMiddle = tooltip.offset().top + tooltip.innerHeight() / 2;
        tooltip.css('margin-top', (explanationMiddle - tooltipMiddle) + 'px');
    });
};

stilago.customizeInputs = function (containers) {
    //do nothing as there are no custom inputs for stilago
};

$(document).ready(function () {
    $('.country-button').click(function (e) {
        e.preventDefault();
        $(this).closest('.country-box').toggleClass('active');
    });
    
    $('.scrolling-box a').anchor();
    stilago.initToTopArrow();

    stilago.header.container = $('#header');
    stilago.header.initMainMenu();

    $('.dontshow-link').on('click', stilago.account.cookieNotificationDisable);

    stilago.account.showSignUpPopupIfRequired();
});
