// YOUR OWN DRAWINGS
// Save a PNG in the images folder, then delete the // at the start of its line below.
// Anything still commented out keeps its placeholder.
// Grid sprites and food should be square with a see-through background.
const IMAGES = {
    // --- the grid games ---
    // "box": "images/box.png",
    // "person": "images/person.png",
    // "player": "images/player.png",
    // "table": "images/table.png",

    // --- skill check: the big guy who runs across (uses the person if left out) ---
    // "runner": "images/runner.png",

    // --- skill check: the dial (one drawing for each spot the hit zone can be in) and the needle ---
    "dial top right": "images/dial-top-right.png",
    "dial bottom right": "images/dial-bottom-right.png",
    "dial bottom left": "images/dial-bottom-left.png",
    "dial top left": "images/dial-top-left.png",
    "needle": "images/needle.png",

    // --- card swipe ---
    "card": "images/card.png",
    "reader": "images/reader.png",

    // --- station pictures in the dining hall ---
    // "Flame station": "images/station-flame.png",
    // "Global Kitchen station": "images/station-global-kitchen.png",
    // "Flour + Sauce station": "images/station-flour-sauce.png",
    // "Yogurt station": "images/station-yogurt.png",
    // "Fruit station": "images/station-fruit.png",
    // "Sweets station": "images/station-sweets.png",

    // --- food: Flame ---
    // "Chicken": "images/chicken.png",
    // "Tofu": "images/tofu.png",
    // "Pork": "images/pork.png",
    // "Cheese": "images/cheese.png",
    // "Lettuce": "images/lettuce.png",
    "Brown beans": "images/brown-beans.png",
    "Black beans": "images/black-beans.png",
    // "Guacamole": "images/guacamole.png",
    // "Jalapeños": "images/jalapenos.png",
    // "Green sauce": "images/green-sauce.png",
    // "Red sauce": "images/red-sauce.png",
    // "Rice": "images/rice.png",
    // "Tortilla chips": "images/tortilla-chips.png",

    // --- food: Global Kitchen (Rice is shared with Flame) ---
    // "Noodles": "images/noodles.png",
    // "Chicken curry": "images/chicken-curry.png",
    // "Soup": "images/soup.png",
    // "Bread": "images/bread.png",
    // "Beef": "images/beef.png",

    // --- food: Flour + Sauce ---
    // "Spaghetti": "images/spaghetti.png",
    // "Whole grain penne": "images/whole-grain-penne.png",
    // "Marinara": "images/marinara.png",
    // "Alfredo": "images/alfredo.png",
    // "Cheese pizza": "images/cheese-pizza.png",
    // "Pepperoni pizza": "images/pepperoni-pizza.png",

    // --- food: Yogurt ---
    "Plain yogurt": "images/plain-yogurt.png",
    "Strawberry yogurt": "images/strawberry-yogurt.png",
    "Chia seeds": "images/chia-seeds.png",
    "Granola": "images/granola.png",

    // --- food: Fruit ---
    "Pineapple": "images/pineapple.png",
    "Orange melon": "images/orange-melon.png",
    "Green melon": "images/green-melon.png",
    "Grapes": "images/grapes.png",
    "Strawberries": "images/strawberries.png",

    // --- food: Sweets ---
    "Cake": "images/cake.png",
    "Chocolate chip cookie": "images/chocolate-chip-cookie.png",
    "Danish pastry": "images/danish-pastry.png",
};

// loads all your drawings as soon as the page opens, so nothing shows up late
const preloaded = Object.values(IMAGES).map(path => {
    const pic = new Image();
    pic.src = path;
    return pic;
});

// The built-in placeholder pixel art. Same format as Get to Class Simulator:
// 16 rows of 16 characters, "#" = black pixel, "." = empty.

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

// the people coming at you (from Get to Class)
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

// you (placeholder: same person but filled in)
const PLAYER = [
    "................",
    "........#.......",
    ".......###......",
    "......#####.....",
    ".......###......",
    "........#.......",
    "....#########...",
    "....#.#####.#...",
    "....#.#####.#...",
    "....#.#####.#...",
    "....#.#####.#...",
    "......#####.....",
    "......#...#.....",
    "......#...#.....",
    "......#...#.....",
    "....###.###....."];

// placeholder table
const TABLE = [
    "................",
    "................",
    "................",
    ".##############.",
    ".#............#.",
    ".##############.",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "...#........#...",
    "................",
    "................"];

// turns a sprite into a background-image.
// name = its name in IMAGES (your drawing), map = the built-in placeholder to use if there is no drawing
function art(name, map) {
    if (IMAGES[name]) return `url('${IMAGES[name]}')`;
    if (!map) return null;
    let rects = "";
    map.forEach((row, y) => [...row].forEach((ch, x) => {
        if (ch === "#") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${map[0].length} ${map.length}" shape-rendering="crispEdges">${rects}</svg>`;
    return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}
