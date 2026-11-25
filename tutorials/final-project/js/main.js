// The order of the whole game + the energy bar.

const energyBar = document.getElementById("energy");

let mode, energy, order;
const timers = [];

// ---------- helpers ----------

function show(id) {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.toggle("on", screen.id === id));
}

// like setTimeout, but it gets cancelled if the game ends
function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
}

function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ---------- energy ----------

function drawEnergy() {
    let html = "<span>ENERGY</span>";
    for (let i = 0; i < mode.energy; i++) html += `<div class="seg ${i < energy ? "full" : ""}"></div>`;
    energyBar.innerHTML = html;
}

// takes 1 energy away. returns true if that was the last one (game over)
function loseEnergy() {
    energy--;
    drawEnergy();
    energyBar.classList.add("flash");
    setTimeout(() => energyBar.classList.remove("flash"), 200);
    if (energy > 0) return false;
    stopEverything();
    endScreen("Out of energy", "You fell asleep before you got to eat.", "Try again");
    return true;
}

function stopEverything() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    clearInterval(dodgeTimer);
    cancelAnimationFrame(skillFrame);
    dodgeOn = swipeOn = skillOn = hallOn = false;
}

// ---------- the game, in order ----------

function startGame(name) {
    mode = MODES[name];
    energy = mode.energy;
    drawEnergy();
    walkToHall();
}

function walkToHall() {
    const people = [];
    for (let i = 0; i < HALL_PEOPLE; i++) people.push({ art: personArt });
    playDodge({ title: "Walk to the dining hall", cols: 3, tick: mode.tick3, things: people }, cardSwipe);
}

function cardSwipe() {
    playSwipe(() => playSkill(() => lookForFood("main")));
}

// type is "main" first, then "dessert"
function lookForFood(type) {
    order = makeOrder(type);
    playHall(() => walkToStation(type));
}

function makeOrder(type) {
    const choices = STATIONS.filter(station => station.type === type);
    const station = choices[Math.floor(Math.random() * choices.length)];
    const items = shuffle(station.items).slice(0, station.pick);
    return { station: station, items: items, name: station.want || items.join(" + ") };
}

function walkToStation(type) {
    const things = [];
    for (let i = 0; i < STATION_OBSTACLES; i++) things.push({ art: Math.random() < 0.5 ? personArt : tableArt });
    playDodge({ title: "Walk to " + order.station.name, cols: 2, tick: mode.tick2, things: things }, () => grabFood(type));
}

function grabFood(type) {
    const things = order.station.items.map(name => ({
        name: name,
        art: art(name),   // your drawing from IMAGES, or nothing (then the name shows as text)
        needed: order.items.includes(name)
    }));
    // main food is 3 wide and slower, dessert is 2 wide
    const cols = type === "main" ? 3 : 2;
    const speed = type === "main" ? mode.tickMain : mode.tick2;
    playDodge({ title: "Order at " + order.station.name, cols: cols, tick: speed, things: things, catching: true },
        () => playSkill(() => type === "main" ? lookForFood("dessert") : sitDown()));
}

function sitDown() {
    endScreen("You sat down to eat", "Energy left: " + energy + " / " + mode.energy, "Play again");
}

function endScreen(title, text, button) {
    document.getElementById("endTitle").textContent = title;
    document.getElementById("endText").textContent = text;
    document.getElementById("again").textContent = button;
    show("end");
}

// ---------- buttons ----------

document.querySelectorAll("#start .mode").forEach(button => {
    button.addEventListener("click", () => startGame(button.dataset.mode));
});

document.getElementById("again").addEventListener("click", () => {
    energyBar.innerHTML = "";
    show("start");
});
