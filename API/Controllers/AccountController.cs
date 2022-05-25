using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using API.Persistence;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly DataContext _dataContext;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService, DataContext dataContext)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _dataContext = dataContext;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return new UserDto
                {
                    GameData = user.GameData,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName
                };
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                ModelState.AddModelError("error", "Email Taken");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.Username))
            {
                ModelState.AddModelError("error", "Username Taken");
                return ValidationProblem();
            }
            if (registerDto.Password.Length < 6)
            {
                ModelState.AddModelError("error", "Password Too Short");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Username,
                GameData = new GameData() 
                {
                    Id = Guid.NewGuid(),
                    Level = 15,
                    Sight = 3,
                    Accuracy = 3,
                    Dodge = 3,
                    Reaction = 3,
                    Speed = 3
                }
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user.");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            var user = await _dataContext.Users.Include(user => user.GameData).FirstOrDefaultAsync(user => user.Id == _userManager.GetUserId(User));
            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                GameData = user.GameData,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }
    }
}