using System.IdentityModel.Tokens.Jwt;

namespace TodoApp.Middleware
{
    public class JwtUserIdMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtUserIdMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                try
                {
                    var Claimprincipal = tokenHandler.ReadToken(token) as JwtSecurityToken;
                    var userIdClaim = Claimprincipal.Claims.FirstOrDefault(c => c.Type == "UserId");

                    if (userIdClaim != null)
                    {
                        context.Items["UserId"] = userIdClaim.Value;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error extracting user ID from token: {ex.Message}");
                }
            }

            await _next(context);
        }
    }
}
