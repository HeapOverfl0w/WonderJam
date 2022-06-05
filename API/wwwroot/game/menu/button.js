class Button {
    constructor(imageLocation, mouseOverLocation, location, size, menu, onClickCallback) {
        this.imageLocation = imageLocation;
        this.mouseOverLocation = mouseOverLocation;
        this.menu = menu;
        this.location = location;
        this.size = size;
        this.bottomRightLocation = new Vector2D(this.location.x + this.size.x, this.location.y + this.size.y);
        this.isMouseOver = false;
        this.onClickCallback = onClickCallback;
    }

    onMouseOver(mouseLocation) {
        if (isInsideBox(mouseLocation, this.location, this.bottomRightLocation)) {
            this.isMouseOver = true;
        } else {
            this.isMouseOver = false;
        }
    }

    onClick(mouseLocation) {
        if (isInsideBox(mouseLocation, this.location, this.bottomRightLocation)) {
            this.onClickCallback(this.menu);
        }
    }

    draw(ctx) {
        if (this.isMouseOver) {
            ctx.drawImage(MENU_SPRITE_SHEET, this.mouseOverLocation.x, this.mouseOverLocation.y, this.size.x, this.size.y,
                this.location.x, this.location.y, this.size.x, this.size.y);
        } else {
            ctx.drawImage(MENU_SPRITE_SHEET, this.imageLocation.x, this.imageLocation.y, this.size.x, this.size.y,
                this.location.x, this.location.y, this.size.x, this.size.y);
        }
    }
}