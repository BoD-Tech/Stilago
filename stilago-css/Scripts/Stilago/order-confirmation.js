stilago.orderConfirmation = {};

stilago.orderConfirmation.orderConfirmationCallback = function (data) {
    var orderConfirmationPopup = stilago.popup.replace(stilago.orderConfirmation.orderConfirmationPopupName, $(data.responseText));
    var successForm = orderConfirmationPopup.find('form[data-stilago-success="True"]');
    if (successForm.length > 0) {
        var redirectUrl = successForm.data('stilago-returnurl');
        window.location = redirectUrl;
    }
};