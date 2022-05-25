const BOARD_BORDER = 4;
const TILESX = 40;
const TILESY = 32;
const PLAYABLE_TILESX = TILESX - BOARD_BORDER * 2;
const PLAYABLE_TILESY = TILESY - BOARD_BORDER * 2;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const HALF_TILE_WIDTH = TILE_WIDTH / 2;
const HALF_TILE_HEIGHT = TILE_HEIGHT / 2;
const DEFAULT_SPEEDX = TILE_WIDTH / 4;
const DEFAULT_SPEEDY = TILE_HEIGHT / 4;

const TEXT_FONT = "10px MS Gothic";
const TEXT_COLOR = "#FFFFFF";
const BASE_URL = "http://localhost:5000"

const PLAYER1_START = new Vector2D((BOARD_BORDER + 2) * TILE_WIDTH, (BOARD_BORDER + 2)  * TILE_HEIGHT);
const PLAYER2_START = new Vector2D((PLAYABLE_TILESX / 3 + BOARD_BORDER + 2) * TILE_WIDTH, (TILESY - BOARD_BORDER - 2) * TILE_HEIGHT);
const PLAYER3_START = new Vector2D((PLAYABLE_TILESX * 2 / 3 + BOARD_BORDER + 2) * TILE_WIDTH, (BOARD_BORDER + 2) * TILE_HEIGHT);
const PLAYER4_START = new Vector2D((TILESX - BOARD_BORDER - 2)  * TILE_WIDTH, (TILESY - BOARD_BORDER - 2)  * TILE_HEIGHT);
const PLAYER_STARTS = [PLAYER1_START, PLAYER2_START, PLAYER3_START, PLAYER4_START];

//textures
const PROJECTILE_SPRITE_SHEET = document.getElementById('projectiles');
const PLAYER_SPRITE_SHEET = document.getElementById('players');
const WEAPON_SPRITE_SHEET = document.getElementById('weapons');
const MENU_SPRITE_SHEET = document.getElementById('menuitems');
const LEVEL1_IMAGE = document.getElementById('level1');
const LEVEL2_IMAGE = document.getElementById('level2');
const LEVEL3_IMAGE = document.getElementById('level3');
const MENU_BACK_DROP = document.getElementById('menubackdrop');
const OBSTACLES_SPRITE_SHEET = document.getElementById('obstacles');

const GLOBAL_AUDIO_HANDLER = new AudioHandler();

//weapons
let PISTOL_BULLET = new Projectile(new Vector2D(0,0), 20, 10, 0, new Vector2D(0,0));
let SHOTGUN_BULLET = new Projectile(new Vector2D(16,0), 60, 5, 0, new Vector2D(0,0));
let SNIPER_BULLET = new Projectile(new Vector2D(32,0), 60, 15, 0, new Vector2D(0,0));
let SMG_BULLET = new Projectile(new Vector2D(0,0), 10, 10, 0, new Vector2D(0,0));
let KNIFE_BULLET = new Projectile(new Vector2D(48,0), 110, 2.5, 0, new Vector2D(0,0));
let LIGHTNING_BULLET = new Projectile(new Vector2D(64,0), 5, 5, 0, new Vector2D(0,0));
let PISTOL = new Weapon("pistol", new Vector2D(0,0), new Vector2D(15,16), PISTOL_BULLET, 1000, 4000, 6);
let SHOTGUN = new Weapon("shotgun", new Vector2D(16,0), new Vector2D(31,16), SHOTGUN_BULLET, 1500, 5000, 2);
let ASSAULT_RIFLE = new Weapon("assault", new Vector2D(48,0), new Vector2D(31,16), PISTOL_BULLET, 300, 6000, 20);
let SNIPER_RIFLE = new Weapon("sniper", new Vector2D(80,0), new Vector2D(31,16), SNIPER_BULLET, 2000, 7000, 4);
let SMG = new Weapon("smg", new Vector2D(112,0), new Vector2D(27,16), SMG_BULLET, 150, 4000, 20);
let KNIFE = new Weapon("knife", new Vector2D(144,0), new Vector2D(15,16), KNIFE_BULLET, 3000, 1000, 10);
let LIGHTNING_GUN = new Weapon("lightning", new Vector2D(160,0), new Vector2D(31,16), LIGHTNING_BULLET, 50, 6000, 200);

const getPlayerColor = (playerNumber) => {
    if (playerNumber === 0) {
        return "#237E82";
    } else if (playerNumber === 1) {
        return "#38972D";
    } else if (playerNumber === 2) {
        return "#AD3131";
    } else {
        return "#636363";
    }
}

const isInsideTileBox = (location, boxLocation) => {
    return boxLocation.x <= location.x && boxLocation.x + TILE_WIDTH >= location.x &&
        boxLocation.y <= location.y && boxLocation.y + TILE_HEIGHT >= location.y;
}

const isInsideBox = (location, topLeft, bottomRight) => {
    return topLeft.x <= location.x && bottomRight.x >= location.x &&
        topLeft.y <= location.y && bottomRight.y >= location.y;
}

const distanceFormula = (firstLocation, secondLocation) => {
    return Math.sqrt(Math.pow(secondLocation.x - firstLocation.x, 2) + Math.pow(secondLocation.y - firstLocation.y, 2));
}

const angleFormula = (firstLocation, secondLocation) => {
    return Math.atan2(secondLocation.y - firstLocation.y, secondLocation.x - firstLocation.x);
}

const createBasicCollisions = () => {
    let collisionArray = [];
    for (let x = 0; x < TILESX; x++) {
        collisionArray.push([]);
        for (let y = 0; y < TILESY; y++) {
            if (isInsideBox(new Vector2D(x,y), new Vector2D(BOARD_BORDER,BOARD_BORDER), new Vector2D(TILESX - BOARD_BORDER - 1, TILESY - BOARD_BORDER - 1))) {
                collisionArray[x].push(true);
            } else {
                collisionArray[x].push(false);
            }
        }
    }
    return collisionArray;
}

const createLevel1Collisions = () => {
    let collisionArray = createBasicCollisions();
    collisionArray[10][10] = false;
    collisionArray[10][22] = false;
    collisionArray[29][10] = false;
    collisionArray[29][22] = false;
    return collisionArray;
}

const createLevel2Collisions = () => {
    let collisionArray = createBasicCollisions();
    collisionArray[10][10] = false;
    collisionArray[10][22] = false;
    collisionArray[29][10] = false;
    collisionArray[29][22] = false;
    collisionArray[26][20] = false;
    collisionArray[20][22] = false;
    collisionArray[26][12] = false;
    collisionArray[20][10] = false;
    collisionArray[14][12] = false;
    collisionArray[14][20] = false;
    return collisionArray;
}

const createLevel3Collisions = () => {
    let collisionArray = createBasicCollisions();
    collisionArray[7][9] = false;
    collisionArray[15][2] = false;
    collisionArray[10][27] = false;
    collisionArray[20][22] = false;
    collisionArray[9][15] = false;
    collisionArray[30][7] = false;
    collisionArray[26][20] = false;
    collisionArray[28][5] = false;
    collisionArray[28][24] = false;
    collisionArray[14][20] = false;
    collisionArray[16][16] = false;
    collisionArray[17][12] = false;
    collisionArray[33][16] = false;
    collisionArray[27][13] = false;
    collisionArray[26][12] = false;
    collisionArray[33][17] = false;
    collisionArray[6][28] = false;
    return collisionArray;
}