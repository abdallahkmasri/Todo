using TodoApp.Models;
using TodoApp.Repositories;

namespace TodoApp.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> RegisterUserAsync(UserModel user, string confirmPassword)
        {
            if (user.Password != confirmPassword)
                return false;

            var existingUser = await _userRepository.GetUserByUsernameAsync(user.UserName);
            if (existingUser != null)
                return false;

            
            await _userRepository.AddUserAsync(user);
            await _userRepository.SaveChangesAsync();
            return true;
        }

        public async Task<UserModel> AuthenticateUserAsync(string username, string password)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user != null && user.Password.Equals(password))
            {
                return user;
            }
            return null;
        }
    }
}
