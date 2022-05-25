using Microsoft.AspNetCore.Identity;

namespace API.Persistence
{
    public class AppUser : IdentityUser
    {
        public GameData GameData { get; set; }
    }
}