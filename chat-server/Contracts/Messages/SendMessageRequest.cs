namespace doar_chat.Contracts.Messages
{
    public record SendMessageRequest(int ReceiverUserId, string Content);
}
