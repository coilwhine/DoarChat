using System.Text.Json;
using doar_chat.Models.Errors;

namespace doar_chat.Middleware
{
    public class ApiExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ApiExceptionMiddleware> _logger;

        public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ApiException ex)
            {
                if (context.Response.HasStarted)
                {
                    throw;
                }

                context.Response.StatusCode = ex.StatusCode;
                context.Response.ContentType = "application/json";
                var payload = JsonSerializer.Serialize(new
                {
                    error = ex.Message,
                    traceId = context.TraceIdentifier
                });
                await context.Response.WriteAsync(payload);
            }
            catch (Exception ex)
            {
                if (context.Response.HasStarted)
                {
                    throw;
                }

                _logger.LogError(ex, "Unhandled exception");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";
                var payload = JsonSerializer.Serialize(new
                {
                    error = "An unexpected error occurred.",
                    traceId = context.TraceIdentifier
                });
                await context.Response.WriteAsync(payload);
            }
        }
    }
}
