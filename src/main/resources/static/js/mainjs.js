$(document).ready(function() {
    // Hiển thị thông tin người dùng đăng nhập thành công
    $.ajax({
        type: 'GET',
        url: '/users/me',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function(data) {
            var json = JSON.stringify(data, null, 4);
            // $('#profile').html(json);
            $('#profile').html("Xin chào: " + data.fullName + "<br><small class='text-muted'>Email: " + data.email + "</small>");
            if (data.images) {
                $('#images').attr('src', data.images);
            }
            // console.log("SUCCESS : ", data);
            // alert('Hello ' + data.email + '! You have successfully accessed to /api/profile.');
        },
        error: function(e) {
            // var json = e.responseText;
            // $('#feedback').html(json);
            // console.log("ERROR : ", e);
            if (window.location.pathname.includes("/user/profile")) {
                $('#profile').removeClass('alert-info').addClass('alert-danger').html("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
            }
        }
    });

    // Hàm đăng xuất
    $('#logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });

    // Hàm Login
    $('#login').click(function() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
            return;
        }

        var basicInfo = JSON.stringify({
            email: email,
            password: password
        });

        $.ajax({
            type: "POST",
            url: "/auth/login",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: basicInfo,
            success: function(data) {
                localStorage.token = data.token;
                // alert('Got a token from the server! Token: ' + data.token);
                window.location.href = "/user/profile";
            },
            error: function(xhr) {
                var message = "Login Failed";
                if (xhr.responseJSON && xhr.responseJSON.description) {
                    message += ": " + xhr.responseJSON.description;
                }
                alert(message);
            }
        });
    });
});
