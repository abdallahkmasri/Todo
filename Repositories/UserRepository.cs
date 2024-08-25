using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TodoDbContext _context;

        public UserRepository(TodoDbContext context) => _context = context;

        public async Task<UserModel> GetUserByUsernameAsync(string username) =>
            await _context.Users.SingleOrDefaultAsync(u => u.UserName == username);

        public async Task AddUserAsync(UserModel user) =>
            await _context.Users.AddAsync(user);

        public UserModel GetUserById(int userId) =>
            _context.Users.FirstOrDefault(u => u.ID == userId);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
