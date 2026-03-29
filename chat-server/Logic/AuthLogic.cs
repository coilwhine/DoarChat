using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using doar_chat.Models.Entities;
using doar_chat.Models.Errors;
using doar_chat.Models.Enums;
using doar_chat.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace doar_chat.Logic
{
    public class AuthLogic(AppDbContext db, JwtOptions jwtOptions)
    {
        private readonly AppDbContext _db = db;
        private readonly JwtOptions _jwtOptions = jwtOptions;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public async Task<User> RegisterAsync(string username, string password, string name)
        {
            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(name))
            {
                throw new ApiException(StatusCodes.Status400BadRequest, "Username, password, and name are required.");
            }

            var email = username.Trim().ToLowerInvariant();
            var exists = await _db.Users.AnyAsync(u => u.Email == email);
            if (exists)
            {
                throw new ApiException(StatusCodes.Status409Conflict, "User already exists.");
            }

            var user = new User
            {
                Name = name.Trim(),
                Email = email,
                Role = (byte)UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                throw new ApiException(StatusCodes.Status400BadRequest, "Username and password are required.");
            }

            var email = username.Trim().ToLowerInvariant();
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (user is null)
            {
                throw new ApiException(StatusCodes.Status401Unauthorized, "Invalid credentials.");
            }

            var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (verification == PasswordVerificationResult.Failed)
            {
                throw new ApiException(StatusCodes.Status401Unauthorized, "Invalid credentials.");
            }

            var token = GenerateToken(user);
            return token;
        }

        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Key);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(ClaimTypes.Role, user.Role.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes),
                Issuer = _jwtOptions.Issuer,
                Audience = _jwtOptions.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
