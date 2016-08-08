/**
 * Created by lukaijie on 16/8/8.
 */
UI = {
    success: function (content, duration) {
        var duration = duration || 1000;
        $('.ant-message-notice-content').remove();
        $('body').append('<div class="ant-message-notice-content" style="display: none;">' +
            '<div class="ant-message-custom-content ant-message-success">' +
            '<i class="anticon anticon-check-circle"></i>' +
            '<span>' + content + '</span>' +
            '</div>' +
            '</div>');
        $('.ant-message-notice-content').slideDown()
        setTimeout(function () {
            $('.ant-message-notice-content').slideUp(500, function () {
                $('.ant-message-notice-content').remove();
            })
        }, duration);

    },
    error: function () {

    },
    alert: function () {

    }
};

$(function () {
    $('.ant-menu').find('div.ant-menu-submenu-title').on('click', function () {
        //$('.ant-menu-submenu-open').removeClass('ant-menu-submenu-open');
        if ($(this).parent().hasClass('ant-menu-submenu-open')) {
            $(this).parent().removeClass('ant-menu-submenu-open');
        }
        else {
            $(this).parent().addClass('ant-menu-submenu-open');
        }
    })
});
