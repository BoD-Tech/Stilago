(function ($) {
    $.fn.loadImage = function (cancellationCallback) {
        return $(this).each(function () {
            if (cancellationCallback != undefined && cancellationCallback != null && cancellationCallback()) return;
            var me = $(this);
            if (me.attr('data-image-url')) {
                var img = $('<img alt="" />');
                img.load(function () {
                    $(this).fadeOut('normal', function () {
                        me.attr('src', img.attr('src')).show();
                        me.parent().find('.img-loader').removeClass('img-loader');
                        img = null;
                    });
                });
                img.attr('src', me.attr('data-image-url'));
                me.css("width", "100%");
            }
        });
    };
}(jQuery));