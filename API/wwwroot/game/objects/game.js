class Game {
    constructor(onGameOverClick, menu) {
        this.onGameOverClick = onGameOverClick;
        this.gameOverButton = new Button(new Vector2D(240, 0), new Vector2D(240, 32), new Vector2D(TILESX * TILE_WIDTH / 2 - 32, TILESY * TILE_HEIGHT / 2 + 46), new Vector2D(112, 32), menu, this.onGameOverClick);
    }

    startMatch(players) {
        GLOBAL_AUDIO_HANDLER.playAndLoopMusic();
        let levelNumber = Math.floor(Math.random() * 5)
        if (levelNumber === 1)
            this.level = new Level(LEVEL2_IMAGE,new Vector2D(16,0), createLevel2Collisions(), players);
        else if (levelNumber === 2)
            this.level = new Level(LEVEL3_IMAGE,new Vector2D(32,0), createLevel3Collisions(), players);
        else if (levelNumber === 3)
            this.level = new Level(LEVEL4_IMAGE,new Vector2D(48,0), createLevel4Collisions(), players);
        else if (levelNumber === 4)
            this.level = new Level(LEVEL5_IMAGE,new Vector2D(64,0), createLevel5Collisions(), players);
        else
            this.level = new Level(LEVEL1_IMAGE,new Vector2D(0,0), createLevel1Collisions(), players);
    }

    isMatchPlaying() {
        return this.level !== undefined && !this.level.matchOver;
    }

    draw(ctx) {
        this.level.draw(ctx);
        this.level.update();

        if (this.level.matchOver) {
            this.gameOverButton.draw(ctx);
        }
        GLOBAL_AUDIO_HANDLER.update();
    }

    onMouseOver(mouseLocation) {
        if (this.level !== undefined && this.level.matchOver) {
            this.gameOverButton.onMouseOver(mouseLocation);
        }
    }

    onClick(mouseLocation) {
        if (this.level !== undefined && this.level.matchOver) {
            this.gameOverButton.onClick(mouseLocation);
        }
    }
}