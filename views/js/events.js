$('#login_overlay').on('keyup', '#password:not(.active)', function (k) {
    var key = k.keyCode;
    if (key === 13) {
        var input = $(this);
        input.blur();
        input.addClass('active');
        var credentials = {};
        credentials.username = $('#username').val();
        credentials.password = input.val();
        logIn(credentials, function () {
            $('#logged_in_header').addClass('logged_in');
            input.removeClass('active');
            var api_token = local.get('credentials').api_token;
            getProjects(api_token);
            $('.header_logo').addClass('logged_in');
        });
    }
});

$('#main').on('click', '#logout', function () {
    $('#user_columns').fadeOut();
    setTimeout(function () {
        $('#user_columns').html('');
        $('.projects').html('');
        $('#logged_in_header').removeClass('logged_in');
        $('.header_logo').removeClass('logged_in');
        closeSidebar();
        local.clear();
        var members_obj = {};
        members_obj.members = [];
        local.write('members', members_obj);
        $('.login').removeClass('logged_in').removeClass('default');
    }, 400);
});

$('#main').on('click', '#settings', function () {
    if ($('.projects').hasClass('minimized')) {
        openSidebar();
    } else {
        closeSidebar();
    }
});

$('.projects').on('click', '.project', function () {
    $(this).addClass('selected');
    var project_id = $(this).attr('id');
    closeSidebar();
    var api_token = local.get('credentials').api_token;
    getMembers(api_token, project_id, function () {
        getStories(api_token, project_id);
    });
});
























