class WeaponMenu {
    constructor(location, name, ammo, menu, onAmmoBuyClick, onGunBuy) {
        this.location = location;
        this.menu = menu;
        this.textLocation = new Vector2D(location.x + 40, location.y + 10);
        this.name = name;
        this.ammo = ammo;
        this.buyButtonLocation = this.location.copy();
        this.buyButtonLocation.x -= 8;
        this.buyButton = new Button(new Vector2D(0,16), new Vector2D(48,16), this.buyButtonLocation, new Vector2D(48,16), this.menu, onGunBuy)
        this.buyAmmoButton = new Button(new Vector2D(64,0), new Vector2D(80,0), this.location, new Vector2D(16,16), this.menu, onAmmoBuyClick);
        this.disableAmmoBuy();
        this.disableBuy();
    }

    onMouseOver(mouseLocation) {
        if (this.enabledBuy) {
            this.buyButton.onMouseOver(mouseLocation);
        }
        if (this.enabledAmmoBuy) {
            this.buyAmmoButton.onMouseOver(mouseLocation);
        }
    }

    onClick(mouseLocation) {
        if (this.enabledBuy) {
            this.buyButton.onClick(mouseLocation);
        }
        if (this.enabledAmmoBuy) {
            this.buyAmmoButton.onClick(mouseLocation);
        }
    }

    enableAmmoBuy() {
        this.enabledAmmoBuy = true;
        this.enabledBuy = false;
    }

    disableAmmoBuy() {
        this.enabledAmmoBuy = false;
    }

    enableBuy() {
        this.enabledBuy = true;
    }

    disableBuy() {
        this.enabledBuy = false;
    }

    draw(ctx) {
        if (this.enabledBuy) {
            this.buyButton.draw(ctx);
        }
        if (!this.enabledBuy && this.enabledAmmoBuy) {
            this.buyAmmoButton.draw(ctx);
        } 
        
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.name + ' : ' + this.ammo, this.textLocation.x, this.textLocation.y);
    }
}