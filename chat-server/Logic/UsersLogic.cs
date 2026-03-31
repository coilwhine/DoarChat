using doar_chat.Contracts.Users;
using doar_chat.Hubs;
using doar_chat.Models.Entities;
using doar_chat.Models.Errors;
using doar_chat.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace doar_chat.Logic
{
    public class UsersLogic(AppDbContext db, IUserConnectionStore connections, IHubContext<ChatHub> hub)
    {
        private readonly AppDbContext _db = db;
        private readonly IUserConnectionStore _connections = connections;
        private readonly IHubContext<ChatHub> _hub = hub;

        public async Task<IReadOnlyList<UserListItem>> GetAllAsync()
        {
            return await _db.TUsers
                .AsNoTracking()
                .Where(u => u.DeletedAt == null)
                .OrderBy(u => u.Id)
                .Select(u => new UserListItem(u.Id, u.Email, u.Name))
                .ToListAsync();
        }

        public async Task<UserListItem> GetByIdAsync(int id)
        {
            var user = await _db.TUsers
                .AsNoTracking()
                .Where(u => u.Id == id && u.DeletedAt == null)
                .Select(u => new UserListItem(u.Id, u.Email, u.Name))
                .SingleOrDefaultAsync();

            if (user is null)
            {
                throw new ApiException(StatusCodes.Status404NotFound, "User not found.");
            }

            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _db.TUsers.SingleOrDefaultAsync(u => u.Id == id);
            if (user is null)
            {
                throw new ApiException(StatusCodes.Status404NotFound, "User not found.");
            }

            if (user.DeletedAt is not null)
            {
                return false;
            }

            user.DeletedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var evt = new UserDeletedEvent(user.Id, user.DeletedAt.Value);
            var deletedUserConnectionId = _connections.GetConnection(user.Id);

            if (!string.IsNullOrWhiteSpace(deletedUserConnectionId))
            {
                await _hub.Clients.AllExcept(deletedUserConnectionId)
                    .SendAsync("UserDeleted", evt);
            }
            else
            {
                await _hub.Clients.All.SendAsync("UserDeleted", evt);
            }

            return true;
        }
    }
}
