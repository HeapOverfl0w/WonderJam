class Stat {
    constructor(location, name, level, menu, onClickCallback) {
        this.location = location;
        this.menu = menu;
        this.name = name;
        this.level = level;
        this.upgradeButton = new Button(new Vector2D(0,0), new Vector2D(16,0), this.location, new Vector2D(16,16), this.menu, onClickCallback);
        this.disableUpgrade();
    }

    onMouseOver(mouseLocation) {
        this.upgradeButton.onMouseOver(mouseLocation);
    }

    onClick(mouseLocation) {
        if (this.level < 11 && this.enabled) {
            this.upgradeButton.onClick(mouseLocation);
        }
    }

    enableUpgrade() {
        this.enabled = true;
    }

    disableUpgrade() {
        this.enabled = false;
    }

    draw(ctx) {
        ctx.fillStyle = TEXT_COLOR;
        var maxText = this.level > 10 ? "  MAX" : "";
        ctx.fillText(this.name + " : " + this.level + maxText, this.location.x + 20, this.location.y + 10);
        if (this.enabled) {
            this.upgradeButton.draw(ctx);
        }
    }
}