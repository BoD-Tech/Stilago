$.validator.addMethod("requiredtrue", function (value, element, params) {
    var val = false;
    if ($(element).is(':checkbox')) {
        val = $(element).is(':checked').toString().toLocaleLowerCase();
    } else {
        val = $(element).val().toString().toLocaleLowerCase();
    }
    return  val == true.toString().toLocaleLowerCase();
});
    
jQuery.validator.unobtrusive.adapters.addBool('requiredtrue');