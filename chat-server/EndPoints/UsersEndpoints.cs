using doar_chat.Logic;

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

            group.MapDelete("/{id:int}", async (int id, UsersLogic logic) =>
            {
                await logic.DeleteAsync(id);
                return Results.NoContent();
            });

            return app;
        }
    }
}
