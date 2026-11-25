// Skill check: the needle goes around once. Click/tap while it is inside the zone.
// Miss (or never click) = -1 energy. Either way the guy runs across the screen.

const needle = document.getElementById("needle");
const zone = document.getElementById("zone");
const zoneInside = document.getElementById("zoneInside");
const dialBox = document.getElementById("dialBox");
const dialPic = document.getElementById("dialPic");
const needlePic = document.getElementById("needlePic");
const skillMsg = document.getElementById("skillMsg");
const runner = document.getElementById("runner");

runner.style.backgroundImage = art("runner") || art("person", PERSON);

// YOUR DIAL DRAWINGS
// one drawing for each spot the hit zone can be in. from/to = where the zone is in that drawing,
// in degrees going clockwise from the top (so 90 = right, 180 = bottom, 270 = left)
const DIALS = [
    { name: "dial top right", from: 25, to: 65 },
    { name: "dial bottom right", from: 115, to: 155 },
    { name: "dial bottom left", from: 205, to: 245 },
    { name: "dial top left", from: 295, to: 335 }
];
const NEEDLE_POINTS_AT = 225;   // which way the needle drawing points before the game turns it (225 = bottom left)

// use the drawings only if the needle and all 4 dials are in IMAGES
const drawnDial = art("needle") !== null && DIALS.every(dial => art(dial.name) !== null);
if (drawnDial) {
    dialBox.classList.add("drawn");
    needlePic.style.backgroundImage = art("needle");
}

let skillOn = false, skillDone, skillStart, skillFrame;
// needleFrom = where the needle starts
// zoneStart  = how far the needle turns before it gets to the zone
// zoneSize   = how wide the zone is
let needleFrom, zoneStart, zoneSize;

// a point on the circle, angle in degrees going clockwise from the top
function dialPoint(angle) {
    const rad = angle * Math.PI / 180;
    return (50 * Math.sin(rad)).toFixed(2) + " " + (-50 * Math.cos(rad)).toFixed(2);
}

function playSkill(done) {
    show("skill");
    skillDone = done;
    skillMsg.textContent = "";
    runner.classList.remove("run");

    // the needle always has to turn at least a third of the way before it reaches the zone
    zoneStart = 120 + Math.random() * 180;

    if (drawnDial) {
        // pick one of your 4 dials, and start the needle that far behind its zone
        const dial = DIALS[Math.floor(Math.random() * DIALS.length)];
        dialPic.style.backgroundImage = art(dial.name);
        zoneSize = dial.to - dial.from;
        needleFrom = dial.from - zoneStart;
    } else {
        // code-drawn dial: the needle starts at the top and the zone gets drawn where it needs to be
        zoneSize = SKILL_ZONE;
        needleFrom = 0;
        const arc = `M ${dialPoint(zoneStart)} A 50 50 0 0 1 ${dialPoint(zoneStart + zoneSize)}`;
        zone.setAttribute("d", arc);
        zoneInside.setAttribute("d", arc);
    }
    turnNeedle(0);

    // short pause so you can see where the zone is
    later(() => {
        skillOn = true;
        skillStart = performance.now();
        spin();
    }, 700);
}

// how far the needle has turned since it started, in degrees
function needleAngle() {
    return (performance.now() - skillStart) / SKILL_SPIN * 360;
}

// points the needle: turned = how far it has gone from its starting spot
function turnNeedle(turned) {
    const angle = needleFrom + turned;
    if (drawnDial) needlePic.style.transform = `rotate(${angle - NEEDLE_POINTS_AT}deg)`;
    else needle.setAttribute("transform", `rotate(${angle})`);
}

function spin() {
    const turned = needleAngle();
    turnNeedle(Math.min(turned, 360));
    if (turned >= 360) { skillResult(false); return; }   // went all the way around
    skillFrame = requestAnimationFrame(spin);
}

function skillResult(hit) {
    skillOn = false;
    cancelAnimationFrame(skillFrame);
    skillMsg.textContent = hit ? "Dodged!" : "Missed! -1 energy";
    if (!hit && loseEnergy()) return;
    runner.classList.add("run");
    later(skillDone, 1000);
}

document.getElementById("skill").addEventListener("pointerdown", () => {
    if (!skillOn) return;
    const turned = needleAngle();
    turnNeedle(turned);   // freeze the needle exactly where you clicked
    skillResult(turned >= zoneStart && turned <= zoneStart + zoneSize);
});
