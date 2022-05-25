class ImageCheckbox
{
    constructor(imageLocation, checkedLocation, location, size) {
        this.location = location;
        this.size = size;
        this.imageLocation = imageLocation;
        this.checkedLocation = checkedLocation;
        this.bottomRightLocation = new Vector2D(this.location.x + this.size.x, this.location.y + this.size.y);
        this.enabled = false;
        this.checked = false;
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

    Draw(ctx) {
        if (this.enabled) {
            if (!this.checked) {
                ctx.drawImage(MENU_SPRITE_SHEET, this.imageLocation.x, this.imageLocation.y, this.size.x, this.size.y, this.location.x, this.location.y, this.size.x, this.size.y);
            } else {
                ctx.drawImage(MENU_SPRITE_SHEET, this.checkedLocation.x, this.checkedLocation.y, this.size.x, this.size.y, this.location.x, this.location.y, this.size.x, this.size.y);
            }
        }
    }

    onClick(mouseLocation) {
        if (this.enabled && isInsideBox(mouseLocation, this.location, this.bottomRightLocation)) {
            this.onCheck();
        }
    }
}