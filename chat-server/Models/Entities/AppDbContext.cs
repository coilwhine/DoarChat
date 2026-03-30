using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace doar_chat.Models.Entities;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<TMessage> TMessages { get; set; }

    public virtual DbSet<TUser> TUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:Default");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC076C0CD1A0");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__T_Messag__3214EC07B18360B7");

            entity.ToTable("T_Messages");

            entity.Property(e => e.Content).HasMaxLength(1000);
            entity.Property(e => e.SentAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.ReceiverUser).WithMany(p => p.TMessageReceiverUsers)
                .HasForeignKey(d => d.ReceiverUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_T_Messages_ReceiverUser");

            entity.HasOne(d => d.SenderUser).WithMany(p => p.TMessageSenderUsers)
                .HasForeignKey(d => d.SenderUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_T_Messages_SenderUser");
        });

        modelBuilder.Entity<TUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07FADE9F6A");

            entity.ToTable("T_Users");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534F9F35D8C").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role).HasDefaultValue((byte)1, "DF_Users_Role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
