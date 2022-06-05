class Menu {
    constructor(userData, identityAgent, logoutCallback) {
        this.userName = userData.userName;
        this.gameData = userData.gameData;
        this.identityAgent = identityAgent;
        this.logoutCallback = logoutCallback;
        this.weapons = [];
        this.weapons.push(new WeaponMenu(new Vector2D(70, 55), "Shotgun", this.gameData.shotgunAmmo, this, this.onShotgunAmmoBuyClick, this.onShotgunBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 75), "Assault Rifle", this.gameData.assaultRifleAmmo, this, this.onAssaultRifleAmmoBuyClick, this.onAssaultRifleBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 95), "Sniper Rifle", this.gameData.sniperRifleAmmo, this, this.onSniperRifleAmmoBuyClick, this.onSniperRifleBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 115), "SMG", this.gameData.smgAmmo, this, this.onSmgAmmoBuyClick, this.onSmgBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 135), "Throwing Knife", this.gameData.throwingKnifeAmmo, this, this.onThrowingKnifeAmmoBuyClick, this.onThrowingKnifeBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 155), "Lightning Gun", this.gameData.lightningGunAmmo, this, this.onLightningGunAmmoBuyClick, this.onLightningGunBuyClick));
        this.weapons.push(new WeaponMenu(new Vector2D(70, 175), "Laser Rifle", this.gameData.laserRifleAmmo, this, this.onLaserRifleAmmoBuyClick, this.onLaserRifleBuyClick));

        this.stats = [];
        this.stats.push(new Stat(new Vector2D(TILESX * TILE_WIDTH - 200, 60), "Reaction", this.gameData.reaction, this, this.onReactionClick));
        this.stats.push(new Stat(new Vector2D(TILESX * TILE_WIDTH - 200, 80), "Sight", this.gameData.sight, this, this.onSightClick));
        this.stats.push(new Stat(new Vector2D(TILESX * TILE_WIDTH - 200, 100), "Accuracy", this.gameData.accuracy, this, this.onAccuracyClick));
        this.stats.push(new Stat(new Vector2D(TILESX * TILE_WIDTH - 200, 120), "Speed", this.gameData.speed, this, this.onSpeedClick));
        this.stats.push(new Stat(new Vector2D(TILESX * TILE_WIDTH - 200, 140), "Dodge", this.gameData.dodge, this, this.onDodgeClick));

        this.buttons = [];
        this.buttons.push(new Button(new Vector2D(128, 0), new Vector2D(128, 32), new Vector2D(TILESX * TILE_WIDTH / 2 - 64, TILESY * TILE_HEIGHT - 50), new Vector2D(112, 32), this, this.onStartMatchClick));
        this.buttons.push(new Button(new Vector2D(0, 64), new Vector2D(64, 64), new Vector2D(TILESX * TILE_WIDTH - 74, 10), new Vector2D(64, 16), this, this.logoutCallback));
        this.muteButton = new Button(new Vector2D(112, 0), new Vector2D(112,16), new Vector2D(TILESX * TILE_WIDTH - 20, TILESY * TILE_HEIGHT - 20), new Vector2D(16,16), this, this.onMuteClick);

        this.matchResults = new MatchResults(new Vector2D(10, 200), this, this.onMatchResultsRefresh);
        this.fetchMatchResults();

        this.topPlayers = new TopPlayers(new Vector2D(254, 60), this, this.onTopPlayersRefresh);
        this.fetchTopPlayers();

        this.ladderCheckBox = new ImageCheckbox(new Vector2D(144, 64), new Vector2D(160, 64), new Vector2D(TILESX * TILE_WIDTH / 2 - 100, TILESY * TILE_HEIGHT - 70), new Vector2D(10,10), "Ladder Match (Level 50+ Players Only)")
        
        this.game = new Game(this.onEndMatch, this);
        this.showGame = false;

        this.update(this.gameData);

        this.chatEnabled = true;
        this.lastText = "";
        this.chatTimer = undefined;

        this.refreshEnabled = true;
        this.waitForResponse = false;
    }

    addMessage(text) {
        this.lastText = text;
        var node = document.createElement("LI");
        var textnode = document.createTextNode(text);
        node.appendChild(textnode);

        var discussion = document.getElementById("discussion");
        if (discussion.children.length > 40)
            discussion.removeChild(discussion.firstChild);
        discussion.appendChild(node);

        discussion.scrollTop = discussion.scrollHeight;
    }

    sendMessage(text) {
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/chat/send?text='+text, {
            method: 'GET',
            headers: headers
        })
        .catch(error => {console.error(error)});
    }

    disconnectFromChat() {
        if (this.chatTimer) {
            window.clearInterval(this.chatTimer);
        }
    }

    update(gameData) {
        this.gameData = gameData;

        //enable stats if possible
        this.enableStats();
        this.updateStats();
        this.enableWeapons();
        this.updateWeapons();
    }

    enableWeapons() {
        if (this.gameData.money > 49) {
            //Shotgun
            if (!this.gameData.shotgun) {
                this.weapons[0].enableBuy();
            }
            //Assault Rifle
            if (!this.gameData.assaultRifle) {
                this.weapons[1].enableBuy();
            }
            //Sniper Rifle
            if (!this.gameData.sniperRifle) {
                this.weapons[2].enableBuy();
            }
            //SMG
            if (!this.gameData.smg) {
                this.weapons[3].enableBuy();
            }
            //Throwing Knife
            if (!this.gameData.throwingKnife) {
                this.weapons[4].enableBuy();
            }
            //Lightning Gun
            if (!this.gameData.lightningGun) {
                this.weapons[5].enableBuy();
            }
            //Laser Rifle
            if (!this.gameData.laserRifle) {
                this.weapons[6].enableBuy();
            }
        } else {
            for (let w = 0; w < this.weapons.length; w++) {
                this.weapons[w].disableBuy();
            }
        }

        if (this.gameData.money > 9) {
            //Shotgun
            if (this.gameData.shotgun) {
                this.weapons[0].enableAmmoBuy();
            }
            //Assault Rifle
            if (this.gameData.assaultRifle) {
                this.weapons[1].enableAmmoBuy();
            }
            //Sniper Rifle
            if (this.gameData.sniperRifle) {
                this.weapons[2].enableAmmoBuy();
            }
            //SMG
            if (this.gameData.smg) {
                this.weapons[3].enableAmmoBuy();
            }
            //Throwing Knife
            if (this.gameData.throwingKnife) {
                this.weapons[4].enableAmmoBuy();
            }
            //Lightning Gun
            if (this.gameData.lightningGun) {
                this.weapons[5].enableAmmoBuy();
            }
            //Laser Rifle
            if (this.gameData.laserRifle) {
                this.weapons[6].enableAmmoBuy();
            }
        } else {
            for (let w = 0; w < this.weapons.length; w++) {
                this.weapons[w].disableAmmoBuy();
            }
        }
    }

    updateWeapons() {
        this.weapons[0].ammo = this.gameData.shotgunAmmo;
        this.weapons[1].ammo = this.gameData.assaultRifleAmmo;
        this.weapons[2].ammo = this.gameData.sniperRifleAmmo;
        this.weapons[3].ammo = this.gameData.smgAmmo;
        this.weapons[4].ammo = this.gameData.throwingKnifeAmmo;
        this.weapons[5].ammo = this.gameData.lightningGunAmmo;
        this.weapons[6].ammo = this.gameData.laserRifleAmmo;
    }

    enableStats() {
        let level = this.gameData.accuracy + this.gameData.dodge + this.gameData.reaction + this.gameData.speed + this.gameData.sight;
        if (this.gameData.level > level) {
            for (let s = 0; s < this.stats.length; s++) {
                this.stats[s].enableUpgrade();
            }
        } else {
            for (let s = 0; s < this.stats.length; s++) {
                this.stats[s].disableUpgrade();
            }
        }
    }

    onMuteClick(menu) {
        GLOBAL_AUDIO_HANDLER.toggleMute();
    }

    updateStats() {
        for (let s = 0; s < this.stats.length; s++) {
            switch (this.stats[s].name) {
                case "Accuracy":
                    this.stats[s].level = this.gameData.accuracy;
                    if (this.gameData.accuracy > 10) {
                        this.stats[s].disableUpgrade();
                    }
                    break;
                case "Dodge":
                    this.stats[s].level = this.gameData.dodge;
                    if (this.gameData.dodge > 10) {
                        this.stats[s].disableUpgrade();
                    }
                    break;
                case "Reaction":
                    this.stats[s].level = this.gameData.reaction;
                    if (this.gameData.reaction > 10) {
                        this.stats[s].disableUpgrade();
                    }
                    break;
                case "Speed":
                    this.stats[s].level = this.gameData.speed;
                    if (this.gameData.speed > 10) {
                        this.stats[s].disableUpgrade();
                    }
                    break;
                case "Sight":
                    this.stats[s].level = this.gameData.sight;
                    if (this.gameData.sight > 10) {
                        this.stats[s].disableUpgrade();
                    }
                    break;
            }
        }
    }

    onMouseOver(mouseLocation) {
        for (let w = 0; w < this.weapons.length; w++) {
            this.weapons[w].onMouseOver(mouseLocation);
        }

        for (let s = 0; s < this.stats.length; s++) {
            this.stats[s].onMouseOver(mouseLocation);
        }

        for (let b = 0; b < this.buttons.length; b++) {
            this.buttons[b].onMouseOver(mouseLocation);
        }

        this.game.onMouseOver(mouseLocation);
        if (this.refreshEnabled)
        {
            this.matchResults.onMouseOver(mouseLocation);
            this.topPlayers.onMouseOver(mouseLocation);
        } else {
            this.matchResults.isMouseOver = false;
            this.topPlayers.isMouseOver = false;
        }

        this.muteButton.onMouseOver(mouseLocation);
    }

    onMouseClick(mouseLocation) {
        if (!this.waitForResponse) {
            for (let w = 0; w < this.weapons.length; w++) {
                this.weapons[w].onClick(mouseLocation);
            }
    
            for (let s = 0; s < this.stats.length; s++) {
                this.stats[s].onClick(mouseLocation);
            }
        }

        if (!this.game.isMatchPlaying()) {
            for (let b = 0; b < this.buttons.length; b++) {
                this.buttons[b].onClick(mouseLocation);
            }

            if (this.gameData.level > 49) {
                this.ladderCheckBox.onClick(mouseLocation);
            }
        }

        if (this.showGame) {
            this.game.onClick(mouseLocation);
        }
        if (this.refreshEnabled) {
            this.matchResults.onClick(mouseLocation);
            this.topPlayers.onClick(mouseLocation);
        }

        this.muteButton.onClick(mouseLocation);
    }

    onKeyUp(keyCode) {
        if (keyCode == 13 && this.chatEnabled) //enter
        {      
            if (chatbox.style.visibility == "hidden") {
                //first time hitting enter
                if (this.chatTimer === undefined) {
                    this.sendMessage(this.userName + " joined chat!");
                    this.chatTimer = window.setInterval((menu) => {
                        let headers = {};

                        if (this.identityAgent && this.identityAgent.token) {
                            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
                        }

                        headers['Content-Type'] = 'application/json';
                        fetch(BASE_URL + '/api/chat/retrieve?lastText=' + menu.lastText, {
                            method: 'GET',
                            headers: headers
                        })
                        .then(response => response.json())
                        .then(texts => {
                            for (let t = 0; t < texts.length; t++) {
                                menu.addMessage(texts[t]);
                            }
                        })
                        .catch(error => {console.error(error)});
                    }, 5000, this);
                }
                chatbox.style.visibility = "visible";
                chatbox.removeAttribute("disabled");
                chatbox.focus();
            }
            else {
                if (chatbox.value != undefined && chatbox.value != "") {
                    this.sendMessage(this.userName + " : " + chatbox.value);
                }
                chatbox.style.visibility = "hidden";
                chatbox.setAttribute("disabled", "disabled");
                chatbox.value = "";
            }
        }
    }

    draw(ctx) {
        ctx.font = TEXT_FONT;
        if (this.showGame) {
            this.game.draw(ctx);
        } else {
            ctx.drawImage(MENU_BACK_DROP, 0,0);
            ctx.fillStyle = TEXT_COLOR;
            var text = this.userName + " // Cash : " + this.gameData.money + " // Level : " + this.gameData.level + " // Wins : " + this.gameData.wins;
            if (this.gameData.level > 49) {
                text += " // Ladder Wins : " + this.gameData.ladderWins;
            } 
            ctx.fillText(text, 10, 20);
            ctx.fillText("Shop", 70, 50);
            ctx.fillText("Neural Implants", TILESX * TILE_WIDTH - 200, 50);
            for (let w = 0; w < this.weapons.length; w++) {
                this.weapons[w].draw(ctx);
            }
    
            for (let s = 0; s < this.stats.length; s++) {
                this.stats[s].draw(ctx);
            }
    
            for (let b = 0; b < this.buttons.length; b++) {
                this.buttons[b].draw(ctx);
            }

            this.matchResults.draw(ctx);
            this.topPlayers.draw(ctx);

            if (this.gameData.level > 49) {
                this.ladderCheckBox.draw(ctx);
            }
        } 
        
        this.muteButton.draw(ctx);
    }

    onStartMatchClick(menu) {
        let headers = {};

        if (menu.identityAgent && menu.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + menu.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/combatants?isLadder=' + menu.ladderCheckBox.checked, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(players => {
            //first create current player as player 1
            let gamePlayers = [
                new Player(0, menu.userName, PLAYER1_START, menu.gameDataToStats(menu.gameData), menu.gameDataToWeapons(menu.gameData))
            ];
            for (let p = 0; p < 3; p++) {
                gamePlayers.push(new Player(p + 1, players[p].name, PLAYER_STARTS[p + 1], menu.gameDataToStats(players[p].gameData), menu.gameDataToWeapons(players[p].gameData)));
            }
            menu.game.startMatch(gamePlayers);
            menu.showGame = true;
        })
        .catch(error => {console.error(error)});
    }

    onEndMatch(menu) {
        GLOBAL_AUDIO_HANDLER.stopMusic();
        menu.showGame = false;
        //get gun ammo correction responses
        let primaryGunId = menu.game.level.playersArray[0].primaryWeapon;
        let primaryAmmo = 0;
        let secondaryGunId = menu.game.level.playersArray[0].secondaryWeapon;
        let secondaryAmmo = 0;
        if (menu.game.level.playersArray[0].weapons.length > 2) {
            primaryAmmo = menu.game.level.playersArray[0].weapons[0].ammo;
            secondaryAmmo = menu.game.level.playersArray[0].weapons[1].ammo;
        } else if (menu.game.level.playersArray[0].weapons.length > 1) {
            if (menu.game.level.playersArray[0].weapons[0].id == primaryGunId)
                primaryAmmo = menu.game.level.playersArray[0].weapons[0].ammo;
            else
                secondaryAmmo = menu.game.level.playersArray[0].weapons[0].ammo;
        }
        
        let matchResults = [];
        for (let p = 0; p < menu.game.level.playersArray.length; p++) {
            matchResults.push({
                name : menu.game.level.playersArray[p].name,
                kills : menu.game.level.playersArray[p].kills,
                deaths: menu.game.level.playersArray[p].deaths
            });
        }

        let headers = {};

        if (menu.identityAgent && menu.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + menu.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/endmatch?primaryWeapon=' + primaryGunId + '&secondaryWeapon=' + secondaryGunId +'&primaryAmmo=' + primaryAmmo + '&secondaryAmmo=' + secondaryAmmo + '&isLadder=' + menu.ladderCheckBox.checked, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(matchResults)
        })
        .then(response => response.json())
        .then(gameData => {
            menu.update(gameData);
        })
        .catch(error => {console.error(error)});
    }

    gameDataToStats(gameData) {
        return new Stats(gameData.sight, gameData.accuracy, gameData.dodge, gameData.reaction, gameData.speed);
    }

    gameDataToWeapons(gameData) {
        //find primary and secondary gun with ammo
        let availableWeapons = [];
        if (gameData.shotgun && gameData.shotgunAmmo > 0) {
            availableWeapons.push(SHOTGUN.copy(gameData.shotgunAmmo));
        }
        if (gameData.assaultRifle && gameData.assaultRifleAmmo > 0) {
            availableWeapons.push(ASSAULT_RIFLE.copy(gameData.assaultRifleAmmo));
        }
        if (gameData.sniperRifle && gameData.sniperRifleAmmo > 0) {
            availableWeapons.push(SNIPER_RIFLE.copy(gameData.sniperRifleAmmo));
        }
        if (gameData.smg && gameData.smgAmmo > 0) {
            availableWeapons.push(SMG.copy(gameData.smgAmmo));
        }
        if (gameData.throwingKnife && gameData.throwingKnifeAmmo > 0) {
            availableWeapons.push(KNIFE.copy(gameData.throwingKnifeAmmo));
        }
        if (gameData.lightningGun && gameData.lightningGunAmmo > 0) {
            availableWeapons.push(LIGHTNING_GUN.copy(gameData.lightningGunAmmo));
        }
        if (gameData.laserRifle && gameData.laserRifleAmmo > 0) {
            availableWeapons.push(LASER_RIFLE.copy(gameData.laserRifleAmmo));
        }

        if (availableWeapons.length > 2) {
            //get 2 random guns
           let weaponsToUse = availableWeapons.splice(Math.floor(Math.random() * availableWeapons.length), 1);
           weaponsToUse.push(availableWeapons[Math.floor(Math.random() * availableWeapons.length)]);
           weaponsToUse.push(PISTOL.copy(99999));
           return weaponsToUse;
        } else {
            availableWeapons.push(PISTOL.copy(99999));
            return availableWeapons;
        }
    }

    onMatchResultsRefresh(menu) {
        menu.refreshEnabled = false;
        menu.fetchMatchResults();
        window.setTimeout((menu) => {
            menu.refreshEnabled = true;
        }, 3000, menu);
    }

    onTopPlayersRefresh(menu) {
        menu.refreshEnabled = false;
        menu.fetchTopPlayers();
        window.setTimeout((menu) => {
            menu.refreshEnabled = true;
        }, 3000, menu);
    }

    onShotgunBuyClick(menu) {
        menu.fetchGun("shotgun");
    }

    onShotgunAmmoBuyClick(menu) {
        menu.fetchAmmo("shotgun");
    }

    onAssaultRifleBuyClick(menu) {
        menu.fetchGun("assault");
    }

    onAssaultRifleAmmoBuyClick(menu) {
        menu.fetchAmmo("assault");
    }

    onSniperRifleBuyClick(menu) {
        menu.fetchGun("sniper");
    }

    onSniperRifleAmmoBuyClick(menu) {
        menu.fetchAmmo("sniper");
    }

    onSmgBuyClick(menu) {
        menu.fetchGun("smg");
    }

    onSmgAmmoBuyClick(menu) {
        menu.fetchAmmo("smg")
    }

    onThrowingKnifeBuyClick(menu) {
        menu.fetchGun("knife");
    }

    onThrowingKnifeAmmoBuyClick(menu) {
        menu.fetchAmmo("knife")
    }

    onLightningGunBuyClick(menu) {
        menu.fetchGun("lightning");
    }

    onLightningGunAmmoBuyClick(menu) {
        menu.fetchAmmo("lightning")
    }

    onLaserRifleBuyClick(menu) {
        menu.fetchGun("laser");
    }

    onLaserRifleAmmoBuyClick(menu) {
        menu.fetchAmmo("laser")
    }

    onReactionClick(menu) {
        menu.fetchUpgrade("reaction");
    }

    onSightClick(menu) {
        menu.fetchUpgrade("sight");
    }

    onAccuracyClick(menu) {
        menu.fetchUpgrade("accuracy");
    }

    onSpeedClick(menu) {
        menu.fetchUpgrade("speed");
    }

    onDodgeClick(menu) {
        menu.fetchUpgrade("dodge");
    }

    fetchAmmo(gun) {
        this.waitForResponse = true;
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/buyammo?gun='+gun, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(gameData => {
            this.update(gameData);
            this.waitForResponse = false;
        })
        .catch(error => {
            console.error(error);
            this.waitForResponse = false;
        });
    }

    fetchMatchResults() {
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/matches?count=8', {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(matches => {this.matchResults.update(matches)})
        .catch(error => {console.error(error)});
    }

    fetchTopPlayers() {
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/topplayers', {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(matches => {this.topPlayers.update(matches)})
        .catch(error => {console.error(error)});
    }

    fetchGun(gun) {
        this.waitForResponse = true;
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/buygun?gun='+gun, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(gameData => {
            this.update(gameData);
            this.waitForResponse = false;
        })
        .catch(error => {
            console.error(error);
            this.waitForResponse = false;
        });
    }

    fetchUpgrade(skill) {
        this.waitForResponse = true;
        let headers = {};

        if (this.identityAgent && this.identityAgent.token) {
            headers['Authorization'] = 'Bearer ' + this.identityAgent.token;
        }

        headers['Content-Type'] = 'application/json';
        fetch(BASE_URL + '/api/game/buyskill?skill='+skill, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(gameData => {
            this.update(gameData);
            this.waitForResponse = false;
        })
        .catch(error => {
            console.error(error);
            this.waitForResponse = false;
        });
    }
}