$(document).ready(function () {
    var ca = document.cookie;
    if(ca.indexOf("username=") !== -1) {
        location.href = 'quiz.html?welcome=' + "admin";
    }
    $('button').on("click", () => {
        var userName = $("#userName").val();
        var pwd = $("#password").val();
        if (userName ==="admin" && pwd ==="admin") {
            var json = JSON.stringify({
                username: "admin",
                pwd: "admin"
            })
            localStorage.setItem("login", json);
            document.cookie = "username="+"admin";
            location.href = 'quiz.html';
        } else {
            $("#error").show();
        }
    });
});