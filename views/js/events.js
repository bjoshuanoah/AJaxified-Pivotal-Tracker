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
            input.removeClass('active');
            var api_token = local.get('credentials').api_token;
            getProjects(api_token);
        });
    }
});
