(function ($) {

    $.fn.scrollTo = function(options) {
        var opts = $.extend({}, $.fn.anchor.defaults, options);
        var $this = $(this);
        
        if ($this.size() == 0) {
            $this = $('body');
        }
        
        if ((opts.scrollDownEnabled) || ($(window).scrollTop() > $this.offset().top)) {
            $('body, html').animate({ scrollTop: $this.offset().top }, opts.duration);
        }
    };

    $.fn.anchor = function (options) {
        var opts = $.extend({}, $.fn.anchor.defaults, options);

        return $(this).live('click', function (event) {
            event.preventDefault();
            var $this = $(this);

            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            transitionFrom(this, o);
        });
    };

    $.fn.anchor.defaults = {
        duration: 350,
        scrollDownEnabled: true,
        onTransitionStart: function () { },
        onTransitionFinish: function () { }
    };

    $.fn.anchor.transition = function ($target, options) {
        $target.scrollTo(options);
    };

    function transitionFrom(source, options) {
        var $target = getTarget(source);
        if ($target != null) {
            options.onTransitionStart.call(source, $target.first());
            $.fn.anchor.transition($target.first(), options);
            options.onTransitionFinish.call(source, $target.first());
        }
    }
    
    function getTarget(source) {
        var href = $(source).attr('href');

        if (href == '#') {
            return ($('body'));
        } else {
            return getTargetByHref(href);
        }
    }
    
    function getTargetByHref(href) {
        var targetTitle = href.substr(1);
        
        if (targetTitle == '') {
            window.console.log('Target element was not specified.');
            return null;
        }

        var $target = $('#' + targetTitle).add('a[name="' + targetTitle + '"]');
        if ($target.size() == 0) {
            window.console.log('Target element (' + targetTitle + ') not found within the page.');
            return null;
        }

        return $target;
    }

}(jQuery));