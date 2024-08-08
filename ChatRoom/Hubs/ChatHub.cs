using System.Net.WebSockets;
using Microsoft.AspNetCore.SignalR;

namespace ChatRoom.Hubs;

// Deals with all incoming and transmission of messages
public class ChatHub : Hub
{
  private static Dictionary<string, string> clients = new Dictionary<string, string>();
  // Impl such that everone other than the joiner gets the message
  public async Task JoinChat(string user, string message)
  {
    clients[Context.ConnectionId] = user;
    await Clients.Others.SendAsync("ReceiveMessage", user, message);
  }
  // Send notification to all clients
  // if client has to communicate, it will call SendMessage()
  // if client has to receive, it ises ReceiveMessage()
  public async Task SendMessage(string user, string message)
  {
    await Clients.All.SendAsync("ReceiveMessage", user, message);
  }

  private async Task ExitChat()
  {
    if (clients.TryGetValue(Context.ConnectionId, out string user))
    {
      var message = $"{user} has left the chat.";
      await Clients.Others.SendAsync("ReceiveMessage", user, message);
    }
  }

  public override async Task OnDisconnectedAsync(Exception? exception)
  {
    await ExitChat();
    await base.OnDisconnectedAsync(exception);
  }
}