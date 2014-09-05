// City templates

stilago.cityTemplateFunc = function (ul, item) {
    return $('<li>').append('<a>' + item.City + ' (' + item.ZipCode + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.cityTemplateFuncEE = function (ul, item) {
    return $('<li>').append('<a>' + item.City + ' (' + item.ZipCode.substring(0, 5) + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.cityTemplateFuncLT = function (ul, item) {
    return $('<li>').append('<a>' + item.District + ' (' + item.ZipCode + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.cityTemplateFuncRU = function (ul, item) {
    return $('<li>').append('<a>' + item.City + ' (' + item.ZipCode + ')' + "<br><span style='color: grey;'>" + item.Region + "</span><br><span style='color: grey;'>" + item.District + '</span> </a>').appendTo(ul);
};

stilago.cityTemplateFuncHUBG = function (ul, item) {
    return $('<li>').append('<a>' + item.City + ' (' + item.ZipCode.substring(0, 4) + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

// ZIP code templates

stilago.zipCodeTemplateFunc = function (ul, item) {
    return $('<li>').append('<a>' + item.ZipCode + ' (' + item.City + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.zipCodeTemplateFuncEE = function (ul, item) {
    return $('<li>').append('<a>' + item.City + ' (' + item.ZipCode.substring(0, 5) + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.zipCodeTemplateFuncLT = function (ul, item) {
    return $('<li>').append('<a>' + item.District + ' (' + item.ZipCode + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

stilago.zipCodeTemplateFuncRU = function (ul, item) {
    return $('<li>').append('<a>' + item.ZipCode + ' (' + item.City + ')' + "<br><span style='color: grey;'>" + item.Region + "</span><br><span style='color: grey;'>" + item.District + '</span> </a>').appendTo(ul);
};

stilago.zipCodeTemplateFuncHUBG = function (ul, item) {
    return $('<li>').append('<a>' + item.ZipCode.substring(0, 4) + ' (' + item.City + ')' + "<br><span style='color: grey;'>" + item.Region + '</span> </a>').appendTo(ul);
};

// Phone code templates

stilago.phoneCodeTemplateFunc = function (ul, item) {
    return $('<li>').append('<a>' + item.PhoneCodeNumber + '</a>').appendTo(ul);
};