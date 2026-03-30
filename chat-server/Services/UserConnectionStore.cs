using System.Collections.Concurrent;

namespace doar_chat.Services
{
    public class UserConnectionStore : IUserConnectionStore
    {
        private readonly ConcurrentDictionary<int, string> _connections = new();

        public void SetConnection(int userId, string connectionId)
        {
            _connections[userId] = connectionId;
        }

        public void RemoveConnection(int userId, string connectionId)
        {
            if (_connections.TryGetValue(userId, out var existing) && existing == connectionId)
            {
                _connections.TryRemove(userId, out _);
            }
        }

        public string? GetConnection(int userId)
        {
            return _connections.TryGetValue(userId, out var connectionId)
                ? connectionId
                : null;
        }
    }
}
