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
};

var local = new localConstructor();

var logIn = function (username, password, callback) {
    var obj = {};
    obj.username = username;
    obj.password = password;
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
        },
        success: function (s) {
            console.log('success', s);
            $('.login').addClass('logged_in');
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
        // datatype: 'json',
        progress:function (p) {
        },
        error: function (e) {
            console.log('error', e);
            console.log(e.responseText);
            console.log(e.statusText);
            console.log(e.status);
        },
        success: function (s) {
            console.log('success', s);
        }
    });
};

var getMembers = function (api_token, project_id) {
    $.ajax({
        type: 'GET',
        url: '/members',
        beforeSend: function(xhr){
            xhr.setRequestHeader('api_token', api_token);
            xhr.setRequestHeader('project_id', project_id);
            statusMessage('Loading Members');
        },
        // datatype: 'json',
        progress:function (p) {
        },
        error: function (e) {
            console.log('error', e);
            console.log(e.responseText);
            console.log(e.statusText);
            console.log(e.status);
        },
        success: function (s) {
            console.log('success', s);
                     var members = s.membership;
                    var member_count = members.length;
                    for (i = 0; i < member_count; i++) {
                        var member = members[i];
                        member.unique_id = member.person.name.replace(" ", '');
                        if (member.role == 'Owner' || member.role == 'Member') {
                            $('#user_columns').append('<div class="user_column" id="' + member.unique_id + '"><header>' + member.person.name + '</header><div class="user_stories"></div></div>');
                        }
                    }
                    $.ajax({
                        type: 'GET',
                        url: '/current_iterations',
                        beforeSend: function(xhr){
                             xhr.setRequestHeader('api_token', api_token);
                            xhr.setRequestHeader('project_id', project_id);
                            statusMessage('Loading Stories');
                        },
                        progress:function (p) {
                        },
                        error: function (e) {
                            console.log('error', e);
                            console.log(e.responseText);
                            console.log(e.statusText);
                            console.log(e.status);
                        },
                        success: function (s) {
                            console.log('success', s);
                            var iterations = s.iteration;
                            var iteration_count = iterations.length;
                            for (i=0; i < iteration_count; i++) {
                                var iteration = iterations[i];
                                var stories = iteration.stories.story;
                                if (stories !== undefined) {
                                    console.log(i+'*');
                                    var story_count = stories.length;
                                    console.log(story_count);
                                    if (story_count !== undefined) {
                                        for (var count=0; count < story_count; count++) {
                                            var story = stories[count];
                                            if (story.story_type !== 'release' && story.owned_by !== undefined) {
                                                var member = story.owned_by.replace(' ', ''),
                                                    story_name = story.name,
                                                    difficulty = story.estimate,
                                                    status = story.current_state,
                                                    id = story.id;
                                                $('#' + member).addClass('active');
                                                $('#' + member + ' .user_stories').append('<div id="' + id + '" class="user_story" difficulty="' + difficulty+ '" status="' + status+ '"><span>' + story_name + '</span><footer>Difficulty: ' + difficulty + ' | Status: ' + status + ' | Id: <a href="https://www.pivotaltracker.com/story/show/' + id + '" target="_blank">' + id + '</a></footer></div>');
                                            }
                                        }
                                    }
                                }
                            }
                            $('#user_columns').fadeIn('slow');
                            statusMessage('');
                        }
                    });
        }
    });
}
