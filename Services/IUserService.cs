using TodoApp.Models;

namespace TodoApp.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(UserModel user, string confirmPassword);
        Task<UserModel> AuthenticateUserAsync(string username, string password);
    }
}
