var user_type = "pro";

var statusMessage = function (message) {
    $('.connection_status').text(message);
};

function localConstructor() {
    this.write = function (key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
        return this;
    };
    this.get = function (key) {
        var obj = JSON.parse(localStorage.getItem(key));
        return obj;
    };
    this.clear = function () {
        localStorage.clear();
        return this;
    };
    this.remove = function (key) {
        localStorage.removeItem(key);
        return this;
    };
}

var currentTimestamp = function () {
    var curr_time = new Date(),
    ts = curr_time.getTime()/1000;
    return ts;
};

var local = new localConstructor();

var weekToDate = function (year, week_number) {
    var month_name, end_month_name,
        january_tenth = new Date( year,0,10,12,0,0),
        january_fourth = new Date( year,0,4,12,0,0),
        mon1 = january_fourth.getTime() - (january_tenth.getDay() * 86400000);
    start_date = new Date(mon1 + ((week_number - 1)  * 7 ) * 86400000);
    var month = start_date.getMonth(),
        day = start_date.getDate(),
        year = start_date.getFullYear(),
        time_stamp = start_date.getTime()/1000;

    switch (month) {case 0: month_name='Jan.'; break; case 1: month_name='Feb.'; break; case 2: month_name='Mar.'; break; case 3: month_name='Apr.'; break; case 4: month_name='May'; break; case 5: month_name='Jun.'; break; case 6: month_name='Jul.'; break; case 7: month_name='Aug.'; break; case 8: month_name='Sep.'; break; case 9: month_name='Oct.'; break; case 10: month_name='Nov.'; break; case 11: month_name='Dec.'; break; }


    end_date = new Date(mon1 + ((week_number - 1)  * 7 + 6) * 86400000);
    var end_month_number = end_date.getMonth();
    var end_day = end_date.getDate();
    var end_year = end_date.getFullYear();

    switch (end_month_number) {case 0: end_month_name='Jan.'; break; case 1: end_month_name='Feb.'; break; case 2: end_month_name='Mar.'; break; case 3: end_month_name='Apr.'; break; case 4: end_month_name='May'; break; case 5: end_month_name='Jun.'; break; case 6: end_month_name='Jul.'; break; case 7: end_month_name='Aug.'; break; case 8: end_month_name='Sep.'; break; case 9: end_month_name='Oct.'; break; case 10: end_month_name='Nov.'; break; case 11: end_month_name='Dec.'; break; }


    var date = {};
    date.start_month_name = month_name;
    date.start_month_number = month;
    date.end_month_name = end_month_name;
    date.end_month_number = end_month_number;
    date.start_year = year;
    date.end_year = end_year;
    date.start_day = day;
    date.end_day = end_day;
    date.week_number = week_number;
    date.start_time_stamp = start_date.getTime()/1000 - (20 *(3600));
    date.ts = start_date.getTime()/1000 - (20 *(3600));
    date.type = 'week';
    date.end_time_stamp = end_date.getTime()/1000 + (4 * (3600)) - 1;
    if (date.start_time_stamp < (currentTimestamp() + 604800)) {
        return date;
    } else {
        return false;
    }
};
var week_array = [];
for (var week = 1; week < 53; week++) {
    if (weekToDate(2013, week) !== false) {
        week_array.push(weekToDate(2013, week));
    }
};

var currentWeekNumber = function () {
    var current_time = new Date();
    current_ts = current_time.getTime()/1000;
    for (i = 0; i < week_array.length; i++) {
        if (week_array[i].start_time_stamp < current_ts && current_ts < week_array[i].end_time_stamp) {
            var  current_week = week_array[i].week_number;
        }
    }
    return current_week;
};

var openSidebar = function () {
    $('.projects').removeClass('minimized');
};

var closeSidebar = function () {
    $('.projects').addClass('minimized');
};


var logIn = function (credentials, callback) {
    var obj = credentials;
    $.ajax({
        type: 'POST',
        url: '/login',
        data: obj,
        datatype: 'json',
        beforeSend: function(xhr){
            statusMessage('Logging In');
        },
        error: function (e) {
            statusMessage(e.responseText);
            $('#username').addClass('failure');
            $('#password').addClass('failure').removeClass('active');
        },
        success: function (s) {
            console.log('success', s);
            $('.login').addClass('logged_in');
            setTimeout(function  () {
                $('.login input').val('');
            }, 500);
            var data = s;
            var obj = {};
            obj.api_token = data.guid;
            local.write('credentials', obj);
            statusMessage('');
            if (!callback) {
            } else {
                callback();
            }
        }
    });
};

var getProjects = function (api_token) {
    $.ajax({
        type: 'GET',
        url: '/projects',
        beforeSend: function(xhr){
            xhr.setRequestHeader('api_token', api_token);
                statusMessage('Loading Projects');
        },
        error: function (e) {
            console.log('error', e);
            console.log(e.responseText);
            console.log(e.statusText);
            console.log(e.status);
        },
        success: function (s) {
            statusMessage('');
            openSidebar();
            var data = s;
            $.get('/tpl/projects.tpl', function (source) {
                 var template = Handlebars.compile(source);
                    var html = template(data);
                    $('.projects').html(html);
            });
        }
    });
};

