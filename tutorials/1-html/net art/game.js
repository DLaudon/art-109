const COLS = 3, ROWS = 5;
const TICK = 550;
const OBSTACLES_BEFORE_DOOR = 15;

const BOX = [
    "..############..",
    ".#............#.",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    ".#............#.",
    "..############.."];

const DOOR = [
    ".##############.",
    "####........####",
    "###........#####",
    "###.......##.###",
    "###.....##...###",
    "###...##.....###",
    "###...#......###",
    "###...#......###",
    "###...#......###",
    "###...###....###",
    "###...#.#....###",
    "###...#......###",
    "###...#......###",
    "###...#....##.##",
    "###...#.###...##",
    "......##........"];

const BOOK = [
    "................",
    "................",
    "....##########..",
    "...#.#.......#..",
    "...#.#.......#..",
    "...#.#..#.#..#..",
    "...#.#.#.#.#.#..",
    "...#.#.......#..",
    "...#.#.......#..",
    "...#.#.......#..",
    "...#.#.......#..",
    "...#.#.......#..",
    "...###########..",
    "...#..#......#..",
    "....##########..",
    "......#........."];

const SCOOTER = [
    "................",
    "..#.............",
    "...##...........",
    "....##..........",
    "....#.#.........",
    "....#...........",
    "....#...........",
    "....#.......#...",
    "....###########.",
    "....#.......#...",
    "...#.#.....#.#..",
    "....#.......#...",
    "................",
    "................",
    "................",
    "................"];

const PERSON = [
    "................",
    "........#.......",
    ".......#.#......",
    "......#...#.....",
    ".......#.#......",
    "........#.......",
    "....####.####...",
    "....#.#...#.#...",
    "....#.#...#.#...",
    "....#.#...#.#...",
    "....#.#...#.#...",
    "......#####.....",
    "......#...#.....",
    "......#...#.....",
    "......#...#.....",
    "....###.###....."];

const OBSTACLES = [BOOK, SCOOTER, PERSON];

const LOSE = [
    "........####....................",
    "......##..##....................",
    "##..##....##......##..###.##....",
    "####......##......#.#.#...#.#...",
    "##........##......##..###.#.#...",
    "##......######....#.#.#...#.#...",
    "##....##..#...##..##..###.##....",
    "##...#.....##.####..............",
    "##..#........##...##............",
    "##..##......##......##..........",
    "####.#....##..........##......##",
    "###...#.##..............##....##",
    "###...##..................##.###",
    "###.##.....................#####",
    "#####.........................##",
    "###..##......................###",
    "##.##..##..................##.##",
    "##...##..##........##....##..###",
    ".......##..##......##..##..##.##",
    ".........##..##....####..##.....",
    "...........##..##..##..##.......",
    ".............##..######.........",
    "...............##.###...........",
    ".................#.##..........."];

const WIN = [
    "................................",
    "................................",
    "................................",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "...........##....##.............",
    "................................",
    ".......#...............#........",
    ".......##.............##........",
    "........##...........##.........",
    ".........##.........##..........",
    "..........###.....###...........",
    "...........#########............",
    "............#######.............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................"];

function art(map) {
    let rects = "";
    map.forEach((row, y) => [...row].forEach((ch, x) => {
        if (ch === "#") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${map[0].length} ${map.length}" shape-rendering="crispEdges">${rects}</svg>`;
    return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

const doorArt = art(DOOR), playerArt = art(PERSON), obstacleArt = OBSTACLES.map(art);

const board = document.getElementById("board");
const msg = document.getElementById("msg");
const cells = [];
for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.backgroundImage = art(BOX);
    board.appendChild(cell);
    cells.push(cell);
}

let rows, playerCol, spawned, timer, running, over;

function reset() {
    rows = Array(ROWS).fill(null);
    playerCol = 1;
    spawned = 0;
    running = false;
    over = false;
    msg.innerHTML = "&larr; &rarr; to move";
    draw();
}

function spawn() {
    if (rows[0]) return null;
    if (spawned > OBSTACLES_BEFORE_DOOR) return null;
    if (spawned === OBSTACLES_BEFORE_DOOR) { spawned++; return { art: doorArt, col: Math.random() < 0.5 ? 0 : COLS - 1, door: true }; }
    if (Math.random() < 0.3) return null;
    spawned++;
    return { art: obstacleArt[Math.floor(Math.random() * obstacleArt.length)], col: Math.floor(Math.random() * COLS) };
}

function tick() {
    rows.pop();
    rows.unshift(spawn());
    check();
    draw();
}

function check() {
    const bottom = rows[ROWS - 1];
    if (!bottom) return;
    if (bottom.door) end(bottom.col === playerCol);
    else if (bottom.col === playerCol) end(false);
}

function draw() {
    cells.forEach((cell, i) => {
        const r = Math.floor(i / COLS), c = i % COLS, item = rows[r];
        let html = "";
        if (item && item.col === c) html += `<div style="background-image:${item.art}"></div>`;
        if (r === ROWS - 1 && c === playerCol) html += `<div style="background-image:${playerArt}"></div>`;
        cell.innerHTML = html;
    });
}

function end(won) {
    clearInterval(timer);
    running = false;
    over = true;
    msg.innerHTML = (won ? "You made it to class" : "You missed class") +
        `<div id="end" style="background-image:${art(won ? WIN : LOSE)}"></div>` +
        `<div>&larr; or &rarr; to restart</div>`;
}

document.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (over) { reset(); return; }
    if (!running) { running = true; timer = setInterval(tick, TICK); }
    if (e.key === "ArrowLeft") playerCol = Math.max(0, playerCol - 1);
    else playerCol = Math.min(COLS - 1, playerCol + 1);
    check();
    draw();
});

reset();