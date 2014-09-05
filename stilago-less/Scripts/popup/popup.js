stilago.popup = {};

stilago.popup.replace = function(name, newPopup, options) {
    var opts = $.extend(true, {}, options);
    var popup = stilago.popup.unregister(name);
    popup.replaceWith(newPopup);
    return stilago.popup.open(name, opts);
};

stilago.popup.openAllActive = function () {
    var activePopups = $('div.popup.' + stilago.popup.activePopupCssClass);
    activePopups.removeClass(stilago.popup.activePopupCssClass).show();
    activePopups.popup({ closeAllOther: false });
};

stilago.popup.open = function (name, options) {
    var opts = $.extend(true, {}, options);
    return stilago.popup.getByName(name).popup(opts);
};

stilago.popup.close = function (name, options) {
    var opts = $.extend(true, {}, options, {action: 'close'});
    return stilago.popup.getByName(name).popup(opts);
};

stilago.popup.closeAllOpen = function(excludeActive) {
    var popupsToBeClosed = $('div.popup:visible');
    if (excludeActive) {
        popupsToBeClosed = popupsToBeClosed.filter(':not(.active)');
    }
    popupsToBeClosed.popup({action: 'close'});
};

stilago.popup.unregister = function (name) {
    return stilago.popup.getByName(name).popup({ action: 'unregister' });
};

stilago.popup.getByName = function(name) {
    return $('div.popup[data-name="' + name + '"]');
};

stilago.popup.resize = function (name, toClass) {
    var popup = stilago.popup.getByName(name);
    popup.css("visibility", "hidden");
    popup.css("display", "block");
    var width = popup.find("." + toClass).width() + 40;
    popup.width(width);
    popup.css("visibility", "");
};

$.fn.popup.defaults.loader.selector = '#popup-loader';
$.fn.popup.defaults.closer.selector = '.popup-close, .popup-close-uni';

$.fn.popup.onOpened = function ($popup) {
    $popup.find('.popup-content-container').mCustomScrollbar('update');
};

$.fn.popup.onResized = function ($popup) {
    $popup.find('.popup-content-container').mCustomScrollbar('update');
};

$.fn.popupLink.getPopup = stilago.popup.getByName;

$.fn.popupLink.getPopupFromAjaxResult = function ($result) {
    return $result.filter('.popup').first();
};

$(document).ready(function () {
    stilago.popup.openAllActive();
    $(document).on('click', '.popup-link', function (event) {
        $(this).popupLink();
        event.preventDefault();
    });
});