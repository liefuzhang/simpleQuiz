$(document).ready(function () {
    var ca = document.cookie;
    if (ca.indexOf("username=") === -1) {
        location.href = 'index.html';
    }
    var valStart = ca.indexOf("username=");
    var valEnd = ca.search(/(;|$)/);
    quiz.userName = ca.substring(valStart + "username=".length, valEnd);
    $("h2").text("Welcome " + quiz.userName);
    
    $("#next").click(onNextClick);
    $("#back").click(onBackClick);
    $("#logout").click(() => {
        document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        location.href = 'index.html';
    });

    loadQuestions(start);
});

var quiz = {
    questions: [],
    score: 0,
    currentIndex: 0,
    selectAnswers: [],
    userName: ""
}

function loadQuestions(success) {
    $.getJSON("questions.json", function (json) {
        quiz.questions = json;
        if (success) {
            success();
        }
    });
}

function start() {
    showOptions(quiz.currentIndex);
}

function hideOptions(callback) {
    $("#options").animate({
        opacity: 0
    }, 1000);
    $("button").addClass("unclickable");
    $("#buttons").animate({
        opacity: 0
    }, 1000);
    $("#question").animate({
        opacity: 0
    }, 1000, function () {
        callback();
    });
}

function showOptions(index) {
    if (index === quiz.questions.length) {
        showScore();
        return;
    }
    var questionObj = quiz.questions[index];
    $("#question").text(questionObj.question);
    $("#question").animate({
        opacity: 1
    }, 1000);
    var buttons = document.createDocumentFragment();
    questionObj.choices.forEach(function (choice, index) {
        var fragment = makeRadioButton("answer", index, choice);
        buttons.appendChild(fragment);
    });
    $("#options").html('');
    $("#options")[0].appendChild(buttons);
    $("#options").animate({
        opacity: 1
    }, 1000);
    $("#buttons").animate({
        opacity: 1
    }, 1000, () => {
        $("button").removeClass("unclickable");
    });
    if (quiz.selectAnswers[quiz.currentIndex]) {
        $('input[name="answer"]').filter(`[value=${quiz.selectAnswers[quiz.currentIndex]}]`).attr('checked', true);
    }
    if (index === 0) {
        $('#back').css('opacity', 0);
    } else {
        $('#back').css('opacity', 1);
    }
}

function makeRadioButton(name, value, text) {
    var fragment = document.createDocumentFragment();
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;
    radio.value = value;
    radio.id = "id_" + value;
    fragment.appendChild(radio);

    var label = document.createElement("label");
    label.appendChild(document.createTextNode(text));
    label.innerHTML += "</br>";
    label.htmlFor = "id_" + value;
    fragment.appendChild(label);

    return fragment;
}

function onNextClick() {
    var value = $('input[name="answer"]:checked').val();
    if (!value) {
        $("#error").text("Please select");
        return;
    }
    $("#error").text('');

    quiz.selectAnswers[quiz.currentIndex] = value;
    hideOptions(function () {
        showOptions(++quiz.currentIndex);
    });
}

function onBackClick() {
    var value = $('input[name="answer"]:checked').val();
    $("#error").text('');
    quiz.selectAnswers[quiz.currentIndex] = value;
    hideOptions(function () {
        showOptions(--quiz.currentIndex);
    });
}

function showScore() {
    quiz.selectAnswers.forEach(function (a, i) {
        if (a == quiz.questions[i].correctAnswer) {
            quiz.score++;
        }
    });
    var usersArray = localStorage["users"];
    var usersArrayObj = JSON.parse(usersArray ? usersArray : "[]");
    if (Array.isArray(usersArrayObj) && usersArrayObj.length > 0) {
        var existingUser = usersArrayObj.find((u) => {
            return u.username === quiz.userName;
        });
        if (existingUser && existingUser.score < quiz.score) {
            existingUser.score = quiz.score;
            localStorage["users"] = JSON.stringify(usersArrayObj);
        }
    }
    $("#question").text("Final Score: " + quiz.score);
    $("#question").animate({
        opacity: 1
    }, 1000);
    $('button').hide();

    var ranking = getRankingHtml();
    $("#ranking").html(ranking);
    $("#ranking").animate({
        opacity: 1
    }, 1000);
}

function getRankingHtml() {
    var html = "<b>Ranking:</b>";
    var usersArray = localStorage["users"];
    var usersArrayObj = JSON.parse(usersArray ? usersArray : "[]");
    if (Array.isArray(usersArrayObj) && usersArrayObj.length > 0) {
        // sort by score
        usersArrayObj.sort((a, b) => {
            return Number(b.score) - Number(a.score);
        })
        usersArrayObj.forEach((user) => {
            html += `<div>${user.username}:    ${user.score}</div>`;
        });
    }
    return html;
}