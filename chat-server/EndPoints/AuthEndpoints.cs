using doar_chat.Logic;
using doar_chat.Contracts.Auth;

namespace doar_chat.EndPoints
{
    public static class AuthEndpoints
    {
        public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/auth");
            group.AllowAnonymous();

            group.MapPost("/register", async (RegisterRequest request, AuthLogic logic) =>
            {
                await logic.RegisterAsync(
                    request.Email,
                    request.Password,
                    request.Name);

                var token = await logic.LoginAsync(request.Email, request.Password);

                return Results.Created(
                    "/auth/register",
                    new { token });
            });

            group.MapPost("/login", async (LoginRequest request, AuthLogic logic) =>
            {
                var token = await logic.LoginAsync(request.Email, request.Password);
                return Results.Ok(new { token });
            });

            return app;
        }
    }
}
