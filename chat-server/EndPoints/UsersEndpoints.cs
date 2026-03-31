using System.IdentityModel.Tokens.Jwt;
using doar_chat.Logic;
using doar_chat.Models.Errors;

namespace doar_chat.EndPoints
{
    public static class UsersEndpoints
    {
        public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/users");

            group.MapGet("/", async (UsersLogic logic) =>
            {
                var users = await logic.GetAllAsync();
                return Results.Ok(users);
            });

            group.MapDelete("/{id:int}", async (int id, HttpContext context, UsersLogic logic) =>
            {
                var currentUserId = GetCurrentUserId(context);
                if (currentUserId != id)
                {
                    throw new ApiException(StatusCodes.Status403Forbidden, "Users can only delete their own account.");
                }

                await logic.DeleteAsync(id);
                return Results.NoContent();
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
