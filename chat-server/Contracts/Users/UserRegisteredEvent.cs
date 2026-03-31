namespace doar_chat.Contracts.Users
{
    public record UserRegisteredEvent(int Id, string Email, string Name);
}