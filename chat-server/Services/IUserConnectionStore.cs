namespace doar_chat.Services
{
    public interface IUserConnectionStore
    {
        void SetConnection(int userId, string connectionId);
        void RemoveConnection(int userId, string connectionId);
        string? GetConnection(int userId);
    }
}
