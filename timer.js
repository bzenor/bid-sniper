
function startTimer(duration, selector) {
    var display = document.querySelector(selector),
        timer = duration,
        minutes,
        seconds;

    var timerInterval = setInterval(function () {

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // minutes = minutes < 10 ? "0" + minutes : minutes;
        // seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + "m " + seconds + 's';

        // stop after countdown
        if (--timer < 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}
