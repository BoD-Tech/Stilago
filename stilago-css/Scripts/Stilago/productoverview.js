stilago.productoverview = {};
stilago.productoverview.jqzoomOptions = {};

if (jQuery.browser.msie && jQuery.browser.version < 8) {
    stilago.productoverview.jqzoomOptions = {
        zoomWidth: 381,
        zoomHeight: 381,
        xOffset: 40,
        yOffset: 0,
        zoomType: 'reverse',
        imageOpacity: 0.4,
        title: false
    };
} else {
    stilago.productoverview.jqzoomOptions = {
        zoomWidth: 381,
        zoomHeight: 381,
        xOffset: 36,
        yOffset: 0,
        zoomType: 'reverse',
        imageOpacity: 0.4,
        title: false
    };
}

stilago.productoverview.carouFredSelOptions = {
    circular: false,
    infinite: false,
    direction: 'up',
    width: 54,
    height: 'variable',
    items: {
        visible: 5,
        minimum: 6,
        start: 0
    },
    scroll: {
        items: 5,
        fx: 'scroll',
        event: 'click'
    },
    auto: {
        play: false
    },
    prev: '.prev',
    next: '.next'
};

stilago.productoverview.applyCarrousel = function(productContainer) {
    productContainer.find('.thumbnail-images .carousel').carouFredSel(stilago.productoverview.carouFredSelOptions);
};

stilago.productoverview.applyJqzoom = function (productContainer, previewImageUrl, zoomedImageUrl) {
    productContainer.find('.image-preview-jqzoom').html(
        '<a class="jqzoom" href="' + zoomedImageUrl + '"><img src="' + previewImageUrl + '" width="294" height="439" alt="" /></a>'
    );

    $(".jqzoom").jqzoom(stilago.productoverview.jqzoomOptions);
};

stilago.productoverview.initTabs = function (productContainer) {
    var tabs = productContainer.find('.tabs');
    tabs.find('.tab-title').click(function () {
        var item = $(this).closest('.item');
        if (item.hasClass('active')) {
            tabs.find('.item').removeClass('active');
        } else {
            tabs.find('.item').removeClass('active');
            item.addClass('active');
        }
        return false;
    });
};

stilago.productoverview.loadOptions = function (productContainer, optionsUrl) {
    var productId = productContainer.attr('data-product-id');
    var productUrl = productContainer.attr('data-product-url');

    var getOptionsData = {
        "productId": productId,
        "productUrl": productUrl
    };

    var preselectedProductOptionId = productContainer.find('input[name="productOptionId"]').val();
    if (preselectedProductOptionId != '') {
        getOptionsData.preselectedProductOptionId = preselectedProductOptionId;
    }

    $.get(optionsUrl, getOptionsData, function (html) {
        productContainer.find('.option-lists-container').html(html);

        var preselectedOptionId = productContainer.find('.options-list').attr('data-preselected-option-id');
        if (preselectedOptionId) {
            stilago.productoverview.chooseOption(preselectedOptionId, productContainer);
        }

        stilago.productoverview.initOptions(productContainer);
    }, 'html');
};

stilago.productoverview.initOptions = function (productContainer) {
    var optionListContainer = productContainer.find('.option-lists-container');
    optionListContainer.removeClass('loading');

    productContainer.find('.options-list a').click(function () {
        var optionId = $(this).closest('li').attr('data-id');
        stilago.productoverview.chooseOption(optionId, productContainer);
        return false;
    });

    var preselectedOptionId = productContainer.find('input[name="productOptionId"]').val();
    if (preselectedOptionId == '') {
        stilago.productoverview.showFromKeywordIfRequired(productContainer);
    }
};

stilago.productoverview.clearOption = function (productContainer) {
    var selectedOptionClass = productContainer.attr('data-selected-options-class');
    productContainer.find('.options-list li.' + selectedOptionClass).removeClass(selectedOptionClass);

    stilago.productoverview.showFromKeywordIfRequired(productContainer);
    stilago.productoverview.resetPrices(productContainer);
    stilago.productoverview.resetStock(productContainer);

    productContainer.find('input[name="productOptionId"]').val('');
};

stilago.productoverview.showFromKeywordIfRequired = function (productContainer) {
    if (!stilago.productoverview.allOptionsHaveSamePrice(productContainer)) {
        productContainer.find('.prices .from').removeClass('hidden');
    }
};

stilago.productoverview.allOptionsHaveSamePrice = function (productContainer) {
    return (productContainer.find('.options-list').attr('data-option-same-price') == true.toString());
};

