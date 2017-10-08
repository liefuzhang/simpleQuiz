$(document).ready(function () {
    if (window.location.search) {
        var i = window.location.search.indexOf("=");
        var name = window.location.search.substring(i+1);
        $("h2").text("Welcome " + name);
    }
    start();
    $("#next").click(onNextClick);
    $("#back").click(onBackClick);
});

var quiz = {
    questions: [
        {
            question: "Who is Prime Minister of the United Kingdom?",
            choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"],
            correctAnswer: 0
        },
        {
            question: "Who played Neo in The Matrix?",
            choices: ["Tom Cruise", "Brad Pitt", "Keanu Reeves", "Will Smith"],
            correctAnswer: 2
        },
        {
            question: "What is the name of the director of the Lord of the Rings trilogy?",
            choices: ["Steven Spielberg", "Peter Jackson", "Christopher Nolan"],
            correctAnswer: 1
        },
    ],
    score: 0,
    currentIndex: 0,
    selectAnswers: []
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
    $("#question").text("Final Score: " + quiz.score);
    $("#question").animate({
        opacity: 1
    }, 1000);
    $('button').hide();
}