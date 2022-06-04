class Weapon {
    constructor(id, imageLocation, imageSize, projectile, fireRate, reloadRate, magazineSize) {
        this.id = id;
        this.projectile = projectile;
        this.fireRate = fireRate;
        this.ableToShoot = true;
        this.magazineSize = magazineSize;
        this.reloadRate = reloadRate;
        this.imageLocation = imageLocation;
        this.imageSize = imageSize;
        this.imageRenderSize = imageSize.x > 16 ? new Vector2D(this.imageSize.x - 6, this.imageSize.y - 6) : this.imageSize;
        this.isReloading = false;
    }

    shoot(angle, player) {
        if (this.isReloading) {
            return undefined;
        }
        if (this.currentMagazine < 1) {
            GLOBAL_AUDIO_HANDLER.playReload();
            this.reload();
            return undefined;
        }

        if (this.ableToShoot && this.ammo > 0 && this.currentMagazine > 0) {
            window.setTimeout((weapon) => {
                weapon.ableToShoot = true;
            }, this.fireRate, this);
            this.ammo -= 1;
            this.currentMagazine -= 1;
            this.ableToShoot = false;
            let bulletLocation = player.location.copy();
            bulletLocation.x += HALF_TILE_WIDTH;
            bulletLocation.y += HALF_TILE_HEIGHT;
            let shotBullet = this.projectile.copy(angle, bulletLocation, player);
            shotBullet.update();
            GLOBAL_AUDIO_HANDLER.playWeaponAttack(this.id);
            return shotBullet;
        } else {
            return undefined;
        }
    }

    reload() {
        this.isReloading = true;
        window.setTimeout((weapon) => {
            weapon.currentMagazine = weapon.magazineSize > weapon.ammo ? weapon.ammo : weapon.magazineSize;
            weapon.isReloading = false;
        }, this.reloadRate, this);
    }

    deathReload() {
        this.isReloading = true;
        window.setTimeout((weapon) => {
            weapon.currentMagazine = weapon.magazineSize > weapon.ammo ? weapon.ammo : weapon.magazineSize;
            weapon.isReloading = false;
        }, 1000, this);
    }

    copy(ammo) {
        let weapon = new Weapon(this.id, this.imageLocation, this.imageSize, this.projectile, this.fireRate, this.reloadRate, this.magazineSize);
        weapon.ammo = ammo;
        weapon.currentMagazine = this.magazineSize > this.ammo ? this.ammo : this.magazineSize;
        return weapon;
    }
}