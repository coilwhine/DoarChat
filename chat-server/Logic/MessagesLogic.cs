using doar_chat.Contracts.Messages;
using doar_chat.Models.Entities;
using doar_chat.Models.Errors;
using doar_chat.Hubs;
using doar_chat.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace doar_chat.Logic
{
    public class MessagesLogic(AppDbContext db, IUserConnectionStore connections, IHubContext<ChatHub> hub)
    {
        private const int MaxContentLength = 1000;
        private readonly AppDbContext _db = db;
        private readonly IUserConnectionStore _connections = connections;
        private readonly IHubContext<ChatHub> _hub = hub;

        public async Task<IReadOnlyList<MessageItem>> GetConversationAsync(int userId, int otherUserId)
        {
            if (userId == otherUserId)
            {
                throw new ApiException(StatusCodes.Status400BadRequest, "Conversation user must be different.");
            }

            var messages = await _db.TMessages
                .AsNoTracking()
                .Where(m =>
                    (m.SenderUserId == userId && m.ReceiverUserId == otherUserId && !m.IsDeletedBySender) ||
                    (m.SenderUserId == otherUserId && m.ReceiverUserId == userId && !m.IsDeletedByReceiver))
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageItem(
                    m.Id,
                    m.SenderUserId,
                    m.ReceiverUserId,
                    m.Content,
                    m.SentAt,
                    m.ViewedAt))
                .ToListAsync();

            return messages;
        }

        public async Task<MessageItem> SendAsync(int senderUserId, int receiverUserId, string content)
        {
            if (senderUserId == receiverUserId)
            {
                throw new ApiException(StatusCodes.Status400BadRequest, "Receiver must be different.");
            }

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new ApiException(StatusCodes.Status400BadRequest, "Content is required.");
            }

            content = content.Trim();
            if (content.Length > MaxContentLength)
            {
                throw new ApiException(StatusCodes.Status400BadRequest, $"Content must be <= {MaxContentLength} characters.");
            }

            var receiverExists = await _db.TUsers.AnyAsync(u => u.Id == receiverUserId);
            if (!receiverExists)
            {
                throw new ApiException(StatusCodes.Status404NotFound, "Receiver not found.");
            }

            var message = new TMessage
            {
                SenderUserId = senderUserId,
                ReceiverUserId = receiverUserId,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            _db.TMessages.Add(message);
            await _db.SaveChangesAsync();

            var messageItem = ToItem(message);

            var receiverConnectionId = _connections.GetConnection(receiverUserId);

            if (!string.IsNullOrWhiteSpace(receiverConnectionId))
            {
                await _hub.Clients.Client(receiverConnectionId)
                    .SendAsync("MessageReceived", messageItem);
            }

            return messageItem;
        }

        public async Task<MessageItem> MarkAsReadAsync(int messageId, int readerUserId)
        {
            var message = await _db.TMessages
                .FirstOrDefaultAsync(m => m.Id == messageId);
            if (message is null)
            {
                throw new ApiException(StatusCodes.Status404NotFound, "Message not found.");
            }

            if (message.ReceiverUserId != readerUserId)
            {
                throw new ApiException(StatusCodes.Status403Forbidden, "Only the receiver can mark the message as read.");
            }

            if (message.ViewedAt is null)
            {
                message.ViewedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                var senderConnectionId = _connections.GetConnection(message.SenderUserId);
                if (!string.IsNullOrWhiteSpace(senderConnectionId))
                {
                    var evt = new MessageReadEvent(message.Id, readerUserId, message.ViewedAt.Value);
                    await _hub.Clients.Client(senderConnectionId)
                        .SendAsync("MessageRead", evt);
                }
            }

            return ToItem(message);
        }

        private static MessageItem ToItem(TMessage message)
        {
            return new MessageItem(
                message.Id,
                message.SenderUserId,
                message.ReceiverUserId,
                message.Content,
                message.SentAt,
                message.ViewedAt);
        }
    }
}
