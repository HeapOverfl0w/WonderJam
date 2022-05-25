class Player {
    constructor(playerNumber, name, location, stats, weapons) {
        this.playerNumber = playerNumber;
        this.name = name;
        this.stats = stats;
        this.kills = 0;
        this.deaths = 0;
        this.health = 100;
        this.location = location;
        this.aimingLocation = new Vector2D(Math.floor(Math.random() * TILESX), Math.floor(Math.random() * TILESY));
        this.walkingLocation = undefined;
        this.targetPlayer = undefined;
        this.ableToDodge = true;
        this.animationFrame = 0;
        this.animationTimer = undefined;

        this.weapons = weapons;
        this.primaryWeapon = "none";
        this.secondaryWeapon = "none";

        if (this.weapons.length > 2) {
            this.primaryWeapon = this.weapons[0].id;
            this.secondaryWeapon = this.weapons[1].id;
        } else if (this.weapons.length > 1) {
            this.primaryWeapon = this.weapons[0].id;
        }

        this.startAnimation(0);
    }

    startAnimation(frame) {
        this.animationFrame = frame;
        this.stopAnimation();
        this.animationTimer = window.setInterval((player) => {
            if (player.animationFrame === 0) {
                player.animationFrame = 1;
            } else {
                player.animationFrame = 0;
            }           
        }, frame === 2 ? 200 : 500, this)
    }

    stopAnimation() {
        if (this.animationTimer !== undefined) {
            window.clearInterval(this.animationTimer);
            this.animationTimer = undefined;
        }
    }

    update(level) {
        //if we don't have a target
        if (this.targetPlayer === undefined) {
            //If we don't have a walking target get one, otherwise move towards the location.
            if (this.walkingLocation === undefined) {
                this.walkingLocation = level.findRandomOpenTile();
            } else {
                let newLocation = this.location.copy();
                let angle = angleFormula(newLocation, this.walkingLocation);
                newLocation.x += Math.cos(angle) * (this.stats.speed / 10 * DEFAULT_SPEEDX);
                newLocation.y += Math.sin(angle) * (this.stats.speed / 10 * DEFAULT_SPEEDY);
                //if we hit a wall with this new location get a new random location
                //TODO: A*
                if (!level.collisionArray[Math.round(newLocation.x / TILE_WIDTH)][Math.round(newLocation.y / TILE_HEIGHT)] ||
                    distanceFormula(newLocation, this.walkingLocation) < TILE_WIDTH * 2) {
                    this.walkingLocation = level.findRandomOpenTile();
                } else {
                    this.location = newLocation;
                }
            }
        }

        //check for targets
        let bestDistance = 9999;
        for (let p = 0; p < level.playersArray.length; p++) {
            //TODO: Also check line of sight
            let distance = distanceFormula(this.location, level.playersArray[p].location);
            if (level.playersArray[p] !== this && 
                distance < (this.stats.sight * (TILE_WIDTH) + TILE_WIDTH * 4) &&
                distance < bestDistance) {
                    bestDistance = distance;
                    this.targetPlayer = level.playersArray[p];
                }
        }

        //if we do have a target
        if (this.targetPlayer !== undefined) {
            //if we're aiming at the target then fire
            //TODO add firing with active gun
            let actualTargetLocation = this.targetPlayer.location.copy();
            actualTargetLocation.x -= HALF_TILE_WIDTH;
            actualTargetLocation.y -= HALF_TILE_HEIGHT;
            if (isInsideTileBox(this.aimingLocation, actualTargetLocation)) {
                if (this.weapons[0].ammo > 0) {
                    let newProjectile = this.weapons[0].shoot(angleFormula(this.location, actualTargetLocation), this);
                    if (newProjectile) {
                        //shooting animation
                        this.startAnimation(2);
                        level.projectiles.push(newProjectile);
                    }
                } else {
                    //just remove the weapon for this game if we're out of ammo
                    this.weapons.splice(0, 1);
                }                
            } else { //if we're not aiming at our target yet move toward it           
                //if we're close enough move right on target     
                if (distanceFormula(this.aimingLocation, this.targetPlayer.location) < (this.stats.reaction * 4)) {
                    this.aimingLocation = this.targetPlayer.location.copy();
                } else {
                    let newAimingLocation = this.aimingLocation.copy();
                    //skew for accuracy mess up
                    let aimTowards = new Vector2D(
                        this.targetPlayer.location.x + (Math.random() - 0.5) * (10 - this.stats.accuracy) * TILE_WIDTH,
                        this.targetPlayer.location.y + (Math.random() - 0.5) * (10 - this.stats.accuracy) * TILE_HEIGHT);
                    
                    let angle = angleFormula(newAimingLocation, aimTowards);
                    newAimingLocation.x += Math.cos(angle) * (this.stats.reaction / 5 * HALF_TILE_WIDTH);
                    newAimingLocation.y += Math.sin(angle) * (this.stats.reaction / 5 * HALF_TILE_HEIGHT);
                    this.aimingLocation = newAimingLocation;
                }
            }

            if (this.ableToDodge) {
                this.ableToDodge = false;
                //Find a random tile a few spaces away
                let newWalkingLocation = this.location.copy();
                newWalkingLocation.x += (Math.random() - 0.5) * 16 * TILE_WIDTH;
                newWalkingLocation.y += (Math.random() - 0.5) * 16 * TILE_HEIGHT;
                this.walkingLocation = newWalkingLocation;
                //wait to be able to dodge again
                window.setTimeout((player) => {
                    player.ableToDodge = true;
                }, (12 - this.stats.dodge) * 500, this);
            } else if (this.walkingLocation) {
                let newLocation = this.location.copy();
                let angle = angleFormula(newLocation, this.walkingLocation);
                newLocation.x += Math.cos(angle) * (this.stats.speed / 10 * DEFAULT_SPEEDX);
                newLocation.y += Math.sin(angle) * (this.stats.speed / 10 * DEFAULT_SPEEDY);
                //if we hit a wall with this new location get a new random location
                if (!level.collisionArray[Math.round(newLocation.x / TILE_WIDTH)][Math.round(newLocation.y / TILE_HEIGHT)] || 
                    distanceFormula(newLocation, this.walkingLocation) < TILE_WIDTH) {
                    this.walkingLocation = undefined;
                } else {
                    this.location = newLocation;
                }
            }
        } 
    }

    draw(ctx) {
        //flip the image if the aiming reticle is on the back side of the sprite
        let angle = angleFormula(this.location, this.aimingLocation);

        if ((angle > Math.PI /2  && angle < Math.PI) || (angle < Math.PI /2 * -1  && angle > Math.PI * -1)) {
            ctx.save();
            ctx.translate(Math.floor(this.location.x + HALF_TILE_WIDTH), Math.floor(this.location.y));
            ctx.scale(-1,1);
            ctx.drawImage(PLAYER_SPRITE_SHEET, TILE_WIDTH * this.animationFrame, TILE_HEIGHT * this.playerNumber, TILE_WIDTH, TILE_HEIGHT,
                -HALF_TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT);
            ctx.restore();
        } else {
            ctx.drawImage(PLAYER_SPRITE_SHEET, TILE_WIDTH * this.animationFrame, TILE_HEIGHT * this.playerNumber, TILE_WIDTH, TILE_HEIGHT,
                Math.floor(this.location.x), Math.floor(this.location.y), TILE_WIDTH, TILE_HEIGHT);
        }

        //draw gun
        if (this.weapons[0].currentMagazine > 0) {
            ctx.save();
            ctx.translate(Math.floor(this.location.x + HALF_TILE_WIDTH), Math.floor(this.location.y + 4));
            ctx.rotate(angle);
            if ((angle > Math.PI /2  && angle < Math.PI) || (angle < Math.PI /2 * -1  && angle > Math.PI * -1)) {
                ctx.scale(1,-1);
            }
            ctx.drawImage(WEAPON_SPRITE_SHEET, this.weapons[0].imageLocation.x, this.weapons[0].imageLocation.y, this.weapons[0].imageSize.x, this.weapons[0].imageSize.y,
                0, 0, this.weapons[0].imageRenderSize.x, this.weapons[0].imageRenderSize.y);
            ctx.restore();

            ctx.strokeStyle = getPlayerColor(this.playerNumber);
            ctx.beginPath();
            ctx.rect(Math.floor(this.aimingLocation.x), Math.floor(this.aimingLocation.y), TILE_WIDTH, TILE_HEIGHT);
            ctx.stroke();
        }

        //draw reload icon
        if (this.weapons[0].currentMagazine < 1) {
            ctx.drawImage(MENU_SPRITE_SHEET, 96, 0, TILE_WIDTH, TILE_HEIGHT, Math.floor(this.location.x), Math.floor(this.location.y - 12), TILE_WIDTH, TILE_HEIGHT);
        }
    }
}

class Stats {
    constructor(sight, accuracy, dodge, reaction, speed) {
        this.sight = sight;
        this.accuracy = accuracy;
        this.dodge = dodge;
        this.reaction = reaction;
        this.speed = speed;
    }
}