stilago.productoverview.chooseOption = function(id, productContainer) {
    var selectedOptionClass = productContainer.attr('data-selected-options-class');
    var optionListItem = productContainer.find('.options-list li[data-id="' + id + '"]');
    var priceInfo = stilago.productoverview.getPriceInfoFromElement(optionListItem);
    var stockQuantity = optionListItem.attr('data-quantity');

    if (optionListItem.hasClass('disabled')) {
        return false;
    }

    productContainer.find('.options-list li.' + selectedOptionClass).removeClass(selectedOptionClass);
    optionListItem.addClass(selectedOptionClass);

    productContainer.find('.validation-error.option-not-selected').removeClass('visible');

    productContainer.find('.prices .from').addClass('hidden');
    stilago.productoverview.updatePrices(productContainer, priceInfo);
    stilago.productoverview.updateStock(productContainer, Number(stockQuantity));

    productContainer.find('input[name="productOptionId"]').val(id);

    return true;
};

stilago.productoverview.getPriceInfoFromElement = function (element) {
    return {
        "price": element.attr('data-price'),
        "showPrice": element.attr('data-price-show') == 'true',
        "discountedPrice": element.attr('data-discounted-price'),
        "discountPercentage": element.attr('data-discount-percentage')
    };
};

stilago.productoverview.resetPrices = function (productContainer) {
    var priceInfo = stilago.productoverview.getPriceInfoFromElement(productContainer);
    stilago.productoverview.updatePrices(productContainer, priceInfo);
};

stilago.productoverview.updatePrices = function (productContainer, priceInfo) {
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

stilago.productoverview.resetStock = function (productContainer) {
    var stockContainer = productContainer.find('.stock-container');
    stockContainer.find('.stock-quantity').hide();
    stockContainer.find('.stock-enough').hide();
};

stilago.productoverview.updateStock = function (productContainer, stockQuantity) {
    var stockContainer = productContainer.find('.stock-container');
    stockContainer.find('.value').text(stockQuantity);
    if (stockQuantity < 5) {
        stockContainer.find('.stock-quantity').show();
        stockContainer.find('.stock-enough').hide();
    } else {
        stockContainer.find('.stock-quantity').hide();
        stockContainer.find('.stock-enough').show();
    }
};

stilago.productoverview.addToCartCallback = function (data) {
    var productContainer = $('.product-details.overview-popup[data-product-id=' + data.productId + ']');

    stilago.minicart.replaceContent(data.miniCartContent);
    productContainer.find('.cart-limitation').html(data.cartLimitationContent);
    productContainer.find('.option-lists-container').html(data.optionsContent);

    var trackingCodesContainer = productContainer.siblings('.tracking-codes');
    trackingCodesContainer.append(data.trackingCodeDeclarationContent);
    trackingCodesContainer.append(data.trackingCodeLayoutContent);

    stilago.productoverview.initOptions(productContainer);

    if (data.success) {
        stilago.productoverview.clearOption(productContainer);
        stilago.popup.close(productContainer.closest('.popup').attr('data-name'));
        stilago.minicart.refreshAndShowContentIfNotEmpty(true, false);
    }
};

stilago.productoverview.initProduct = function (productContainer, optionsAsync, optionsUrl) {
    //initialise (and load) options
    if (optionsAsync) {
        stilago.productoverview.loadOptions(productContainer, optionsUrl);
    } else {
        stilago.productoverview.initOptions(productContainer);
    }

    //initialise add to cart button
    productContainer.find('.addtocart-button').click(function () {
        productContainer.find('.validation-error').removeClass('visible');

        if (productContainer.find('input[name="productOptionId"]').val() == '') {
            productContainer.find('.validation-error.option-not-selected').addClass('visible');
            return false;
        }

        $(this).closest('form').submit();
        return false;
    });
};

stilago.productoverview.readyWithNotSelectedSizeError = function () {

    stilago.productoverview.ready.call(this);
    $(this).find('span.option-not-selected').addClass('visible');
}

stilago.productoverview.ready = function () {
    var productContainer = $(this).find('.product-details.overview-popup');

    //initialise picture slider
    stilago.productoverview.applyCarrousel(productContainer);

    //initialise picture switching and zooming
    var picturesList = productContainer.find('.thumbnail-images');

    var previewImageUrl = productContainer.find('.image-preview  img').attr('src');
    var zoomedImageUrl = picturesList.find('a[data-related-preview="' + previewImageUrl + '"]').attr('data-related-zoomed');
    stilago.productoverview.applyJqzoom(productContainer, previewImageUrl, zoomedImageUrl);

    picturesList.find('.picture a').click(function () {
        previewImageUrl = $(this).attr('data-related-preview');
        zoomedImageUrl = $(this).attr('data-related-zoomed');
        stilago.productoverview.applyJqzoom(productContainer, previewImageUrl, zoomedImageUrl);
        return false;
    });

    //initialise tabs switching
    stilago.productoverview.initTabs(productContainer);

    //initialise product details logic
    stilago.productoverview.initProduct(productContainer, true, productContainer.attr('data-options-url'));
};
