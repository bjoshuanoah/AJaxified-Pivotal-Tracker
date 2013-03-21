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

var local = new localConstructor();

var openSidebar = function () {
    $('#user_container').removeClass('maximized');
    $('.projects').removeClass('minimized');
};

var closeSidebar = function () {
    $('#user_container').addClass('maximized');
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
            console.log('success', s);
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
    console.log(member_obj, member_length);
    $.ajax({
        type: 'GET',
        url: '/stories',
        beforeSend: function(xhr){
             xhr.setRequestHeader('api_token', api_token);
            xhr.setRequestHeader('project_id', project_id);
            statusMessage('Loading Stories');
        },
        error: function (e) {
            console.log('error', e);
            console.log(e.responseText);
            console.log(e.statusText);
            console.log(e.status);
        },
        success: function (s) {
            console.log('success', s);
            var data = s;
            var stories = data.story;
            var iteration_count = stories.length;
            for (i=0; i < iteration_count; i++) {
                var story = stories[i];
                if (story.accepted_at) {
                    var time = new Date(story.accepted_at);
                    story.ts = time.getTime();
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
                    }
                }
            }
            $.get('/tpl/stories.tpl', function (source) {
                var template = Handlebars.compile(source);
                var html = template(member_obj);
                $('#user_columns').html(html);
                $('.user_column').each(function () {
                    var column = $(this);
                    var column_stories_length = $('.user_story', column).length;
                    if (column_stories_length > 0) {
                        column.addClass('active');
                    }
                    var width = $('.user_column.active').length * 257;
                    $('#user_columns').outerWidth(width);
                });
                $('#user_columns').fadeIn('slow');
                statusMessage('');
                if (user_type === '') {
                    local.write('members', member_obj);
                }
            });
        }
    });
};

var getMembers = function (api_token, project_id) {
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
            console.log('success', s);
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
                        members_obj.members.push({'name':member.person.name, 'unique_id': unique_id, 'stories': []});
                    }
                }
            }
            local.write('members', members_obj);
            statusMessage('');
            getStories(api_token, project_id);
        }
    });
};
















