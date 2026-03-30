namespace doar_chat.Contracts.Messages
{
    public record MessageReadEvent(
        int MessageId,
        int ReaderUserId,
        DateTime ViewedAt);
}
