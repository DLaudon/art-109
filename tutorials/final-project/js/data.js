// Everything you would want to tweak is in this file.

// ms per step, lower = things move faster
//   tick3    = walk to the dining hall (3 wide)
//   tick2    = the 2 wide grids (walk to a station, dessert order)
//   tickMain = grabbing your main food (slower because there are more foods to read)
const MODES = {
    tired: { energy: 6, tick3: 250, tick2: 300, tickMain: 340 },
    rested: { energy: 10, tick3: 360, tick2: 360, tickMain: 480 }
};

const SWITCH_CHANCE = 0.8;     // 2 wide grids: how often the next thing comes down the other side (0.5 = random)
const DOUBLE_CHANCE = 0.35;    // 3 wide grids: how often 2 things come in the same row (0 = never, 1 = always)

const HALL_PEOPLE = 10;        // people to dodge on the way to the dining hall
const STATION_OBSTACLES = 8;   // people + tables on the way to a station

const SWIPE_MIN = 300;         // a good card swipe takes at least this long (ms)
const SWIPE_MAX = 900;         // ...and at most this long

const SKILL_SPIN = 1000;       // ms for the needle to go around once, lower = faster
const SKILL_ZONE = 50;         // size of the hit zone in degrees (only for the code-drawn dial, your drawn dials use the zone in the drawing)

// The stations in the dining hall.
//   type  = "main" or "dessert"
//   pick  = how many of the items get picked at random for your order
//   want  = what the hall screen says you want (if left out it lists the picked items)
// (station pictures and food sprites go in the IMAGES list at the top of sprites.js)
const STATIONS = [
    {
        name: "Flame", type: "main", pick: 4, want: "Burrito bowl",
        items: ["Chicken", "Tofu", "Pork", "Cheese", "Lettuce", "Brown beans", "Black beans",
            "Guacamole", "Jalapeños", "Green sauce", "Red sauce", "Rice", "Tortilla chips"]
    },
    {
        name: "Global Kitchen", type: "main", pick: 2,
        items: ["Rice", "Noodles", "Chicken curry", "Soup", "Bread", "Beef"]
    },
    {
        name: "Flour + Sauce", type: "main", pick: 3,
        items: ["Spaghetti", "Whole grain penne", "Marinara", "Alfredo", "Cheese pizza", "Pepperoni pizza"]
    },
    {
        name: "Yogurt", type: "dessert", pick: 2,
        items: ["Plain yogurt", "Strawberry yogurt", "Chia seeds", "Granola"]
    },
    {
        name: "Fruit", type: "dessert", pick: 2,
        items: ["Pineapple", "Orange melon", "Green melon", "Grapes", "Strawberries"]
    },
    {
        name: "Sweets", type: "dessert", pick: 1,
        items: ["Cake", "Chocolate chip cookie", "Danish pastry"]
    }
];
