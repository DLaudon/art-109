// The grid game. It gets used 3 ways:
//   walk to the dining hall   (3 wide, people)
//   walk to a station         (2 wide, people + tables)
//   grab your ingredients     (catching mode: 3 wide for mains, 2 wide for desserts)
//
// rows is a list of 5 rows, and each row is a list of the things in it (0, 1 or 2 things)

const ROWS = 5;

const board = document.getElementById("board");
const orderBox = document.getElementById("order");
const dodgeTitle = document.getElementById("dodgeTitle");
const dodgeMsg = document.getElementById("dodgeMsg");

const boxArt = art("box", BOX), personArt = art("person", PERSON), playerArt = art("player", PLAYER), tableArt = art("table", TABLE);

let cols, cells, rows, playerCol, queue, needList, catching, lastCol, stepTime;
let dodgeTimer, dodgeOn = false, dodgeRunning, dodgeDone;

// opt = { title, cols, tick, things, catching }
// things = list of { art } for walking, or { name, art, needed } for catching
function playDodge(opt, done) {
    show("dodge");
    cols = opt.cols;
    catching = opt.catching || false;
    stepTime = opt.tick;
    queue = catching ? mixFoods(opt.things) : shuffle(opt.things);
    needList = opt.things.filter(thing => thing.needed);
    dodgeDone = done;
    rows = [];
    for (let i = 0; i < ROWS; i++) rows.push([]);
    playerCol = cols === 3 ? 1 : 0;
    lastCol = null;
    dodgeOn = true;
    dodgeRunning = false;
    dodgeTitle.textContent = opt.title;
    dodgeMsg.innerHTML = "&larr; &rarr; or tap a side to move";

    board.style.gridTemplateColumns = `repeat(${cols}, var(--cell))`;
    board.innerHTML = "";
    cells = [];
    for (let i = 0; i < cols * ROWS; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.style.backgroundImage = boxArt;
        board.appendChild(cell);
        cells.push(cell);
    }
    drawOrder();
    drawBoard();
}

// puts the foods in a random order where 2 foods you need never come one right after the other:
// the other foods go in a line, and each food you need gets its own gap between them
function mixFoods(things) {
    const need = shuffle(things.filter(thing => thing.needed));
    const other = shuffle(things.filter(thing => !thing.needed));
    const gaps = shuffle([...Array(other.length + 1).keys()]).slice(0, need.length);
    const mixed = [];
    for (let i = 0; i <= other.length; i++) {
        if (gaps.includes(i)) mixed.push(need.pop());
        if (i < other.length) mixed.push(other[i]);
    }
    return mixed.concat(need);   // leftovers, only if there were not enough gaps
}

// makes the next row coming in at the top
function spawn() {
    if (queue.length === 0) return [];
    // always leave an empty row after each row of things so there is time to move,
    // plus some extra random gaps when walking
    if (rows[0].length > 0 || (!catching && Math.random() < 0.3)) return [];

    const things = [queue.shift()];
    // 3 wide: sometimes a second thing comes in the same row (a food you need always comes alone)
    if (cols === 3 && queue.length > 0 && !things[0].needed && !queue[0].needed && Math.random() < DOUBLE_CHANCE) {
        things.push(queue.shift());
    }
    let lanes = shuffle([...Array(cols).keys()]);
    // 2 wide: most of the time the next thing comes down the other side from the last one
    if (cols === 2 && lastCol !== null) lanes = [Math.random() < SWITCH_CHANCE ? 1 - lastCol : lastCol];
    things.forEach((thing, i) => thing.col = lanes[i]);
    lastCol = things[0].col;
    return things;
}

function tick() {
    const gone = rows.pop();
    for (const thing of gone) {
        if (catching && thing.needed) {
            dodgeMsg.textContent = "Missed " + thing.name + "! -1 energy";
            if (loseEnergy()) return;
        }
    }
    rows.unshift(spawn());
    if (checkBottom()) return;
    drawBoard();
    if (queue.length === 0 && rows.every(row => row.length === 0)) finishDodge();
}

// did something reach you? returns true if that ended the game
function checkBottom() {
    const bottom = rows[ROWS - 1];
    const thing = bottom.find(thing => thing.col === playerCol && !thing.hit);
    if (!thing) return false;
    thing.hit = true;

    if (!catching) {
        dodgeMsg.textContent = "Ouch! -1 energy";
        return loseEnergy();
    }

    bottom.splice(bottom.indexOf(thing), 1);   // you grabbed it
    if (thing.needed) {
        thing.got = true;
        dodgeMsg.textContent = "Got " + thing.name;
        drawOrder();
        return false;
    }
    dodgeMsg.textContent = "Wrong one! -1 energy";
    return loseEnergy();
}

function drawBoard() {
    cells.forEach((cell, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const thing = rows[r].find(thing => thing.col === c);
        let html = "";
        if (thing) {
            if (thing.art) html += `<div style="background-image:${thing.art}"></div>`;
            else html += `<div class="label">${thing.name}</div>`;
        }
        if (r === ROWS - 1 && c === playerCol) html += `<div style="background-image:${playerArt}"></div>`;
        cell.innerHTML = html;
    });
}

// the "sprite = name" list of what you need to grab
function drawOrder() {
    let html = "";
    if (catching) {
        html = "<b>You need:</b>";
        needList.forEach(thing => {
            const sprite = thing.art ? `<span class="mini" style="background-image:${thing.art}"></span> = ` : "";
            html += `<div class="${thing.got ? "got" : ""}">${sprite}${thing.name}</div>`;
        });
    }
    orderBox.innerHTML = html;
}

function finishDodge() {
    clearInterval(dodgeTimer);
    dodgeOn = false;
    if (!catching) dodgeMsg.textContent = "Made it";
    else if (needList.every(thing => thing.got)) dodgeMsg.textContent = "Order up!";
    later(dodgeDone, 800);
}

function move(dir) {
    if (!dodgeOn) return;
    if (!dodgeRunning) { dodgeRunning = true; dodgeTimer = setInterval(tick, stepTime); }
    playerCol = Math.max(0, Math.min(cols - 1, playerCol + dir));
    if (checkBottom()) return;
    drawBoard();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
});

// phone: tap the left or right side of the screen
document.getElementById("dodge").addEventListener("pointerdown", e => {
    move(e.clientX < window.innerWidth / 2 ? -1 : 1);
});
