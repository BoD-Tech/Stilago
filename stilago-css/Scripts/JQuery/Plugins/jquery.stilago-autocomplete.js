(function ($) {

    $.fn.stilagoAutoComplete = function (selectCallback) {
        var extractProperties = function (me) {
            var properties = $(me).attr('data-property-set');
            return properties.split(';');
        };

        return $(this).each(function() {
            var me = $(this);

            // add a handler to be able to detect user deleted a content
            // currently is set to stilago.zipCodeKeyupCallbackRU function for Russia
            // located in Scripts/Stil2go/delivery-profile.js
            me.on('keyup', function(e) {

                var keyupCallbackFunction = $(me).attr("keyup-callback-function");
                if (keyupCallbackFunction !== undefined) {
                    var functionText = keyupCallbackFunction + '($(this))';
                    eval(functionText);
                }
            });

            me.on('blur', function(e) {
                if ($(me).data('stilagoAutoCompleteLastResult') == null) return;

                var data = $(me).data('stilagoAutoCompleteLastResult');
                var propArr = extractProperties(me);
                var hasRightValue = false;

                if (data && data.length > 0 && propArr.length > 0) {

                    var propertyToCheck = '';
                    var idx, len, classProperty;

                    for (idx = 0, len = propArr.length; idx < len; idx++) {
                        classProperty = propArr[idx].split(':');
                        if ($(me).hasClass(classProperty[0].replace('.', '')) == true) {
                            propertyToCheck = classProperty[1];
                        }
                    }

                    for (idx = 0, len = data.length; idx < len; idx++) {
                        var item = data[idx];
                        if (item[propertyToCheck] == $(me).val()) {
                            hasRightValue = true;
                        }
                    }
                }

                if (hasRightValue == false) {
                    for (idx = 0, len = propArr.length; idx < len; idx++) {
                        classProperty = propArr[idx].split(':');
                        $(classProperty[0]).val('').change();
                    }

                    $(me).data('stilagoAutoCompleteLastResult', null);

                    if (selectCallback !== undefined) {
                        selectCallback($(this).val());
                    }

                    var selectCallbackFunction = $(me).attr('select-callback-function');
                    if (selectCallbackFunction !== undefined) {
                        var functionText = selectCallbackFunction + '($(this).val())';
                        eval(functionText);
                    }
                }
            });

            me.autocomplete({
                    source: function(request, response) {
                        $.ajax({
                            url: $(me).attr("autocomplete-url"),
                            data: { term: request.term },
                            dataType: 'json'
                        }).done(function(data) {
                            $(me).data('stilagoAutoCompleteLastResult', data);
                            response(data);
                        });
                    },
                    select: function (event, ui) {
                        var propArr = extractProperties(me);
                        for (var j = 0; j < propArr.length; j++) {
                            var prop = propArr[j];
                            var selectorAndPropName = prop.split(':');
                            var selector = selectorAndPropName[0];
                            var propertyName = selectorAndPropName[1];
                            $(selector).val(ui.item[propertyName]).change();
                        }
                        if (selectCallback !== undefined) {
                            selectCallback(ui.item);
                        }
                        var selectCallbackFunction = $(me).attr('select-callback-function');
                        if (selectCallbackFunction !== undefined) {
                            var functionText = selectCallbackFunction + '(ui.item)';
                            eval(functionText);
                        }

                        return false;
                    },
                    delay: 0
                })
                .data('ui-autocomplete')._renderItem = function(ul, item) {
                    var funcName = me.attr('data-render-func');
                    var callText = funcName + '(ul, item)';
                    var result = eval(callText);
                    return result;
                };
        });
    };
}(jQuery));