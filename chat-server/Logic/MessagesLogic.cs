using doar_chat.Contracts.Messages;
using doar_chat.Models.Entities;
using doar_chat.Models.Errors;
using Microsoft.EntityFrameworkCore;

namespace doar_chat.Logic
{
    public class MessagesLogic(AppDbContext db)
    {
        private const int MaxContentLength = 1000;
        private readonly AppDbContext _db = db;

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
                    m.DeliveredAt,
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

            return new MessageItem(
                message.Id,
                message.SenderUserId,
                message.ReceiverUserId,
                message.Content,
                message.SentAt,
                message.DeliveredAt,
                message.ViewedAt);
        }
    }
}
