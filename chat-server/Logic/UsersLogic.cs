using doar_chat.Contracts.Users;
using doar_chat.Models.Entities;
using doar_chat.Models.Errors;
using Microsoft.EntityFrameworkCore;

namespace doar_chat.Logic
{
    public class UsersLogic(AppDbContext db)
    {
        private readonly AppDbContext _db = db;

        public async Task<IReadOnlyList<UserListItem>> GetAllAsync()
        {
            return await _db.TUsers
                .AsNoTracking()
                .OrderBy(u => u.Id)
                .Select(u => new UserListItem(u.Id, u.Email, u.Name))
                .ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _db.TUsers.SingleOrDefaultAsync(u => u.Id == id);
            if (user is null)
            {
                throw new ApiException(StatusCodes.Status404NotFound, "User not found.");
            }

            _db.TUsers.Remove(user);
            await _db.SaveChangesAsync();
        }
    }
}
