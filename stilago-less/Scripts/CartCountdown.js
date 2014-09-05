stilago.CartCountdown = {};
stilago.CartCountdown.timeContainers = [];
stilago.CartCountdown.timeContainerSelector = ".checkout-cart-countdown";
stilago.CartCountdown.timeShortSelector = ".info-time-left-short";
stilago.CartCountdown.timeLongSelector = ".info-time-left-long";
stilago.CartCountdown.timeRemainingSelector = ".checkout-cart-countdown-time-remaining";

stilago.CartCountdown.init = function (initContainer) {
    this.initSeconds(initContainer);
    if (this.seconds > 0) {
        this.initTimer();
    }
};

stilago.CartCountdown.initSeconds = function (initContainer) {
    var cartTimeRemaining = initContainer.find(this.timeRemainingSelector);
    if (cartTimeRemaining != undefined) {
        this.seconds = cartTimeRemaining.data("seconds");
    }
};

stilago.CartCountdown.addTimeContainer = function (timeContainer) {
    if (timeContainer != null) {
        stilago.CartCountdown.timeContainers.push(timeContainer);
    }
};

stilago.CartCountdown.update = function () {
    var secs = this.seconds % 60;
    var countLeft = (this.seconds - secs) / 60;
    var mins = countLeft % 60;
    countLeft = (countLeft - mins) / 60;
    var hours = countLeft % 24;

    secs = ((secs < 10) ? ('0' + secs) : (secs));
    mins = ((mins < 10) ? ('0' + mins) : (mins));

    var strDateShort = mins + ":" + secs;
    //var strDateLong = mins + " " + ((mins == 1) ? this.minSing : this.minPlur) + " " + secs + " " + ((secs == 1) ? this.secSing : this.secPlur);

    if (this.seconds > 0) {
        for (var i = 0, len = this.timeContainers.length; i < len; i++)
        {
            var timeContainer = this.timeContainers[i].find(stilago.CartCountdown.timeContainerSelector);
            var longTimeLeft = timeContainer.find(stilago.CartCountdown.timeLongSelector);
            if (longTimeLeft.length > 0) {
                longTimeLeft.find(".minutes").html(mins);
                longTimeLeft.find(".seconds").html(secs);

                if (mins == 1) {
                    longTimeLeft.find(".minutes-singular").removeClass("hidden");
                    longTimeLeft.find(".minutes-plural").addClass("hidden");
                } else {
                    longTimeLeft.find(".minutes-singular").addClass("hidden");
                    longTimeLeft.find(".minutes-plural").removeClass("hidden");
                }

                if (secs == 1) {
                    longTimeLeft.find(".seconds-singular").removeClass("hidden");
                    longTimeLeft.find(".seconds-plural").addClass("hidden");
                } else {
                    longTimeLeft.find(".seconds-singular").addClass("hidden");
                    longTimeLeft.find(".seconds-plural").removeClass("hidden");
                }
            }

            timeContainer.find(stilago.CartCountdown.timeShortSelector).html(strDateShort);
        }
    }

    if ((mins == 5) && (secs == 0)) {
        stilago.popup.open('info-cart-remindBeforeEmptying');
    }

    if (mins < 5) {
        for (var i = 0, len = this.timeContainers.length; i < len; i++)
        {
            var timeContainer = this.timeContainers[i].find(stilago.CartCountdown.timeContainerSelector);
            timeContainer.find(stilago.CartCountdown.timeShortSelector).addClass('critical');
            timeContainer.find(stilago.CartCountdown.timeShortSelector).addClass('critical');
        }
    }

    if ((hours == 0) && (mins == 0) && (secs <= 1)) {
        this.redirectByPost(stilago.CartCountdown.emptyCartUrl);
    }

    this.seconds = this.seconds - 1;

    this.initTimer();
};

stilago.CartCountdown.initTimer = function () {
    if (this.seconds > 0) {
        if (this.timerVar != undefined) {
            clearTimeout(this.timerVar);
        }

        this.timerVar = setTimeout('stilago.CartCountdown.update();', 999);
    } else {
        for (var i = 0, len = this.timeContainers.length; i < len; i++)
        {
            var timeContainer = this.timeContainers[i].find(stilago.CartCountdown.timeContainerSelector);
            timeContainer.find(stilago.CartCountdown.timeShortSelector).html("0");
            timeContainer.find(stilago.CartCountdown.timeShortSelector).removeClass('critical');
        }
    }
};

stilago.CartCountdown.redirectByPost = function (url) {
    $('<form action="' + url + '" method="POST"/>')
    .append('<input type="hidden" name="returnUrl" value="' + window.location.pathname + '"/>')
    .appendTo($(document.body))
    .submit();
};

stilago.CartCountdown.redirectToRecentProducts = function() {
    window.location = stilago.CartCountdown.recentProductsUrl;
};