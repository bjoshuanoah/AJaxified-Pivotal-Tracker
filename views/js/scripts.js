var resizeStuff = function () {
    var size = window.innerHeight;
    $('#main').css({'min-height': size + 'px'});
    $('#user_columns').css({'min-height': size - 30 + 'px'});
    $('#user_container').css({'min-height': size + 'px'});
    $('.projects').css({'min-height': size + 'px'});
    console.log(size);
};

resizeStuff();

$(window).resize(function () {
    resizeStuff();
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

// statusMessage('loading page');

// getProjects('353ddbae79fe8b53ddb36fbe5f389e68');

// getMembers('353ddbae79fe8b53ddb36fbe5f389e68', '673099');
