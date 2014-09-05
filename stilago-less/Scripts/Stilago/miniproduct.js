stilago.miniproduct = {};
stilago.miniproduct.containerSelector = '.mini-product-list';
stilago.miniproduct.productSelector = '.mini-product';
stilago.miniproduct.maxSizesHeight = 50;

stilago.miniproduct.loadOptions = function (productContainer, optionsUrl) {
    var getOptionsData = {
        "productId": productContainer.attr('data-product-id'),
        "productUrl": productContainer.attr('data-product-url')
    };

    $.get(optionsUrl, getOptionsData, function (html) {
        productContainer.find('.option-lists-container').html(html);
        stilago.miniproduct.initOptions(productContainer);
    }, 'html');
};

stilago.miniproduct.initOptions = function(productContainer) {
    var optionListContainer = productContainer.find('.option-lists-container');
    optionListContainer.removeClass('loading');

    productContainer.find(".options-list li:not('.size-continue') a").click(function () {
        var optionId = $(this).closest('li').attr('data-id');
        stilago.miniproduct.chooseOption(optionId, productContainer);
        return false;
    });

    stilago.miniproduct.showFromKeywordIfRequired(productContainer);

    //initialize sizes
    productContainer.find(".image-container").hover(function () {
        var sizeList = $(this).find('.options-list.sizes');
        var height = sizeList.height();
        if (height > stilago.miniproduct.maxSizesHeight) {
                $(this).find('.see-all-sizes-button').removeClass('hide');
                $(this).find('.size-continue').removeClass('hide');
        }
        while (height > stilago.miniproduct.maxSizesHeight && sizeList.find('li').length > 1) {
            sizeList.find('li').first().remove();
            height = sizeList.height();
        }
     }
    );
};

stilago.miniproduct.clearOption = function (productContainer) {
    var container = stilago.miniproduct.getContainerByProduct(productContainer);

    var selectedOptionClass = container.attr('data-selected-options-class');
    productContainer.find('.options-list li.' + selectedOptionClass).removeClass(selectedOptionClass);

    stilago.miniproduct.showFromKeywordIfRequired(productContainer);
    stilago.miniproduct.resetPrices(productContainer);

    productContainer.find('input[name*="productOptionId"]').val('');
};

stilago.miniproduct.showFromKeywordIfRequired = function (productContainer) {
    if (!stilago.miniproduct.allOptionsHaveSamePrice(productContainer)) {
        productContainer.find('.prices .from').show();
    }
};

stilago.miniproduct.allOptionsHaveSamePrice = function (productContainer) {
    return (productContainer.find('.options-list').attr('data-option-same-price') == true.toString());
};

stilago.miniproduct.chooseOption = function(id, productContainer) {
    var container = stilago.miniproduct.getContainerByProduct(productContainer);

    var selectedOptionClass = container.attr('data-selected-options-class');
    var optionListItem = productContainer.find('.options-list li[data-id="' + id + '"]');
    var priceInfo = stilago.miniproduct.getPriceInfoFromElement(optionListItem);

    if (optionListItem.hasClass('disabled')) {
        return false;
    }

    productContainer.find('.options-list li.' + selectedOptionClass).removeClass(selectedOptionClass);
    optionListItem.addClass(selectedOptionClass);

    productContainer.find('.prices .from').hide();
    stilago.miniproduct.updatePrices(productContainer, priceInfo);

    productContainer.find('input[name*="productOptionId"]').val(id);

    return true;
};

stilago.miniproduct.getPriceInfoFromElement = function (element) {
    return {
        "price": element.attr('data-price'),
        "showPrice": element.attr('data-price-show') == 'true',
        "discountedPrice": element.attr('data-discounted-price'),
        "discountPercentage": element.attr('data-discount-percentage')
    };
};

stilago.miniproduct.resetPrices = function (productContainer) {
    var priceInfo = stilago.miniproduct.getPriceInfoFromElement(productContainer);
    stilago.miniproduct.updatePrices(productContainer, priceInfo);
};

stilago.miniproduct.updatePrices = function (productContainer, priceInfo) {
    //price
    var priceContainer = productContainer.find('.price-container');
    if (priceInfo.showPrice) {
        priceContainer.find('.value').text(priceInfo.price);
        priceContainer.removeClass('hidden');
    } else {
        priceContainer.addClass('hidden');
    }

    //discounted price
    var discountedPriceContainer = productContainer.find('.discounted-price-container');
    discountedPriceContainer.find('.value').text(priceInfo.discountedPrice);

    //discount percentage
    var discountPercentageContainer = productContainer.find('.discount-percentage-container');
    if (priceInfo.discountPercentage > 0) {
        discountPercentageContainer.find('.value').text(priceInfo.discountPercentage);
        discountPercentageContainer.removeClass('hidden');
    } else {
        discountPercentageContainer.addClass('hidden');
    }
};

stilago.miniproduct.addToCartCallback = function (data) {
    var productContainer = $(stilago.miniproduct.productSelector + '[data-product-id=' + data.productId + ']');
    var container = stilago.miniproduct.getContainerByProduct(productContainer);

    stilago.minicart.replaceContent(data.miniCartContent);
    productContainer.find('.option-lists-container').html(data.optionsContent);

    var trackingCodesContainer = container.siblings('.tracking-codes');
    trackingCodesContainer.append(data.trackingCodeDeclarationContent);
    trackingCodesContainer.append(data.trackingCodeLayoutContent);

    stilago.miniproduct.initOptions(productContainer);

    if (data.success) {
        stilago.minicart.refreshAndShowContentIfNotEmpty(true, false);
        stilago.miniproduct.clearOption(productContainer);
    } else {
        var productDetailsUrl = productContainer.find('.product-details-link').attr('href');
        document.location.href = productDetailsUrl;
    }
};

stilago.miniproduct.getContainerByProduct = function(productContainer) {
    return productContainer.closest(stilago.miniproduct.containerSelector);
};

stilago.miniproduct.initProduct = function (productContainer, optionsAsync, optionsUrl) {
    //initialise (and load) options
    if (optionsAsync) {
        stilago.miniproduct.loadOptions(productContainer, optionsUrl);
    } else {
        stilago.miniproduct.initOptions(productContainer);
    }

    //initialise add to cart button
    productContainer.find('.addtocart-button').click(function () {
        if (productContainer.find('input[name*="productOptionId"]').val() == '') {
            var previewButton = productContainer.find('.preview-button');

            var newAttributes = previewButton.attr('data-popup').replace('stilago.productoverview.ready', 'stilago.productoverview.readyWithNotSelectedSizeError');
            previewButton.attr('data-popup', newAttributes);
            previewButton.popupLink();

            return false;
        }

        productContainer.find('.see-all-sizes-button').addClass('hide');

        $(this).closest('form').submit();

        return false;
    });

    //?????????
};

stilago.miniproduct.initProductList = function(container) {
    var optionsAsync = (container.attr('data-options-async') == true.toString());
    var optionsUrl = container.attr('data-options-url');

    var productContainers = container.find(stilago.miniproduct.productSelector);

    productContainers.each(function () {
        stilago.miniproduct.initProduct($(this), optionsAsync, optionsUrl);
    });
};

$(document).ready(function() {
    var containers = $(stilago.miniproduct.containerSelector);
    containers.each(function () {
        stilago.miniproduct.initProductList($(this));
    });
});
