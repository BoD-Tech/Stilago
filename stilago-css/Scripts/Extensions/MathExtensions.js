Math.roundTo = function (value, decimalDigits) {
    var multiplier = Math.pow(10, decimalDigits);
    return Math.round(value * multiplier) / multiplier;
};

Math.roundToSmallestFragment = function(value, smallestFragment) {
    return Math.round(value / smallestFragment) * smallestFragment;
};