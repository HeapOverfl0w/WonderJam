using API.Persistence;

namespace API.DTOs
{
    public class UserDto
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public GameData GameData { get; set; }
    }
}