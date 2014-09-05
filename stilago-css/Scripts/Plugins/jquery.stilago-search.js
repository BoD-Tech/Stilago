(function ($) {

    $.fn.stilagoSearch = function (options) {
        var opts = $.extend(true, {}, $.fn.stilagoSearch.defaults, options);

        this.each(function () {
            try {
                initialize($(this), opts);
            } catch(error) {
                log(error);
            }
        });

        return this;
    };

    $.fn.stilagoSearch.defaults = {
        containerSelector: '.header',
        highlightHtml: '<span class="ui-state-highlight">$&</span>'
    };

    $.fn.stilagoSearch.renderProductItem = function() {
        throw new "Method renderProductItem was not implemented";
    };
    
    $.fn.stilagoSearch.renderBrandItem = function() {
        throw new "Method renderBrandItem was not implemented";
    };
    
    $.fn.stilagoSearch.renderCategoryItem = function() {
        throw new "Method renderCategoryItem was not implemented";
    };
    
    $.fn.stilagoSearch.highlightByCriteria = function(text, criteria, options) {
        var criteriaRegExp = new RegExp(criteria, "gi");
        return String(text).replace(criteriaRegExp, options.highlightHtml);
    };

    function initialize($input, options) {
        $input.autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: $input.attr('data-ahref'),
                    type: 'POST',
                    cache: false,
                    data: request,
                    dataType: 'json',
                    success: function (json) {
                        response(json);
                    }
                });
            },

            select: function (event, ui) {
                if (ui.item.MagazineCode) {
                    $input.val(ui.item.Name);
                } else if (ui.item.BrandId) {
                    $input.val(ui.item.BrandName);
                } else if (ui.item.NameLevel3) {
                    $input.val(ui.item.NameLevel2 + ' - ' + ui.item.NameLevel3);
                } else if (ui.item.NameLevel2) {
                    $input.val(ui.item.NameLevel2);
                }
                window.location = ui.item.Url;
                return false;
            },

            appendTo: $(options.containerSelector)  // makes possible to have specific css for this autocomplete
        });

        $input.data('ui-autocomplete')._renderItem = function (ul, item) {
            var li = $("<li>").data("ui-autocomplete-item", item);
            renderItem(li, item, this.term, options);
            return li.appendTo(ul);
        };
    }
    
    function renderItem(li, item, searchedTerm, options) {
        if (item.MagazineCode) {
            $.fn.stilagoSearch.renderProductItem(li, item, searchedTerm, options);
        } else if (item.BrandId) {
            $.fn.stilagoSearch.renderBrandItem(li, item, searchedTerm, options);
        } else if (item.NameLevel1) {
            $.fn.stilagoSearch.renderCategoryItem(li, item, searchedTerm, options);
        }
    };

    function log(message) {
        window.console && console.log("StilagoSearch: " + message);
    }

}(jQuery));