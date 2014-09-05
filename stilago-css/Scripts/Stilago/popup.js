$.fn.popup.onOpen = function ($popup) {
    stilago.customizeInputs($popup);
    $.validator.unobtrusive.parse($popup.find('.popup-content-container form'));
};