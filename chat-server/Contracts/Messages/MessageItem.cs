namespace doar_chat.Contracts.Messages
{
    public record MessageItem(
        int Id,
        int SenderUserId,
        int ReceiverUserId,
        string Content,
        DateTime SentAt,
        DateTime? ViewedAt);
}
