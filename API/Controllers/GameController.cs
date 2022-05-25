using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using API.Persistence;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Runtime;
using System;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _dataContext;

        public GameController(UserManager<AppUser> userManager, DataContext dataContext) 
        {
            _userManager = userManager;
            _dataContext = dataContext;
        }

        [Authorize]
        [HttpGet("combatants")]
        public async Task<ActionResult<CombatantDto[]>> GetCombatants()
        {
            var playerIndices = new List<int>();
            playerIndices.Add(await GetCombatantIndex(playerIndices));
            playerIndices.Add(await GetCombatantIndex(playerIndices));
            playerIndices.Add(await GetCombatantIndex(playerIndices));
            var playerDatas = new AppUser[] {
                _userManager.Users.Include(u => u.GameData).Skip(playerIndices[0]).Take(1).First(),
                _userManager.Users.Include(u => u.GameData).Skip(playerIndices[1]).Take(1).First(),
                _userManager.Users.Include(u => u.GameData).Skip(playerIndices[2]).Take(1).First()
            };
            var returnValue = new CombatantDto[] {
                new CombatantDto() 
                {
                    Name = playerDatas[0].UserName,
                    GameData = playerDatas[0].GameData
                },
                new CombatantDto() 
                {
                    Name = playerDatas[1].UserName,
                    GameData = playerDatas[1].GameData
                },
                new CombatantDto() 
                {
                    Name = playerDatas[2].UserName,
                    GameData = playerDatas[2].GameData
                }
            };

            return Ok(returnValue);
        }

        private async Task<int> GetCombatantIndex(List<int> playerIndices) 
        {
            var rand = new Random();
            var userCount = _userManager.Users.Count();
            var index = (int)Math.Floor(rand.NextDouble() * userCount);
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            var isItself = _dataContext.Users.Skip(index).Take(1).First().UserName == user.UserName;
            if (playerIndices.Contains(index) || isItself)
                return await GetCombatantIndex(playerIndices);
            else
                return index;
        }

        [Authorize]
        [HttpPost("endmatch")]
        public async Task<ActionResult<GameData>> EndMatch([FromBody]MatchResultDto[] results, [FromQuery]string primaryWeapon, [FromQuery]string secondaryWeapon, [FromQuery]int primaryAmmo, [FromQuery]int secondaryAmmo)
        {
            var currentUser = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Id == _userManager.GetUserId(User));
            currentUser.GameData.Level += 1;
            //Update used ammo.
            UpdateAmmoCount(currentUser, primaryWeapon, primaryAmmo);
            UpdateAmmoCount(currentUser, secondaryWeapon, secondaryAmmo);

            //Update gold counts.
            //Find winner.
            var winningKillCount = results.Max(result => result.Kills);
            var winner = results.First(result => result.Kills == winningKillCount);
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.UserName == winner.Name);
            user.GameData.Money += 20;
            user.GameData.Wins += 1;

            for(var i = 0; i < results.Length; i++)
            {
                if (results[i] != winner)
                {
                    user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.UserName == results[i].Name);
                    user.GameData.Money += 10;
                }
            }

            var matchResults = results.Select((result) => new MatchResult() {
                Id = Guid.NewGuid(),
                Name = result.Name,
                Kills = result.Kills,
                Deaths = result.Deaths
            });
            await _dataContext.Matches.AddAsync(new Match() {
                Player1Result = matchResults.ElementAt(0),
                Player2Result = matchResults.ElementAt(1),
                Player3Result = matchResults.ElementAt(2),
                Player4Result = matchResults.ElementAt(3),
            });

            RemoveExtraMatchResults();

            await _dataContext.SaveChangesAsync();
            return Ok(currentUser.GameData);
        }

        private void RemoveExtraMatchResults() {
            if (_dataContext.Matches.Count() > 20) {
                var removeOne = _dataContext.Matches.Include(match => match.Player1Result)
                .Include(match => match.Player2Result)
                .Include(match => match.Player3Result)
                .Include(match => match.Player4Result)
                .Skip(0).Take(1).First();
                _dataContext.Matches.Remove(removeOne);
                _dataContext.MatchResult.Remove(removeOne.Player1Result);
                _dataContext.MatchResult.Remove(removeOne.Player2Result);
                _dataContext.MatchResult.Remove(removeOne.Player3Result);
                _dataContext.MatchResult.Remove(removeOne.Player4Result);
            }
        }

        private void UpdateAmmoCount(AppUser user, string gun, int ammo)
        {
            switch(gun)
            {
                case "assault":
                    if (user.GameData.AssaultRifle)
                    {
                        user.GameData.AssaultRifleAmmo = ammo;
                    }    
                break;
                case "sniper":
                    if (user.GameData.SniperRifle)
                    {
                        user.GameData.SniperRifleAmmo = ammo;
                    }    
                break;
                case "shotgun":
                    if (user.GameData.Shotgun)
                    {
                        user.GameData.ShotgunAmmo = ammo;
                    }    
                break;
                case "smg":
                    if (user.GameData.Smg)
                    {
                        user.GameData.SmgAmmo = ammo;
                    }    
                break;
                case "knife":
                    if (user.GameData.ThrowingKnife)
                    {
                        user.GameData.ThrowingKnifeAmmo = ammo;
                    }    
                break;
                case "lightning":
                    if (user.GameData.LightningGun)
                    {
                        user.GameData.LightningGunAmmo = ammo;
                    }    
                break;
            }
        }

        [Authorize]
        [HttpGet("matches")]
        public ActionResult<Match[]> Matches(int count)
        {
            var matchResultCount = _dataContext.Matches.Count();
            if (matchResultCount > 0) {
                var returnCount = count > matchResultCount ? matchResultCount : count;
                var results = _dataContext.Matches.Include(match => match.Player1Result)
                .Include(match => match.Player2Result)
                .Include(match => match.Player3Result)
                .Include(match => match.Player4Result)
                .Skip(matchResultCount - returnCount - 1).Take(returnCount).ToList();
                return Ok(results.ToArray());
            } else {
                return Ok(new Match[0]);
            }
            
        }

        [Authorize]
        [HttpGet("topplayers")]
        public ActionResult<TopPlayerDto[]> TopPlayers()
        {
            var topPlayers = _dataContext.Users.Include(user => user.GameData).OrderByDescending(user => user.GameData.Wins).Take(5);
            var result = topPlayers.Select((user) => new TopPlayerDto() {
                Name = user.UserName,
                Wins = user.GameData.Wins
            });
            return Ok(result);
        }

        [Authorize]
        [HttpGet("buyskill")]
        public async Task<ActionResult<GameData>> BuySkill(string skill)
        {
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Id == _userManager.GetUserId(User));
            var currentLevel = user.GameData.Accuracy + user.GameData.Sight + user.GameData.Speed + user.GameData.Dodge + user.GameData.Reaction;
            if (user.GameData.Level > currentLevel) {
                switch(skill)
                {
                    case "accuracy":
                        if (user.GameData.Accuracy < 12)
                        {
                            user.GameData.Accuracy += 1;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "sight":
                        if (user.GameData.Sight < 12)
                        {
                            user.GameData.Sight += 1;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "speed":
                        if (user.GameData.Speed < 12)
                        {
                            user.GameData.Speed += 1;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "dodge":
                        if (user.GameData.Dodge < 12)
                        {
                            user.GameData.Dodge += 1;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "reaction":
                        if (user.GameData.Reaction < 12)
                        {
                            user.GameData.Reaction += 1;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                }
            } else {
                return BadRequest("No skill points available.");
            }

            return BadRequest("Incorrect skill or skill already maxed.");
        }

        [Authorize]
        [HttpGet("buygun")]
        public async Task<ActionResult<GameData>> BuyGun(string gun)
        {
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Id == _userManager.GetUserId(User));
            if (user.GameData.Money >= 50) {
                switch(gun) 
                {
                    case "assault":
                        if (!user.GameData.AssaultRifle)
                        {
                            user.GameData.AssaultRifle = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "sniper":
                        if (!user.GameData.SniperRifle)
                        {
                            user.GameData.SniperRifle = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "shotgun":
                        if (!user.GameData.Shotgun)
                        {
                            user.GameData.Shotgun = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "smg":
                        if (!user.GameData.Smg)
                        {
                            user.GameData.Smg = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "knife":
                        if (!user.GameData.ThrowingKnife)
                        {
                            user.GameData.ThrowingKnife = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                    case "lightning":
                        if (!user.GameData.LightningGun)
                        {
                            user.GameData.LightningGun = true;
                            user.GameData.Money -= 50;
                            await _dataContext.SaveChangesAsync();
                            return Ok(user.GameData);
                        }    
                    break;
                }
            } else {
                return BadRequest("Insufficient money.");
            }

            return BadRequest("Already have gun.");
        }

        [Authorize]
        [HttpGet("buyammo")]
        public async Task<ActionResult<GameData>> BuyAmmo(string gun)
        {
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Id == _userManager.GetUserId(User));
            if (user.GameData.Money >= 10) {
                switch(gun) 
                {
                    case "assault":
                        user.GameData.AssaultRifleAmmo += 50;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData);  
                    case "sniper":
                        user.GameData.SniperRifleAmmo += 10;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData);    
                    case "shotgun":
                        user.GameData.ShotgunAmmo += 20;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData);  
                    case "smg":
                        user.GameData.SmgAmmo += 70;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData);  
                    case "knife":
                        user.GameData.ThrowingKnifeAmmo += 5;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData);    
                    case "lightning":
                        user.GameData.LightningGunAmmo += 100;
                        user.GameData.Money -= 10;
                        await _dataContext.SaveChangesAsync();
                        return Ok(user.GameData); 
                }
            } else {
                return BadRequest("Insufficient money.");
            }

            return BadRequest("Incorrect gun.");
        }
    }
}