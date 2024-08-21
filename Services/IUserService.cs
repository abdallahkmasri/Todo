using TodoApp.Models;

namespace TodoApp.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(UserModel user);
        Task<UserModel> AuthenticateUserAsync(string username, string password);
        UserModel GetUserById(int userId);
        string GenerateJwtToken(UserModel user);
    }
}
