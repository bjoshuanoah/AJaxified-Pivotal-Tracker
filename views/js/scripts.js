// API Token: 353ddbae79fe8b53ddb36fbe5f389e68


var api_token = '353ddbae79fe8b53ddb36fbe5f389e68';
statusMessage('loading page');
$.ajax({
	type: 'GET',
	url: 'http://gentle-forest-6759.herokuapp.com/projects',
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

$.ajax({
	type: 'GET',
	url: 'http://gentle-forest-6759.herokuapp.com/members',
	beforeSend: function(xhr){
		xhr.setRequestHeader('api_token', api_token);
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
            url: 'http://gentle-forest-6759.herokuapp.com/current_iterations',
            beforeSend: function(xhr){
                xhr.setRequestHeader('api_token', api_token);
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

// $.ajax({
// 	type: 'GET',
// 	url: 'http://gentle-forest-6759.herokuapp.com/iterations',
// 	beforeSend: function(xhr){
// 		xhr.setRequestHeader('api_token', api_token);
// 	},
// 	// datatype: 'json',
// 	error: function (e) {
// 		console.log('error', e);
// 		console.log(e.responseText);
// 		console.log(e.statusText);
// 		console.log(e.status);
// 	},
// 	success: function (s) {
// 		console.log('success', s);
// 	}
// });

// $.ajax({
// 	type: 'GET',
// 	url: 'http://gentle-forest-6759.herokuapp.com/done_iterations',
// 	beforeSend: function(xhr){
// 		xhr.setRequestHeader('api_token', api_token);
// 	},
// 	// datatype: 'json',
// 	error: function (e) {
// 		console.log('error', e);
// 		console.log(e.responseText);
// 		console.log(e.statusText);
// 		console.log(e.status);
// 	},
// 	success: function (s) {
// 		console.log('success', s);
// 	}
// });

// $.ajax({
// 	type: 'GET',
// 	url: 'http://gentle-forest-6759.herokuapp.com/current_iterations',
// 	beforeSend: function(xhr){
// 		xhr.setRequestHeader('api_token', api_token);
// 	},
// 	// datatype: 'json',
// 	error: function (e) {
// 		console.log('error', e);
// 		console.log(e.responseText);
// 		console.log(e.statusText);
// 		console.log(e.status);
// 	},
// 	success: function (s) {
// 		console.log('success', s);
// 	}
// });
