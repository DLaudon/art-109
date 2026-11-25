// Inside the dining hall (A-Frame). The stations sit in a circle around you.
// Drag to look around, click/tap the station you think has your food.

const scene = document.querySelector("a-scene");
const want = document.getElementById("want");
const menu = document.getElementById("menu");
const pics = document.getElementById("pics");

const STATION_DISTANCE = 5;   // how far the stations are from you
const STATION_SIZE = 3;       // width and height of each station picture

let hallOn = false, hallDone, dragAmount = 0, menuTime = 0;

// placeholder picture: a box with the station name in it
function placeholder(name) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const pen = canvas.getContext("2d");
    pen.fillStyle = "#fff";
    pen.fillRect(0, 0, 256, 256);
    pen.lineWidth = 8;
    pen.strokeRect(4, 4, 248, 248);
    pen.fillStyle = "#000";
    pen.font = "bold 30px monospace";
    pen.textAlign = "center";
    const words = name.split(" ");
    words.forEach((word, i) => pen.fillText(word, 128, 138 + (i - (words.length - 1) / 2) * 36));
    return canvas.toDataURL();
}

// put each station in the circle once its picture has loaded
STATIONS.forEach((station, i) => {
    const pic = new Image();
    pic.id = "stationPic" + i;
    pic.onload = () => {
        const angle = i * 360 / STATIONS.length;
        const rad = angle * Math.PI / 180;
        const x = STATION_DISTANCE * Math.sin(rad), z = -STATION_DISTANCE * Math.cos(rad);

        const el = document.createElement("a-image");
        el.setAttribute("src", "#stationPic" + i);
        el.setAttribute("position", `${x} 2 ${z}`);
        el.setAttribute("rotation", `0 ${-angle} 0`);
        el.setAttribute("width", STATION_SIZE);
        el.setAttribute("height", STATION_SIZE);
        el.classList.add("station");

        el.addEventListener("mouseenter", () => el.setAttribute("scale", "1.1 1.1 1.1"));
        el.addEventListener("mouseleave", () => el.setAttribute("scale", "1 1 1"));
        el.addEventListener("click", () => pickStation(station));
        scene.appendChild(el);
    };
    pic.src = IMAGES[station.name + " station"] || placeholder(station.name);
    pics.appendChild(pic);
});

function playHall(done) {
    show("hall");
    scene.resize();
    hallDone = done;
    hallOn = true;
    menu.classList.remove("on");
    want.innerHTML = "You want: <b>" + order.name + "</b><br><small>drag to look around, click/tap a station</small>";
}

function pickStation(station) {
    if (!hallOn || dragAmount > 10) return;   // dragging to look around is not a pick

    if (station === order.station) {
        hallOn = false;
        want.innerHTML = "<b>" + station.name + "</b> has it!";
        later(hallDone, 900);
        return;
    }

    // wrong station: lose energy and see its menu
    if (loseEnergy()) return;
    menu.innerHTML = "<h2>" + station.name + "</h2>" + station.items.join("<br>") +
        "<p><b>Wrong station. -1 energy</b></p><small>click/tap to go back</small>";
    menu.classList.add("on");
    menuTime = performance.now();
}

// close the menu (the short wait stops the same tap from closing it right away)
menu.addEventListener("click", () => {
    if (performance.now() - menuTime > 400) menu.classList.remove("on");
});

// keep track of how far the mouse/finger moved since it went down
const hall = document.getElementById("hall");
let lastX, lastY;
hall.addEventListener("pointerdown", e => {
    dragAmount = 0;
    lastX = e.clientX;
    lastY = e.clientY;
});
hall.addEventListener("pointermove", e => {
    dragAmount += Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;
});
