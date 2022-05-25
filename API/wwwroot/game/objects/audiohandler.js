class AudioHandler {
    constructor() {
        const volume = 0.2;
        const musicVolume = 0.3;
        this.eonmmusic = document.getElementById("eonmusic");
        this.eonmmusic.volume = musicVolume;
        this.darkmusic = document.getElementById("darkmusic");
        this.darkmusic.volume = musicVolume;

        this.musicList = [this.eonmmusic, this.darkmusic];
        this.currentSong = 0;

        this.death = document.getElementById("death");
        this.death.volume = volume;
        this.reload = document.getElementById("reload");
        this.reload.volume = volume;
        this.shot = document.getElementById("shot");
        this.shot.volume = volume;
        this.shotgunfire = document.getElementById("shotgunfire");
        this.shotgunfire.volume = volume;
        this.buzz = document.getElementById("buzz");
        this.buzz.volume = volume;
        this.throw = document.getElementById("throw");
        this.throw.volume = volume;
    }

    toggleMute() {
        document.querySelectorAll("audio").forEach( (elem) => 
        {
            elem.muted = !elem.muted; 
        });
    }

    update() {
        if (this.musicList[this.currentSong].ended) {
            this.playAndLoopMusic();
        }
    }

    playAndLoopMusic() {
        this.currentSong++;
        if (this.currentSong >= this.musicList.length)
            this.currentSong = 0;

        this.musicList[this.currentSong].currentTime = 0;
        this.musicList[this.currentSong].play();
    }

    stopMusic() {
        this.musicList[this.currentSong].pause();
        this.musicList[this.currentSong].currentTime = 0;
    }

    playWeaponAttack(weaponName) {
        switch (weaponName) {
            case "shotgun":
                this.playShotgunFire();
                break;
            case "lightning":
                this.playBuzz();
                break;
            case "knife":
                this.playThrow();
                break;
            default:
                this.playShot();
        }
    }

    playDeath() {
        this.death.currentTime = 0;
        this.death.play();
    }

    playReload() {
        this.reload.currentTime = 0;
        this.reload.play();
    }

    playShot() {
        this.shot.currentTime = 0;
        this.shot.play();
    }

    playShotgunFire() {
        this.shotgunfire.currentTime = 0;
        this.shotgunfire.play();
    }

    playBuzz() {
        this.buzz.currentTime = 0;
        this.buzz.play();
    }

    playThrow() {
        this.throw.currentTime = 0;
        this.throw.play();
    }

    playAudio(src) {
        let audioCopy = new Audio();
        audioCopy.src = src;
        audioCopy.play();
    }
  
}