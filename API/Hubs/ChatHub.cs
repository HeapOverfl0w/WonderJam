using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
  public class ChatHub : Hub
  {
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
  }
}