using System.IdentityModel.Tokens.Jwt;
using doar_chat.Models.Errors;
using doar_chat.Services;
using Microsoft.AspNetCore.SignalR;

namespace doar_chat.Hubs
{
    public class ChatHub(IUserConnectionStore connections) : Hub
    {
        private readonly IUserConnectionStore _connections = connections;

        public override Task OnConnectedAsync()
        {
            var userId = GetCurrentUserId();
            _connections.SetConnection(userId, Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetCurrentUserId();
            _connections.RemoveConnection(userId, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        private int GetCurrentUserId()
        {
            var raw = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? Context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (!int.TryParse(raw, out var userId))
            {
                throw new ApiException(StatusCodes.Status401Unauthorized, "Invalid token.");
            }

            return userId;
        }
    }
}
