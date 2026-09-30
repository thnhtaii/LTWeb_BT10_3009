$(document).ready(function() {

    // 1. Tải thông tin cá nhân người dùng (/users/me) khi vào trang profile
    if (window.location.pathname.includes("/user/profile")) {
        if (!localStorage.token) {
            window.location.href = "/login";
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/users/me',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            },
            success: function(data) {
                $('#user-fullname').text(data.fullName);
                $('#user-email').text(data.email);
                $('#json-preview').text(JSON.stringify(data, null, 2));

                // Tự động tải danh sách người dùng ban đầu
                loadAllUsers();
            },
            error: function() {
                $('#user-fullname').text("Phiên đăng nhập đã hết hạn");
                $('#user-email').text("Vui lòng đăng nhập lại");
                setTimeout(function() {
                    localStorage.clear();
                    window.location.href = "/login";
                }, 2000);
            }
        });
    }

    // 2. Hàm gọi API lấy danh sách toàn bộ người dùng (GET /users/)
    function loadAllUsers() {
        $.ajax({
            type: 'GET',
            url: '/users/',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: function(users) {
                var tbody = $('#users-table-body');
                tbody.empty();
                if (users && users.length > 0) {
                    users.forEach(function(user) {
                        var row = '<tr>' +
                            '<td>' + user.id + '</td>' +
                            '<td>' + (user.fullName || '') + '</td>' +
                            '<td>' + (user.email || '') + '</td>' +
                            '</tr>';
                        tbody.append(row);
                    });
                } else {
                    tbody.append('<tr><td colspan="3" class="text-center text-muted">Chưa có người dùng nào</td></tr>');
                }
            },
            error: function(err) {
                console.error("Lỗi khi tải danh sách người dùng:", err);
            }
        });
    }

    // Nút "Xem danh sách người dùng"
    $('#btn-load-users').click(function() {
        loadAllUsers();
    });

    // 3. Hàm Đăng xuất
    $('#logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });

    // 4. Hàm Đăng nhập (trang /login)
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
                window.location.href = "/user/profile";
            },
            error: function(xhr) {
                var message = "Đăng nhập thất bại";
                if (xhr.responseJSON && xhr.responseJSON.description) {
                    message += ": " + xhr.responseJSON.description;
                }
                alert(message);
            }
        });
    });
});
