using doar_chat.Logic;
using doar_chat.Contracts.Auth;

namespace doar_chat.EndPoints
{
    public static class AuthEndpoints
    {
        public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/auth");

            group.MapPost("/register", async (RegisterRequest request, AuthLogic logic) =>
            {
                var user = await logic.RegisterAsync(
                    request.Username,
                    request.Password,
                    request.Name);

                return Results.Created(
                    "/auth/register",
                    new { id = user.Id, email = user.Email, name = user.Name });
            });

            group.MapPost("/login", async (LoginRequest request, AuthLogic logic) =>
            {
                var token = await logic.LoginAsync(request.Username, request.Password);
                return Results.Ok(new { token });
            });

            return app;
        }
    }
}
