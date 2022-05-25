class Score {
    constructor(player, location, playerNumber) {
        this.player = player;
        this.playerNumber = playerNumber;
        this.color = getPlayerColor(this.player.playerNumber);
        this.location = location;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.location.x, this.location.y, TILE_WIDTH, TILE_HEIGHT);
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.player.name + " : " + this.player.kills + " / " + this.player.deaths, this.location.x + 20, this.location.y + 12);
    }
}

class Match {
    constructor(players, location) {
        this.players = players;
        this.location = location;

        this.scores = [];
        for(let p = 0; p < players.length; p++) {
            this.scores.push(new Score(this.players[p], new Vector2D(this.location.x, this.location.y + p * 18), p));          
        }
    }

    updateLocation(newLocation) {
        this.location = newLocation;
        for(let s = 0; s < this.scores.length; s++) {
            this.scores[s].location = new Vector2D(this.location.x, this.location.y + s * 18);          
        }
    }

    draw(ctx) {
        for (let s = 0; s < this.scores.length; s++) {
            this.scores[s].draw(ctx);
        }
    }
}

class MatchResults {
    constructor(location, menu, onClickCallback) {
        this.location = location;
        var buttonLocation = this.location.copy();
        buttonLocation.x += 80;
        this.refreshButton = new Button(new Vector2D(32, 0), new Vector2D(48, 0), buttonLocation, new Vector2D(16,16), menu, onClickCallback);
    }

    onMouseOver(mouseLocation) {
        if (this.matches !== undefined) {
            this.refreshButton.onMouseOver(mouseLocation);
        }
    }

    onClick(mouseLocation) {
        if (this.matches !== undefined) {
            this.refreshButton.onClick(mouseLocation);
        }
    }

    update(matches) {
        this.matches = [];
        for (let m = 0; m < matches.length; m++) {
            matches[m].player1Result.playerNumber = 0;
            matches[m].player2Result.playerNumber = 1;
            matches[m].player3Result.playerNumber = 2;
            matches[m].player4Result.playerNumber = 3;
            this.matches.push(new Match([matches[m].player1Result, matches[m].player2Result, matches[m].player3Result, matches[m].player4Result], 
                new Vector2D(this.location.x + (158 * Math.floor(m/2)) + 20,  (m % 2) * 80 + this.location.y + 22)));
        }
    }

    draw(ctx) {
        if (this.matches !== undefined) {
            ctx.fillStyle = TEXT_COLOR;
            ctx.fillText("Recent Matches", this.location.x, this.location.y + 10);
            for (let m = 0; m < this.matches.length; m++) {
                this.matches[m].draw(ctx);
            }

            this.refreshButton.draw(ctx);
        }
    }
}

class TopPlayers {
    constructor(location, menu, onClickCallback) {
        this.location = location;
        var buttonLocation = this.location.copy();
        buttonLocation.y -= 20;
        buttonLocation.x += 100;
        this.refreshButton = new Button(new Vector2D(32, 0), new Vector2D(48, 0), buttonLocation, new Vector2D(16,16), menu, onClickCallback);
    }

    onMouseOver(mouseLocation) {
        if (this.topPlayers !== undefined) {
            this.refreshButton.onMouseOver(mouseLocation);
        }
    }

    onClick(mouseLocation) {
        if (this.topPlayers !== undefined) {
            this.refreshButton.onClick(mouseLocation);
        }
    }

    update(topPlayers) {
        this.topPlayers = topPlayers
    }

    draw(ctx) {
        if (this.topPlayers !== undefined) {
            ctx.fillStyle = TEXT_COLOR;
            for (let p = 0; p < this.topPlayers.length; p++) {
                ctx.fillText(this.topPlayers[p].name + " : " + this.topPlayers[p].wins, this.location.x, this.location.y + p * 20 + 10);
            }

            this.refreshButton.draw(ctx);
        }        
    }
}