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
    public class ChatController : ControllerBase
    {
        private ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [Authorize]
        [HttpGet("send")]
        public ActionResult SendMessage([FromQuery]string text)
        {
            _chatService.AddMessage(text);
            return Ok();
        }

        [Authorize]
        [HttpGet("retrieve")]
        public ActionResult<string[]> RetrieveMessages([FromQuery]string lastText)
        {
            return Ok(_chatService.GetMessages(lastText).ToArray());
        }
    }
}