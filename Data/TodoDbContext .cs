using Microsoft.EntityFrameworkCore;
using TodoApp.Models;

namespace TodoApp.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }

        public DbSet<TaskModel> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserModel>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserName).IsRequired();
            });

            modelBuilder.Entity<TaskModel>(entity =>
            {
                entity.ToTable("Items");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.DueDate).IsRequired();
                entity.Property(e => e.IsCompleted);
                entity.Property(e => e.Priority).IsRequired();
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.CreatedDate);
                entity.HasOne(e => e.User) // Set up a one-to-many relationship with UserModel
                      .WithMany(u => u.Items)
                      .HasForeignKey(e => e.UserId);
            });
        }
    }
}
