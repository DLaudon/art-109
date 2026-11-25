// Card swipe: drag the card all the way across.
// It times the swipe, and it only counts if it took between SWIPE_MIN and SWIPE_MAX.

const card = document.getElementById("card");
const track = document.getElementById("track");
const ledRed = document.getElementById("ledRed");
const ledGreen = document.getElementById("ledGreen");
const swipeMsg = document.getElementById("swipeMsg");

let swipeOn = false, swipeDone, dragging = false, grabX, swipeStart;

// use your own card and reader drawings if they are in IMAGES
const reader = document.getElementById("reader");
if (art("card")) {
    card.style.backgroundImage = art("card");
    card.textContent = "";
    card.classList.add("drawn");
}
if (art("reader")) {
    reader.style.backgroundImage = art("reader");
    reader.classList.add("drawn");
}

function playSwipe(done) {
    show("swipe");
    swipeDone = done;
    swipeOn = true;
    dragging = false;
    card.style.left = "0px";
    ledRed.classList.remove("on");
    ledGreen.classList.remove("on");
    swipeMsg.textContent = "drag the card across";
}

card.addEventListener("pointerdown", e => {
    if (!swipeOn) return;
    ledRed.classList.remove("on");
    dragging = true;
    grabX = e.clientX;
    swipeStart = 0;
    card.setPointerCapture(e.pointerId);
});

card.addEventListener("pointermove", e => {
    if (!dragging) return;
    const end = track.clientWidth - card.offsetWidth;
    const x = Math.max(0, Math.min(end, e.clientX - grabX));
    card.style.left = x + "px";
    if (x > 0 && !swipeStart) swipeStart = performance.now();   // timer starts when the card moves
    if (x >= end) swipeResult(performance.now() - swipeStart);
});

// letting go sends the card back to the start (free reswipe)
function letGo() {
    dragging = false;
    if (swipeOn) card.style.left = "0px";
}
card.addEventListener("pointerup", letGo);
card.addEventListener("pointercancel", letGo);

function swipeResult(ms) {
    dragging = false;
    if (ms < SWIPE_MIN || ms > SWIPE_MAX) {
        ledRed.classList.add("on");
        swipeMsg.textContent = (ms < SWIPE_MIN ? "Too fast" : "Too slow") + ". Swipe again";
        return;
    }
    swipeOn = false;
    ledGreen.classList.add("on");
    swipeMsg.textContent = "Accepted";
    later(swipeDone, 900);
}
