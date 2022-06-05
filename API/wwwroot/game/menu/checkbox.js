class ImageCheckbox
{
    constructor(imageLocation, checkedLocation, location, size, text) {
        this.location = location;
        this.size = size;
        this.imageLocation = imageLocation;
        this.checkedLocation = checkedLocation;
        this.bottomRightLocation = new Vector2D(this.location.x + this.size.x, this.location.y + this.size.y);
        this.enabled = true;
        this.checked = false;
        this.text = text;
    }

    setupLinks(othercheckboxes) {
        this.othercheckboxes = othercheckboxes;
    }

    onCheck() {
        if (this.othercheckboxes != undefined)
            this.checked = true;
        else
            this.checked = !this.checked;
        if (this.othercheckboxes != undefined && this.checked)
        {
            for (let i = 0; i < this.othercheckboxes.length; i++)
            {
                if (this.othercheckboxes[i] != this)
                    this.othercheckboxes[i].checked = false;
            }
        }
    }

    draw(ctx) {
        if (this.enabled) {
            if (!this.checked) {
                ctx.drawImage(MENU_SPRITE_SHEET, this.imageLocation.x, this.imageLocation.y, this.size.x, this.size.y, this.location.x, this.location.y, this.size.x, this.size.y);
            } else {
                ctx.drawImage(MENU_SPRITE_SHEET, this.checkedLocation.x, this.checkedLocation.y, this.size.x, this.size.y, this.location.x, this.location.y, this.size.x, this.size.y);
            }
        }
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.text, this.location.x + this.size.x + 4, this.location.y + 10);
    }

    onClick(mouseLocation) {
        if (this.enabled && isInsideBox(mouseLocation, this.location, this.bottomRightLocation)) {
            this.onCheck();
        }
    }
}