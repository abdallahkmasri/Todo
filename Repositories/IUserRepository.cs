using TodoApp.Models;

namespace TodoApp.Repositories
{
    public interface IUserRepository
    {
        Task<UserModel> GetUserByUsernameAsync(string username);
        Task AddUserAsync(UserModel user);
        UserModel GetUserById(int id);
        Task SaveChangesAsync();
    }
}
