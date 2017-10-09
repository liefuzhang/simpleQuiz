$(document).ready(function () {
    var ca = document.cookie;
    if (ca.indexOf("username=") !== -1) {
        location.href = 'quiz.html';
    }
    $('button').on("click", onButtonClick);
    $(document).keypress(function (e) {
        if (e.which == 13) {
            onButtonClick();
        }
    });
});

function onButtonClick() {
    var userName = $("#userName").val();
    var pwd = $("#password").val();
    var usersArray = localStorage["users"];
    var usersArrayObj = JSON.parse(usersArray ? usersArray : "[]");
    if (Array.isArray(usersArrayObj) && usersArrayObj.length > 0) {
        var existingUser = usersArrayObj.find((u) => {
            return u.username === userName;
        });
        if (existingUser && existingUser.pwd === pwd) {
            document.cookie = "username=" + userName;
            location.href = 'quiz.html';
            return;
        } else if (existingUser) {
            $("#error").show();
            return;
        } 
    }

    // new user
    usersArrayObj.push({ username: userName, pwd: pwd, score: 0 });
    localStorage["users"] = JSON.stringify(usersArrayObj);
    document.cookie = "username=" + userName;
    location.href = 'quiz.html';        
}