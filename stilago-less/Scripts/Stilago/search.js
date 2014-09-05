$.fn.stilagoSearch.renderProductItem = function ($li, item, searchedTerm, options) {
    $li.append(
        '<a href="' + item.Url + '">' +
            '[' + $.fn.stilagoSearch.highlightByCriteria(item.MagazineCode, searchedTerm, options) + ']<br />' +
            '<b>' + item.Name + '</b><br /><i>' + item.Brand + '</i>' +
        '</a>'
    );
};

$.fn.stilagoSearch.renderBrandItem = function ($li, item, searchedTerm, options) {
    $li.append(
        '<a href="' + item.Url + '">' +
            '<b>' + $.fn.stilagoSearch.highlightByCriteria(item.BrandName, searchedTerm, options) + '</b>' +
        '</a>'
    );
};

$.fn.stilagoSearch.renderCategoryItem = function ($li, item, searchedTerm, options) {
    var $a = $('<a href="' + item.Url + '"><i>' + item.NameLevel1 + '</i></a>');

    if (item.NameLevel3) {
        $a.append(
            '<br />' + $.fn.stilagoSearch.highlightByCriteria(item.NameLevel2, searchedTerm, options) + '<br />' +
            '<b>' + $.fn.stilagoSearch.highlightByCriteria(item.NameLevel3, searchedTerm, options) + '</b>'
        );
    } else if (item.NameLevel2) {
        $a.append('<br /><b>' + $.fn.stilagoSearch.highlightByCriteria(item.NameLevel2, searchedTerm, options) + '</b>');
    }

    $li.append($a);
};

$(function () {
    $('.site-search-input').stilagoSearch({containerSelector: 'header'});
});