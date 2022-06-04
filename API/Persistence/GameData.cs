namespace API.Persistence
{
    public class GameData
    {
        public Guid Id {get;set;}
        public int Level {get;set;}
        public int Money {get;set;}
        public double Sight {get;set;}
        public double Accuracy {get;set;}
        public double Dodge {get;set;}
        public double Reaction {get;set;}
        public double Speed {get;set;}
        public bool Shotgun {get;set;}
        public int ShotgunAmmo {get;set;}
        public bool AssaultRifle {get;set;}
        public int AssaultRifleAmmo {get;set;}
        public bool ThrowingKnife {get;set;}
        public int ThrowingKnifeAmmo {get;set;}
        public bool SniperRifle {get;set;}
        public int SniperRifleAmmo {get;set;}
        public bool LaserRifle {get;set;}
        public int LaserRifleAmmo {get;set;}

        public bool Smg {get;set;}
        public int SmgAmmo {get;set;}
        public bool LightningGun {get;set;}
        public int LightningGunAmmo {get;set;}

        public int Wins {get;set;}        
    }
}