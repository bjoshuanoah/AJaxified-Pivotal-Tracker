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

$('#main_header').on('click', '#logout', function () {
    $('#user_columns').fadeOut();
    $('#user_columns_container').fadeOut();
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

$('#main_header').on('click', '#settings', function () {
    if ($('.projects').hasClass('minimized')) {
        openSidebar();
    } else {
        closeSidebar();
    }
});

$('.projects').on('click', '.project', function () {
    var project = $(this);
    if (project.hasClass('added')) {
        var id = project.attr('id');
        if (project.hasClass('selected')) {
            project.removeClass('selected');
            $('.user_story[project_id="' + id + '"]').addClass('selected').removeClass('displayed');
        } else {
            project.addClass('selected');
            $('.user_story[project_id="' + id + '"]').removeClass('selected').addClass('displayed');
        }
    } else {
        project.addClass('selected').addClass('added');
        var project_id = $(this).attr('id');
        closeSidebar();
        var api_token = local.get('credentials').api_token;
        getMembers(api_token, project_id, function () {
            getStories(api_token, project_id);
        });
    }
});

$('#user_columns').on('click', '.user_story[type="week_indicator"]', function () {
    var week = $(this);
    var this_week = week.attr('week_number');
    var next_week = (this_week*1) + 1;
    if (week.hasClass('active')) {
        week.removeClass('active');
        $('.user_column').each(function () {
            var column = $(this);
            var height = 0;
            var this_week_start_ts = $('.user_story[week_number="' + this_week + '"]', column).attr('accepted_ts');
            var this_week_end_ts = $('.user_story[week_number="' + next_week + '"]', column).attr('accepted_ts');
            console.log(this_week_start_ts, this_week_end_ts);
            $('.user_story', column).each(function () {
                var story = $(this);
                var ts = story.attr('accepted_ts');
                if (this_week_start_ts < ts && ts < this_week_end_ts) {
                    story.removeClass('displayed');
                }
            });
            $('.user_story[week_number="' + this_week + '"]', column).attr('week_height', '');
            $('.user_story[week_number="' + next_week + '"]', column).attr('margin_top', '');
        });
        $('.user_story[week_number="' + next_week + '"]').each(function () {
            var week = $(this);
            week.animate({
                'margin-top': 0
            });
        });
    } else {
        week.addClass('active');
        var new_height = 0;
        $('.user_column').each(function () {
            var column = $(this);
            var height = 0;
            var this_week_start_ts = $('.user_story[week_number="' + this_week + '"]', column).attr('accepted_ts');
            var this_week_end_ts = $('.user_story[week_number="' + next_week + '"]', column).attr('accepted_ts');
            $('.user_story', column).each(function () {
                var story = $(this);
                var ts = story.attr('accepted_ts');
                if (this_week_start_ts < ts && ts < this_week_end_ts && story.hasClass('selected')) {
                    height = story.outerHeight() + height + 2;
                    story.addClass('displayed');
                    return height;
                }
            });
            if (height > new_height) {
                new_height = height;
            }
            $('.user_story[week_number="' + this_week + '"]', column).attr('week_height', height);
            $('.user_story[week_number="' + next_week + '"]', column).attr('margin_top', height);
            return new_height;
        });
        $('.user_story[week_number="' + next_week + '"]').each(function () {
            var week = $(this),
                this_week_height = week.attr('margin_top'),
                margin_top = new_height - this_week_height + 2;
            week.animate({
                'margin-top': margin_top + 'px'
            });
        });
    }
});

$('#install').on('touchend', function () {
    $(this).fadeOut();
});



















