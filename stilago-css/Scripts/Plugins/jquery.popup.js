(function ($) {

    $.fn.popup = function (options) {
        var opts = $.extend(true, {}, $.fn.popup.defaults, getOptionsFromData($(this)), options);

        this.each(function () {
            try {
                switch(opts.action) {
                    case 'open':
                        open($(this), opts);
                        break;
                    case 'close':
                        close($(this), opts);
                        break;
                    case 'unregister':
                        unregister($(this));
                        break;
                }
            } catch(error) {
                log(error);
            }
        });

        return this;
    };

    $.fn.popup.defaults = {
        action: 'open',
        preserveOther: false,
        destroyOnClose: false,
        eventsNamespace: 'popup',
        cacheAjax: false,
        shade: {
            display: true,
            selector: '.shade',
            closeOnClick: true
        },
        loader: {
            display: true,
            selector: '.loader'
        },
        closer: {
            selector: '.closer'
        },
        positioning: {
            minTopOffset: 110,
            marginBottom: 20
        },
        timing: {
            open: 400,
            close: 300,
            reposition: 400,
            resizeCheck: 350
        },
        events: {
            onOpen: function () { },
            onOpened: function () { },
            onResized: function () { },
            onClose: function () { }
        }
    };

    $.fn.popup.onOpen = function () { };
    $.fn.popup.onOpened = function () { };
    $.fn.popup.onResized = function () { };
    $.fn.popup.onClose = function () { };

    var openPopups = [];
    var resizeWatchDogs = [];

    function open($popup, options) {
        if (isOpen($popup)) {
            return false;
        }

        var $closeElements;

        var $closer = getCloser($popup, options);
        $closer.removeClass('invisible');
        $closeElements = $closer;

        if (options.shade.display) {
            var $shade = getShade(options);
            if (options.shade.closeOnClick) {
                $closeElements = $closeElements.add($shade);
            }
            if ((!$shade.is(':visible')) || ($shade.is(':animated'))) {
                $shade.stop(true, true).fadeIn(options.timing.open);
            }
        }
        
        setCloseTriggers($popup, $closeElements, options);

        updateData($popup, options);
        
        var fadeInDelay = 0;
        
        if ((options.preserveOther) && (isAnyOpen($popup))) {
            repositionAllBelow($popup, 0, options);
            fadeInDelay = options.timing.reposition;
        }

        var isAlreadyVisible = $popup.is(':visible');
        if (!isAlreadyVisible) {
            $popup.delay(fadeInDelay).fadeIn(options.timing.open, function() {
                addResizeWatchDog($popup, options);
                triggerEventHandlers($popup, 'opened', options);
            });
        }

        register($popup);
        triggerEventHandlers($popup, 'open', options);

        if (isAlreadyVisible) {
            addResizeWatchDog($popup, options);
            triggerEventHandlers($popup, 'opened', options);
        }

        if (!options.preserveOther) {
            closeAll(options, $popup);
        }

        return true;
    }
    
    function closeAll(options, $exceptForPopup) {
        for (var i = 0; i < openPopups.length; i++) {
            if ((typeof $exceptForPopup === "undefined") || (!equals(openPopups[i], $exceptForPopup))) {
                close(openPopups[i], options);
            }
        }
    }

    function close($popup, options) {
        $popup.trigger('close');
        $popup.fadeOut(options.timing.close, function () {
            if (options.destroyOnClose) {
                $(this).remove();
            }
        });

        var $popupAbove = getPopupAbove($popup);

        if (!isAnyOpen($popup)) {
            var $shade = getShade(options);
            if ($shade.is(':visible')) {
                $shade.off('.' + options.eventsNamespace).fadeOut(options.timing.close);
            }
        }

        unregister($popup);
        triggerEventHandlers($popup, 'close', options);
        
        repositionAllBelow($popupAbove, options.timing.close, options);
        jumpTo($popup, options.positioning.minTopOffset);
    }

    function repositionAllBelow($popup, delay, options) {
        var popupsAbove = [];
        var popupsBelow = getPopupsBelow($popup);
        
        if ($popup != null) {
            popupsAbove.push($popup);
        }

        for (var i = 0; i < popupsBelow.length; i++) {
            var topOffset = getTopOffsetFrom(popupsBelow[i], popupsAbove, options);
            moveTo(popupsBelow[i], topOffset, delay, options);
            popupsAbove.push(popupsBelow[i]);
        }
    }
    
    function getPopupsBelow($popup) {
        if (($popup == null) || (!isOpen($popup))) {
            return openPopups;
        }
        
        for (var i = 0; i < openPopups.length; i++) {
            if (equals(openPopups[i], $popup)) {
                return openPopups.slice(i+1);
            }
        }

        return [];
    }
    
    function getPopupAbove($popup) {
        for (var i = 0; i < openPopups.length; i++) {
            if (equals($popup, openPopups[i])) {
                if (i == 0) {
                    return null;
                } else {
                    return openPopups[i - 1];
                }
            }
        }

        return null;
    }
    
    function getTopOffsetFrom($popup, popupsAbove, options) {
        if (popupsAbove.length == 0) {
            return getMinTopOffsetData($popup);
        }

        var topOffset = getMinTopOffsetData(popupsAbove[popupsAbove.length - 1]);
        for (var i = 0; i < popupsAbove.length; i++) {
            topOffset += getHeightData(popupsAbove[i]) + options.positioning.marginBottom;
        }

        return topOffset;
    }

    function moveTo($popup, topOffset, delay, options) {
        $popup.delay(delay).animate({
            top: topOffset
        }, options.timing.reposition);
    }
    
    function jumpTo($popup, topOffset) {
        $popup.animate({
            top: topOffset
        }, 0);
    }

    function isAnyOpen($exceptForPopup) {
        if (typeof $exceptForPopup === "undefined") {
            return (openPopups.length > 0);
        } else {
            return (!isOpen($exceptForPopup) ? (openPopups.length > 0) : (openPopups.length > 1));
        }
    }

    function isOpen($popup) {
        for (var i = 0; i < openPopups.length; i++) {
            if (equals(openPopups[i], $popup)) {
                return true;
            }
        }

        return false;
    }
    
    function register($popup) {
        openPopups.unshift($popup);
    }

    function unregister($popup) {
        removeResizeWatchDog($popup);
        for (var i = openPopups.length - 1; i >= 0; i--) {
            if (equals(openPopups[i], $popup)) {
                openPopups.splice(i, 1);
            }
        }
    }

    function getCloser($popup, options) {
        var $closer = $popup.find(options.closer.selector);
        if ($closer.size() == 0) {
            throw "Popup closer '" + options.closer.selector + "' was not found.'";
        }
        return $closer;
    }
    
    function getShade(options) {
        var $shade = $(options.shade.selector);
        if ($shade.size() == 0) {
            throw "Shade '" + options.shade.selector + "' was not found.'";
        }
        return $shade;
    }
    
    function getLoader(options) {
        var $loader = $(options.loader.selector);
        if ($loader.size() == 0) {
            throw "Loader '" + options.loader.selector + "' was not found.'";
        }
        return $loader;
    }
    
    function setCloseTriggers($popup, $elements, options) {
        $elements.one('click.' + options.eventsNamespace, function (event) {
            if (isOpen($popup)) {
                close($popup, options);
            }
            event.preventDefault();
        });
    }
    
    function addResizeWatchDog($popup, options) {
        var resizeCheckInterval = setInterval(function () {
            checkHeightChange($popup, options);
        }, options.timing.resizeCheck);
        resizeWatchDogs.push({ popup: $popup, interval: resizeCheckInterval });
    }
    
    function removeResizeWatchDog($popup) {
        for (var i = 0; i < resizeWatchDogs.length; i++) {
            if (equals(resizeWatchDogs[i].popup, $popup)) {
                clearInterval(resizeWatchDogs[i].interval);
                resizeWatchDogs.splice(i, 1);
            }
        }
    }
    
    function checkHeightChange($popup, options) {
        if (!$popup.is(':visible')) {
            return;
        }

        if ($popup.outerHeight() != getHeightData($popup)) {
            setHeightData($popup);
            triggerEventHandlers($popup, 'resized', options);
            repositionAllBelow($popup, 0, options);
        }
    }

    function updateData($popup, options) {
        if ($popup.is(':visible')) {
            setData($popup, options);
        } else if ($popup.hasClass('invisible')) {
            $popup.show();
            setData($popup, options);
            $popup.hide();
        } else {
            $popup.addClass('invisible').show();
            setData($popup, options);
            $popup.hide().removeClass('invisible');
        }
    }
    
    function setData($popup, options) {
        setHeightData($popup);
        setMinTopOffsetData($popup, options);
    }
    
    function setHeightData($popup) {
        $popup.attr('data-popup-height', $popup.outerHeight());
    }
    
    function getHeightData($popup) {
        return ($popup.attr('data-popup-height') * 1);
    }
    
    function setMinTopOffsetData($popup, options) {
        $popup.attr('data-popup-min-top-offset', options.positioning.minTopOffset);
    }
    
    function getMinTopOffsetData($popup) {
        return ($popup.attr('data-popup-min-top-offset') * 1);
    }
    
    function equals($popup1, $popup2) {
        return ($popup1.get(0) === $popup2.get(0));
    }

    $.fn.popupLink = function (options) {
        var opts = $.extend(true, {}, getOptionsFromData($(this)), options);
        this.each(function () {
            try {
                openByLink($(this), opts);
            } catch (error) {
                log(error);
            }
        });

        return this;
    };

    $.fn.popupLink.getPopup = function (name) {
        return $('#' + name);
    };
    
    $.fn.popupLink.getPopupFromAjaxResult = function ($html) {
        return $html;
    };

    function getOptionsFromData($element) {
        var options = {};
        var popupDataString = $element.attr('data-popup');
        
        if ((typeof popupDataString === "undefined") || (popupDataString == null) || (popupDataString.length == 0)) {
            return options;
        }

        var popupData = popupDataString.split(',');
        for (var i = 0; i < popupData.length; i++) {
            options = $.extend({}, options, getOptionsFromKeyValueString($.trim(popupData[i])));
        }

        return options;
    }
    
    function getOptionsFromKeyValueString(keyValueString) {
        var key;
        var value = null;
        
        if (keyValueString.indexOf(':') > -1) {
            var keyValuePair = keyValueString.split(':');
            key = $.trim(keyValuePair[0]);
            value = $.trim(keyValuePair[1]);
        } else {
            key = keyValueString;
        }

        return getOptionsFromKeyValuePair(key, value);
    }
    
    function getOptionsFromKeyValuePair(key, value) {
        switch(key) {
            case 'preserve-other':
                return { preserveOther: true };
            case 'destroy-on-close':
                return { destroyOnClose: true };
            case 'use-cache':
                return { cacheAjax: true };
            case 'no-shade':
                return { shade: { display: false } };
            case 'shade-selector':
                return { shade: { selector: value } };
            case 'shade-no-close':
                return { shade: { closeOnClick: false } };
            case 'no-loader':
                return { loader: { display: false } };
            case 'loader-selector':
                return { loader: { selector: value } };
            case 'closer-selector':
                return { closer: { selector: value } };
            case 'min-top-offset':
                return { positioning: { minTopOffset: (value * 1) } };
            case 'timing-open':
                return { timing: { open: (value * 1) } };
            case 'timing-close':
                return { timing: { close: (value * 1) } };
            case 'timing-reposition':
                return { timing: { reposition: (value * 1) } };
            case 'timing-resize-check':
                return { timing: { resizeCheck: (value * 1) } };
            case 'on-open':
                return { events: { onOpen: value } };
            case 'on-opened':
                return { events: { onOpened: value } };
            case 'on-resized':
                return { events: { onResized: value } };
            case 'on-close':
                return { events: { onClose: value } };
            default:
                return {};
        }
    }
    
    function openByLink($popupLink, options) {
        var opts = $.extend(true, {}, options, { action: 'open' });
        if (isAnchorLink($popupLink)) {
            openByName(getPopupName($popupLink), opts);
        } else {
            var o = $.extend(true, {}, opts, { destroyOnClose: true });
            openByUrl(getPopupUrl($popupLink), o);
        }
    }
    
    function isAnchorLink($popupLink) {
        return ($popupLink.attr('href').indexOf('#') > -1 );
    }

    function getPopupName($popupLink) {
        var name = $popupLink.attr('href').split('#')[1];
        if (name == '') {
            throw "Popup name is empty.";
        }
        return name;
    }
    
    function openByName(name, options) {
        $.fn.popupLink.getPopup(name).popup(options);
    }
    
    function getPopupUrl($popupLink) {
        var href = $popupLink.attr('href');
        if (href.length == 0) {
            throw "Popup link href attribute is empty.";
        }
        return href;
    }

    function openByUrl(url, options) {
        var tmpOptions = $.extend(true, {}, $.fn.popup.defaults, options);

        var $loader = getLoader(tmpOptions);
        if (tmpOptions.loader.display) {
            $loader.fadeIn(300);
        }
        $.ajax({
                "url": url,
                "cache": tmpOptions.cacheAjax,
                "dataType": 'html'
            })
            .done(function (html) {
                var $result = $(html).appendTo('body');
                var $popup = $.fn.popupLink.getPopupFromAjaxResult($result);
                $popup.popup(options);
            })
            .fail(function() {
                log("Popup for url '" + url + "' was not loaded.");
            })
            .always(function() {
                $loader.fadeOut(100);
            });
    }

    function triggerEventHandlers($popup, event, options) {
        var eventMethodName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
        
        var generalEventHandler = $.fn.popup[eventMethodName];
        invokeGeneralEventHandler($popup, generalEventHandler);
        
        var popupSpecificEventHandler = options.events[eventMethodName];
        invokePopupSpecificEventHandler($popup, popupSpecificEventHandler);
    }
    
    function invokeGeneralEventHandler($popup, handler) {
        if (typeof handler === 'function') {
            handler($popup);
        } else {
            eval(handler + '($popup);');
        }
    }

    function invokePopupSpecificEventHandler($popup, handler) {
        if (typeof handler === 'function') {
            handler.call($popup);
        } else {
            eval(handler + '.call($popup);');
        }
    }
    
    function log(message) {
        window.console && console.log("Popup: " + message);
    }

}(jQuery));