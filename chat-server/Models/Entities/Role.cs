using System;
using System.Collections.Generic;

namespace doar_chat.Models.Entities;

public partial class Role
{
    public byte Id { get; set; }

    public string Name { get; set; } = null!;
}
