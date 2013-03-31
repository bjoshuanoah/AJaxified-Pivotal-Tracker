if (window.navigator.platform === 'iPad' && window.navigator.standalone !== true ) {
    $('#install').fadeIn('slow');
}

$(window).on('scroll', function () {
    var to_the_top = $('body').scrollTop();
    $('#member_names').css({
        'top': to_the_top + 30 + 'px'
    });
});


if (local.get('credentials') === null) {
    $('.login').removeClass('default');
    $('#logged_in_header').removeClass('logged_in');
    $('.header_logo').removeClass('logged_in');
} else {
    $('.header_logo').addClass('logged_in');
    $('#logged_in_header').addClass('logged_in');
    var api_token = local.get('credentials').api_token;
    getProjects(api_token);
}

var members_obj = {};
members_obj.members = [];
local.write('members', members_obj);

