class Projectile {
    constructor(imageLocation, damage, speed, angle, location) {
        this.imageLocation = imageLocation;
        this.damage = damage;
        this.vector = new Vector2D(Math.cos(angle) * speed, Math.sin(angle) * speed);
        this.location = location;
        this.angle = angle;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(Math.floor(this.location.x + HALF_TILE_WIDTH), Math.floor(this.location.y + HALF_TILE_HEIGHT));
        ctx.rotate(this.angle);
        ctx.drawImage(PROJECTILE_SPRITE_SHEET, this.imageLocation.x, this.imageLocation.y, TILE_WIDTH, TILE_HEIGHT,
            -HALF_TILE_WIDTH, -HALF_TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        ctx.restore();
    }

    update() {
        this.location.x += this.vector.x;
        this.location.y += this.vector.y;
    }

    copy(angle, startLocation, player) {
        let projectile = new Projectile(this.imageLocation, this.damage, this.speed, angle, startLocation);
        projectile.owner = player;
        return projectile;
    }
}