var resizeStuff = function () {
    var size = document.height;
    $('#main').css({'height': size + 'px'});
    $('#user_columns').css({'height': size - 30 + 'px'});
    $('#user_container').css({'height': size + 'px'});
    $('.projects').css({'height': size + 'px'});
};

resizeStuff();

$(window).resize(function () {
    resizeStuff();
});

if (local.get('credentials') == null) {
    $('.login').removeClass('default');
    $('#logged_in_header').removeClass('logged_in');
} else {
    $('#logged_in_header').addClass('logged_in');
    var api_token = local.get('credentials').api_token;
    getProjects(api_token);
}


// statusMessage('loading page');

// getProjects('353ddbae79fe8b53ddb36fbe5f389e68');

// getMembers('353ddbae79fe8b53ddb36fbe5f389e68', '673099');
