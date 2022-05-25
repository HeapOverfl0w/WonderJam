class Level {
    constructor(levelImage, obstacleImageLocation, collisionArray, playersArray) {
        this.levelImage = levelImage;
        this.collisionArray = collisionArray;
        this.playersArray = playersArray;
        this.projectiles = [];
        this.matchOver = false;
        this.obstacleImageLocation = obstacleImageLocation;
        this.scores = new Match(playersArray, new Vector2D(10,10));
    }

    update() {
        if (this.matchOver) {
            return;
        }
        //update players
        for (let p = 0; p < this.playersArray.length; p++) {
            this.playersArray[p].update(this);
        }

        //Check projectile collisions and kills.
        for (let i = this.projectiles.length - 1; i > -1; i--) {
            let projectile = this.projectiles[i];
            for (let j = 0; j < this.playersArray.length; j++) {
                let player = this.playersArray[j];
                let projectileLocation = projectile.location.copy();
                projectileLocation.x += HALF_TILE_WIDTH;
                projectileLocation.y += HALF_TILE_HEIGHT;
                let playerHitBoxTopLeft = player.location.copy();
                playerHitBoxTopLeft.x -= 14;
                playerHitBoxTopLeft.y -= 14;
                let playerHitBoxBottomRight = player.location.copy();
                playerHitBoxBottomRight.x += 14;
                playerHitBoxBottomRight.y += 14;
                if (isInsideBox(projectileLocation, playerHitBoxTopLeft, playerHitBoxBottomRight) && projectile.owner !== player) {
                    //Remove health and then check for death.
                    player.health -= projectile.damage;
                    if (player.health < 0) {
                        //Add to projectile owner score
                        projectile.owner.kills += 1;
                        //Reset player
                        player.health = 100;
                        player.deaths += 1;
                        player.targetPlayer = undefined;
                        player.location = this.findRandomOpenTile();
                        player.weapons[0].reload();
                        //reset everyone who was targeting killed player
                        for(let p = 0; p < this.playersArray.length; p++) {
                            if (this.playersArray[p].targetPlayer === player) {
                                this.playersArray[p].targetPlayer = undefined;
                            }
                        }
                        GLOBAL_AUDIO_HANDLER.playDeath();
                    }
                    this.projectiles.splice(i,1);
                    break;
                }
            }

            //wall collision
            if (!this.collisionArray[Math.floor(projectile.location.x / TILE_WIDTH)][Math.floor(projectile.location.y / TILE_HEIGHT)]) {
                    this.projectiles.splice(i,1);
            }
        }

        //move projectiles
        for (let p = 0; p < this.projectiles.length; p++) {
            this.projectiles[p].update();
        }

        this.matchOver = this.playersArray.some((element) => element.kills >= 10);
        if (this.matchOver) {
            //Move scores to middle of the screen.
            this.scores.updateLocation(new Vector2D(Math.floor(TILESX * TILE_WIDTH / 2 - 32), Math.floor(TILESY * TILE_HEIGHT / 2 - 40)));
            for (let p = 0; p < this.playersArray.length; p++) {
                this.playersArray[p].stopAnimation();
            }
        }
    }

    findRandomOpenTile() {
        let x = Math.floor(Math.random() * PLAYABLE_TILESX) + BOARD_BORDER;
        let y = Math.floor(Math.random() * PLAYABLE_TILESY) + BOARD_BORDER;

        if (!this.collisionArray[x][y]) {
            return this.findRandomOpenTile();
        } else {
            return new Vector2D(x * TILE_WIDTH,y * TILE_HEIGHT);
        }
    }

    draw(ctx) {
        if (!this.matchOver) {
            ctx.drawImage(this.levelImage, 0, 0, TILESX * TILE_WIDTH, TILESY * TILE_HEIGHT, 0, 0, TILESX * TILE_WIDTH, TILESY * TILE_HEIGHT);
            for (let p = 0; p < this.playersArray.length; p++) {
                this.playersArray[p].draw(ctx);
            }
            for (let p = 0; p < this.projectiles.length; p++) {
                this.projectiles[p].draw(ctx);
            }
            for (let x = BOARD_BORDER + 1; x < TILESX - BOARD_BORDER - 1; x++) {
                for (let y = BOARD_BORDER + 1; y < TILESY - BOARD_BORDER - 1; y++) {
                    if (!this.collisionArray[x][y]) {
                        ctx.drawImage(OBSTACLES_SPRITE_SHEET, this.obstacleImageLocation.x,this.obstacleImageLocation.y, 16, 48, x * TILE_WIDTH, y * TILE_HEIGHT - 16, 16,48);
                    }
                }
            }
        } else {
            ctx.fillStyle = "#000000";
            ctx.fillRect(this.scores.location.x - TILE_WIDTH, this.scores.location.y - TILE_HEIGHT, 140, 150);
            ctx.fillRect(0, 0, TILESX * TILE_WIDTH, 100);
            ctx.fillRect(0, TILESY * TILE_HEIGHT - 100, TILESX * TILE_WIDTH, 100);
            ctx.fillStyle = TEXT_COLOR;
        }

        this.scores.draw(ctx);
    }
}