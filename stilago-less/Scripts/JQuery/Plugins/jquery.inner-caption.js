(function ($) {
    $.fn.innerCaption = function () {
        return $(this).each(function () {
            var me = $(this);
            if (me.attr('data-caption') && me.val() == '') {
                me.val(me.attr('data-caption'));
                }

                me.focus(function () {
                    if (me.hasClass('edit-mode')) return;
                    var that = $(this);
                    that.addClass('focused');
                    if (that.val() == that.attr('data-caption')) {
                        that.attr('value', '');
                    }
                });

                me.blur(function () {
                    if (me.hasClass('edit-mode')) return;
                    var that = $(this);
                    var val = that.val();
                    if (!val || val == that.attr('data-caption')) {
                        that.removeClass('focused');
                        that.val(that.attr('data-caption'));
                    }
                });

                me.closest('form').submit(function () {
                    if (me.hasClass('edit-mode')) return;
                    if (me.val() == me.attr('data-caption')) {
                        me.attr('value', '');
                    }
                });
                
                me.bind('change', function (e) {
                    if (!me.hasClass('edit-mode')) return;
                    var that = $(this);
                    that.val(that.attr('data-caption'));
                });
        });
    };
} (jQuery));