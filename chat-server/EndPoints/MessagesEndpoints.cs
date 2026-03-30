using System.IdentityModel.Tokens.Jwt;
using doar_chat.Contracts.Messages;
using doar_chat.Logic;
using doar_chat.Models.Errors;

namespace doar_chat.EndPoints
{
    public static class MessagesEndpoints
    {
        public static IEndpointRouteBuilder MapMessagesEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/messages");

            // Get Conversation with another user
            group.MapGet("/with/{userId:int}", async (int userId, HttpContext context, MessagesLogic logic) =>
            {
                var currentUserId = GetCurrentUserId(context);
                var messages = await logic.GetConversationAsync(currentUserId, userId);
                return Results.Ok(messages);
            });

            // Send Message to another user
            group.MapPost("/", async (SendMessageRequest request, HttpContext context, MessagesLogic logic) =>
            {
                var currentUserId = GetCurrentUserId(context);
                var message = await logic.SendAsync(currentUserId, request.ReceiverUserId, request.Content);
                return Results.Created($"/messages/{message.Id}", message);
            });

            // Mark Message as Read
            group.MapPost("/{messageId:int}/read", async (int messageId, HttpContext context, MessagesLogic logic) =>
            {
                var currentUserId = GetCurrentUserId(context);
                var message = await logic.MarkAsReadAsync(messageId, currentUserId);
                return Results.Ok(message);
            });

            return app;
        }

        private static int GetCurrentUserId(HttpContext context)
        {
            var raw = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? context.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!int.TryParse(raw, out var userId))
            {
                throw new ApiException(StatusCodes.Status401Unauthorized, "Invalid token.");
            }

            return userId;
        }
    }
}
