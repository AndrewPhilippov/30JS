let countDown;
const endTime = document.querySelector('.display__end-time');
const timeDisplay = document.querySelector('.display__time-left');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {

    clearInterval(countDown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then)

    countDown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        secondsLeft <= 0 ? clearInterval(countDown) : null;
        displayTimeLeft(secondsLeft)
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const displayTime = `${minutes}:${remainderSeconds < 10 ? '0' + remainderSeconds : remainderSeconds}`
    timeDisplay.textContent = displayTime;
    document.title = displayTime;
}

function displayEndTime(timeStamp) {
    const end = new Date(timeStamp)
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes}`
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mins = parseInt(this.minutes.value)
    timer(mins * 60);
    this.reset();
})
