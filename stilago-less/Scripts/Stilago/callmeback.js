stilago.callmeback = {};

$(document).ready(function () {


    
    stilago.callmeback.container = $('.call-me-back-slider-menu');
    var callMeBackBox = stilago.callmeback.container;
   // var mainView = container.find('#callMeBackForm');
    
    callMeBackBox.find('.phone-number-input-prefix').stilagoAutoComplete();


    //tole je za submit
    $('call-me-button').on('click', function (e) {
        e.preventDefault();
        if ($(this).closest('.call-me-back-state').hasClass('call-me-back-start')) {
            $(this).closest('.call-me-back-state').removeClass('call-me-back-start').addClass('call-me-back-form');
        } else {
            $('#callMeBackForm').submit();
        }
    });

    
    
    $('.call-me-back-image').on('click', function (e) {
        e.preventDefault();
        if (callMeBackBox.hasClass('active')) {
            callMeBackBox.animate({ right: '-360px' }, 500, function() {
                callMeBackBox.removeClass('active');

            });
        } else {
            
            callMeBackBox.animate({ right: '0px' }, 500, function () {
                callMeBackBox.addClass('active');
               // container.find('.content').html(mainView);
            });
        }
    });
    
    $('.close-button').on('click', function (e) {
        e.preventDefault();
        if (callMeBackBox.hasClass('active')) {
            callMeBackBox.animate({ right: '-360px' }, 500, function () {
                callMeBackBox.removeClass('active');
             //   container.find('.content').html(mainView);
            });
        }
    });

});



stilago.callmeback.CallBack = function (data, status) {

    var container = stilago.callmeback.container;

     if (data == true) {
    var value = container.find('#message').removeClass('call-me-back-finish-hidden');
    container.find('#callMeBackForm').html(value);
    
   } else {
         
         var value = container.find('#messageError').removeClass('call-me-back-finish-hidden');
         container.find('#callMeBackForm').html(value);
     }
    
};
