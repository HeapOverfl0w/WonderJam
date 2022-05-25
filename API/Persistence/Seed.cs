using Microsoft.AspNetCore.Identity;
using API.DTOs;

namespace API.Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                GameData bot1GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 15,
                    Sight = 3,
                    Accuracy = 3,
                    Dodge = 3,
                    Reaction = 3,
                    Speed = 3
                };
                GameData bot2GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 18,
                    Sight = 4,
                    Accuracy = 4,
                    Dodge = 3,
                    Reaction = 3,
                    Speed = 4
                };
                GameData bot3GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 19,
                    Sight = 5,
                    Accuracy = 3,
                    Dodge = 3,
                    Reaction = 5,
                    Speed = 3
                };
                GameData bot4GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 19,
                    Sight = 5,
                    Accuracy = 3,
                    Dodge = 3,
                    Reaction = 5,
                    Speed = 3,
                    Money = 1000
                };
                GameData bot5GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 15,
                    Sight = 3,
                    Accuracy = 3,
                    Dodge = 3,
                    Reaction = 3,
                    Speed = 3
                };
                var users = new List<AppUser>
                {
                    new AppUser{UserName = "Bot1", Email = "bob@test.com", GameData = bot1GameData},
                    new AppUser{UserName = "Bot2", Email = "tom@test.com", GameData = bot2GameData},
                    new AppUser{UserName = "Bot3", Email = "jane@test.com", GameData = bot3GameData},
                    new AppUser{UserName = "Bot4", Email = "james@test.com", GameData = bot4GameData},
                    new AppUser{UserName = "Bot5", Email = "jeff@test.com", GameData = bot5GameData}
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "password");
                }
            }

            await context.SaveChangesAsync();
        }
    }
}