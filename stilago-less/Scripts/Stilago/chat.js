stilago.chat = {};

stilago.chat.desk = {};
stilago.chat.desk.refreshCount = 0;
stilago.chat.desk.refreshInterval = null;

stilago.chat.livechatinc = {};

stilago.chat.desk.init = function () {
    stilago.chat.desk.container = $('.desk-chat');
    if (stilago.chat.desk.container.size() > 0) {
        stilago.chat.desk.createWidget();
    }
};

stilago.chat.desk.createWidget = function () {
    var container = stilago.chat.desk.container;

    new DESK.Widget({
        version: 1,
        site: container.attr('data-site'),
        port: '80',
        type: 'chat',
        displayMode: container.attr('data-display-mode'), //0 for popup, 1 for lightbox  
        features: {
            offerAlways: (container.attr('data-offer-always') == 'true'),
            offerAgentsOnline: (container.attr('data-offer-agents-online') == 'true'),
            offerRoutingAgentsAvailable: false,
            offerEmailIfChatUnavailable: (container.attr('data-offer-email-if-chat-unavailable')  == 'true')
        },
        fields: {
            ticket: {
            },
            interaction: {
                email: container.attr('data-email')
            },
            chat: {
            },
            customer: {          
            }
        },
        popupWidth: 510,
        popupHeight: 267
    }, container).render();
};

$(document).ready(function () {
    stilago.chat.desk.init();
});


var container = $('.livechatinc');
if (container.length > 0)
{
    var licence = container.attr('data-licence');
    var elementId = container.attr('id');
    var online = container.attr('data-labels-online');
    var offline = container.attr('data-labels-offline');

    var __lc = {};
    __lc.license = licence;

    var labels = {
        online: online,
        offline: offline
    };
    (function () {
        var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
        lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
    })();
    var __lc_buttons = __lc_buttons || [];
    __lc_buttons.push({
        elementId: elementId,
        skill: '0',
        type: 'text',
        labels: { online: online, offline: offline }
    });
}
