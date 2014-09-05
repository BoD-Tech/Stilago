(function () {
    if (DESK && DESK.Widget) {
        return;
    }
    DESK.Widget = function (a, b) { this.init(a, b); };
    ASSISTLY = window.ASSISTLY || {};
    ASSISTLY.Widget = DESK.Widget;
    (function () {
        DESK.Widget.ID_COUNTER = 0;
        DESK.Widget.prototype = function () {
            var d = "/customer/widget/chats/new";
            var f = "/customer/widget/emails/new";
            var g = "http://assets0.assistly.com/images/customer/widget/chat/launch_chat_sprite.png";
            var e = "http://assets0.assistly.com/images/customer/widget/email/launch_email_sprite.png";
            var b = "https://d3j15y3zsn7b4t.cloudfront.net/images/customer/widget/chat/launch_chat_sprite.png";
            var a = "https://d3j15y3zsn7b4t.cloudfront.net/images/customer/widget/email/launch_email_sprite.png";
            var c = "/customer/agent_online_check";
            return {
                init: function (i, container) {
                    this._widgetNumber = ++ASSISTLY.Widget.ID_COUNTER;
                    this._widgetID = i.id || "assistly-widget-" + this._widgetNumber;
                    if (!i.id) {
                        container.attr('id', this._widgetID);
                        container.addClass('class', 'assistly-widget');
                        this.widgetDOM = container.get(0);
                    }
                    this._setWidgetType(i.type);
                    var h = ((i.fields || {}).customer || {}).locale_code;
                    if (h) {
                        if (this._isChatWidget) {
                            d = d.replace(/customer/, "customer/" + h);
                        } else {
                            if (this._isEmailWidget) {
                                f = f.replace(/customer/, "customer/" + h);
                            }
                        }
                    }
                    this._secure = i.secure || window.location.protocol == "https:";
                    this._site = i.site;
                    this._port = i.port || 80;
                    if (i.port) {
                        this._base_url = (this._secure ? "https://" : "http://") + this._site + (this._secure ? "" : (":" + this._port));
                    } else {
                        this._base_url = (this._secure ? "https://" : "http://") + this._site;
                    }
                    this._widgetPopupWidth = i.popupWidth || 640;
                    this._widgetPopupHeight = i.popupHeight || 700;
                    this._siteAgentCount = -1;
                    this._siteAgentRoutingCount = -1;
                    this._widgetDisplayMode = i.displayMode || 0;
                    this._offerAlways = false;
                    this._offerRoutingAgentsAvailable = true;
                    this._offerAgentsOnline = false;
                    this._offerEmailIfChatUnavailable = false;
                    this.setFeatures(i.features);
                    if (i.fields) {
                        this._ticketFields = i.fields.ticket;
                        this._interactionFields = i.fields.interaction;
                        this._customerFields = i.fields.customer;
                        this._emailFields = i.fields.email;
                        this._chatFields = i.fields.chat;
                    } else {
                        this._ticketFields = [];
                        this._interactionFields = [];
                        this._customerFields = [];
                        this._emailFields = [];
                        this._chatFields = [];
                    }
                    return this;
                },
                _setWidgetType: function (h) {
                    this._isEmailWidget = false;
                    this._isChat = false;
                    this._type = h;
                    switch (h) {
                        case "email":
                            this._isEmailWidget = true;
                            break;
                        case "chat":
                            this._isChatWidget = true;
                            break;
                        default:
                            this._isEmailWidget = true
                    }
                    return this;
                },
                setFeatures: function (h) {
                    if (h) {
                        if (!(typeof h.offerAlways === "undefined")) {
                            this._offerAlways = h.offerAlways;
                        }
                        if (!(typeof h.offerRoutingAgentsAvailable === "undefined")) {
                            this._offerRoutingAgentsAvailable = h.offerRoutingAgentsAvailable;
                        }
                        if (!(typeof h.offerAgentsOnline === "undefined")) {
                            this._offerAgentsOnline = h.offerAgentsOnline;
                        }
                        if (!(typeof h.offerEmailIfChatUnavailable === "undefined")) {
                            this._offerEmailIfChatUnavailable = h.offerEmailIfChatUnavailable;
                        }
                    }
                    return this
                },
                setSiteAgentCount: function (h) {
                    this._siteAgentCount = h.online_agents;
                    this._siteAgentRoutingCount = h.routing_agents;
                    this.render();
                },
                _buildBaseButton: function () {
                    var q = "";
                    var j = "";
                    var l = "";
                    var i = false;
                    var h = "";
                    var n = "";
                    var k = "";
                    var p = "";
                    var o = "";
                    var m = "";
                    if (this._ticketFields) {
                        for (param in this._ticketFields) {
                            h += "ticket[" + escape(param) + "]=" + escape(this._ticketFields[param]) + "&"
                        }
                    }
                    if (this._interactionFields) {
                        for (param in this._interactionFields) {
                            n += "interaction[" + escape(param) + "]=" + escape(this._interactionFields[param]) + "&"
                        }
                    }
                    if (this._customerFields) {
                        for (param in this._customerFields) {
                            k += "customer[" + escape(param) + "]=" + escape(this._customerFields[param]) + "&"
                        }
                    }
                    if (this._emailFields) {
                        for (param in this._emailFields) {
                            p += "email[" + escape(param) + "]=" + escape(this._emailFields[param]) + "&"
                        }
                    }
                    if (this._chatFields) {
                        for (param in this._chatFields) {
                            o += "chat[" + escape(param) + "]=" + escape(this._chatFields[param]) + "&"
                        }
                    }
                    m = h + n + p + o + k;
                    if (this._isChatWidget) {
                        j = (this._secure ? b : g);
                        l = d;
                        if (!this._offerAlways) {
                            if (this._offerRoutingAgentsAvailable && (this._siteAgentRoutingCount < 1)) {
                                i = true;
                            }
                            if (this._offerAgentsOnline && (this._siteAgentCount < 1)) {
                                i = true;
                            }
                        }
                        if (!this._offerAlways && !this._offerRoutingAgentsAvailable && !this._offerAgentsOnline) {
                            i = true;
                        }
                        if (i && this._offerEmailIfChatUnavailable) {
                            this._isChatWidget = false;
                            this._isEmailWidget = true;
                        }
                    }
                    if (this._isEmailWidget) {
                        j = (this._secure ? a : e);
                        l = f;
                    }
                    l += "?" + m;
                    if (!i) {
                        var container = jQuery(this.widgetDOM);
                        container.removeClass('hidden');
                        var buttons = container.find('a');
                        buttons.addClass('a-desk-widget');
                        buttons.addClass('a-desk-widget-' + this._type);
                        
                        if (this._widgetDisplayMode == 0) {
                            var urlToOpen = this._base_url + l;
                            var popupWidth = this._widgetPopupWidth;
                            var popupHeight = this._widgetPopupHeight;
                            buttons.attr('href', '#');
                            buttons.click(function () {
                                window.open(urlToOpen, 'assistly_chat', 'resizable=1, status=0, toolbar=0, width=' + popupWidth + ', height=' + popupHeight);
                            });
                        }
                        if (this._widgetDisplayMode == 1) {
                            buttons.attr('href', this._base_url + l);
                        }
                        q = container;
                    } else {
                        q = null;
                    }
                    return q;
                },
                _renderChatWidget: function () {
                    if (this._siteAgentCount < 0) {
                        var h = this;
                        var url = this._base_url + c;
                        jQuery.getJSON(url + "?callback=?", function (i) {
                            if (i) {
                                h.setSiteAgentCount(i);
                            }
                        });
                    } else {
                        var container = this._buildBaseButton();
                        if (container != null) {
                            container.removeClass('email').addClass('chat');
                        }
                    }
                    return this;
                },
                _renderEmailWidget: function () {
                    var container = this._buildBaseButton();
                    if (container != null) {
                        container.removeClass('chat').addClass('email');
                    }
                    return this;
                },
                render: function () {
                    if (this._isChatWidget) {
                        this._renderChatWidget();
                    }
                    if (this._isEmailWidget) {
                        this._renderEmailWidget();
                    }
                    if (this._widgetDisplayMode == 1) {
                        var widget = this;
                        jQuery("#" + this._widgetID + " a").each(function() {
                            $(this).fancybox({
                                "width": widget._widgetPopupWidth,
                                "height": widget._widgetPopupHeight,
                                "type": "iframe",
                                "helpers": {
                                    "overlay": {
                                        "closeClick": false
                                    }
                                },
                                "autoSize": false,
                                "centerOnScroll": true
                            });
                        });
                    }
                    return this;
                }
            };
        }();
    })();
})();