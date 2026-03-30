using System;
using System.Collections.Generic;

namespace doar_chat.Models.Entities;

public partial class TMessage
{
    public int Id { get; set; }

    public int SenderUserId { get; set; }

    public int ReceiverUserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime SentAt { get; set; }

    public DateTime? ViewedAt { get; set; }

    public bool IsDeletedBySender { get; set; }

    public bool IsDeletedByReceiver { get; set; }

    public virtual TUser ReceiverUser { get; set; } = null!;

    public virtual TUser SenderUser { get; set; } = null!;
}
