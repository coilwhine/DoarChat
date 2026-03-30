using System;
using System.Collections.Generic;

namespace doar_chat.Models.Entities;

public partial class TUser
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public byte Role { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<TMessage> TMessageReceiverUsers { get; set; } = new List<TMessage>();

    public virtual ICollection<TMessage> TMessageSenderUsers { get; set; } = new List<TMessage>();
}
