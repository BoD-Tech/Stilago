$(document).ready(function() {
    $('.country-list a').on('click', function (e) {
        var selectedForm = $('form.country[id=' + $(this).attr('id') + ']');
        if (selectedForm.length > 0) {
            selectedForm.submit();
        }
    });
});