var getStories =function (api_token, project_id) {
    var member_obj = local.get('members');
    var member_length = member_obj.members.length;
    $.ajax({
        type: 'GET',
        url: '/stories',
        beforeSend: function(xhr){
            xhr.setRequestHeader('api_token', api_token);
            xhr.setRequestHeader('project_id', project_id);
            statusMessage('Loading Stories');
        },
        error: function (e) {
            statusMessage(e.responseText);
            openSidebar();
        },
        success: function (s) {
            var data = s;
            var stories = data.story;
            var iteration_count = stories.length;
            function compare(a,b) {
              if (a.ts < b.ts) {
                 return -1;
              } else if (a.ts > b.ts) {
                return 1;
              }
              return 0;
            }
            for (i=0; i < iteration_count; i++) {
                var story = stories[i], time;
                if (story.accepted_at) {
                    time = new Date(story.accepted_at);
                    story.ts = time.getTime()/1000;
                } else {
                    time = new Date();
                    if (story.current_state === 'started' || story.current_state === 'unstarted' || story.current_state === 'finished' || story.current_state === 'delivered') {
                        story.ts = time.getTime()/1000;
                    } else {
                        story.ts = time.getTime()/1000 + 604800;
                    }
                }
                if (story.owned_by) {
                    story.unique_id = story.owned_by.replace(/ /g, '');
                } else {
                    story.unique_id = 'nya';
                }
                var member = story.unique_id;
                for (var member_iteration = 0; member_iteration < member_length; member_iteration++) {
                    var unique_id = member_obj.members[member_iteration].unique_id;
                    if (unique_id == member) {
                        member_obj.members[member_iteration].stories.push(story);
                        member_obj.members[member_iteration].stories.sort(compare);
                    }
                }
            }
            $.get('/tpl/stories.tpl', function (source) {
                var template = Handlebars.compile(source);
                var html = template(member_obj);
                $('#user_columns').html(html);
                $('.user_column').each(function () {
                    var column = $(this);
                    var column_stories_length = $('.user_story:not([type="week_indicator"])', column).length;
                    if (column_stories_length > 0) {
                        var member_id = column.attr('member_id');
                        column.addClass('active');
                        $('.member_column[member_id="' + member_id + '"]').addClass('active');
                    }
                    var width = $('.user_column.active').length * 327;
                    $('#user_columns, #member_names').outerWidth(width);
                });
                $('#user_columns').fadeIn('slow');
                var new_height = 0;
                $('.user_column').each(function () {
                    var column = $(this);
                    var height = 0;
                    var this_week = currentWeekNumber();
                    var next_week = this_week + 1;
                    var this_week_start_ts = $('.user_story[week_number="' + this_week + '"]', column).attr('accepted_ts');
                    var this_week_end_ts = $('.user_story[week_number="' + next_week + '"]', column).attr('accepted_ts');
                    $('.user_story', column).each(function () {
                        var story = $(this);
                        var ts = story.attr('accepted_ts');
                        if (this_week_start_ts < ts && ts < this_week_end_ts) {
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
                var this_week = currentWeekNumber();
                var next_week = this_week + 1;
                $('.user_story[week_number="' + next_week + '"]').each(function () {
                    var week = $(this),
                        this_week_height = week.attr('margin_top'),
                        margin_top = new_height - this_week_height + 2;
                    week.animate({
                        'margin-top': margin_top + 'px'
                    });
                });
                $('body').animate({
                    scrollTop: (this_week - 2) * 26 + 4 + 'px'
                });
                $('.user_column.active').each(function () {
                    var column = $(this);
                    var height = 0;
                    var count = $('.user_story[type="week_indicator"]', column).length;
                    for (var i = 1; i < count; i++) {
                        var new_estimate = 0;
                        var this_week = i;
                        var next_week = this_week + 1;
                        var this_week_start_ts = $('.user_story[week_number="' + this_week + '"]', column).attr('accepted_ts');
                        var this_week_end_ts = $('.user_story[week_number="' + next_week + '"]', column).attr('accepted_ts');
                        $('.user_story[status="accepted"]', column).each(function () {
                            var story = $(this);
                            var ts = story.attr('accepted_ts');
                            if (this_week_start_ts < ts && ts < this_week_end_ts) {
                                var estimate = $('.estimate', story).text() * 1;
                                if (estimate > -1) {
                                    new_estimate = estimate + new_estimate;
                                    return new_estimate;
                                }
                            }
                        });
                        $('.user_story[week_number="' + this_week + '"] .personal_velocity', column).text(new_estimate);
                    }
                });

            });
            statusMessage('');
            $('#user_columns_container').fadeIn();
            if (user_type === 'pro') {
                local.write('members', member_obj);
            }
        }
    });
};

var getMembers = function (api_token, project_id, callback) {
    var members_obj = local.get('members');
    var member_length = members_obj.members.length;
    $.ajax({
        type: 'GET',
        url: '/members',
        beforeSend: function(xhr){
            xhr.setRequestHeader('api_token', api_token);
            xhr.setRequestHeader('project_id', project_id);
            statusMessage('Loading Members');
        },
        error: function (e) {
            console.log('error', e);
            console.log(e.responseText);
            console.log(e.statusText);
            console.log(e.status);
        },
        success: function (s) {
            var data = s;
            var members = data.membership;
            var member_count = members.length;
            for (i = 0; i < member_count; i++) {
                var member = members[i];
                if (member.role == 'Owner' || member.role == 'Member') {
                    var unique_id = member.person.name.replace(/ /g, '');

                    var flag = false;
                    for (var member_iteration = 0; member_iteration < member_length; member_iteration++) {
                        if (members_obj.members[member_iteration].unique_id == unique_id) {
                            flag = true;
                        }
                    }
                    if (flag === false) {
                        members_obj.members.push({'name':member.person.name, 'unique_id': unique_id, 'stories': week_array});
                    }
                }
            }
            $.get('/tpl/members.tpl', function (source) {
                var template = Handlebars.compile(source);
                var html = template(members_obj);
                $('#member_names').html(html);
            });
            local.write('members', members_obj);
            statusMessage('');
            callback();
        }
    });
};
















