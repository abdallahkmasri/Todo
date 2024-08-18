using Microsoft.AspNetCore.Mvc;
using TodoApp.Models;
using TodoApp.Services;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel request)
        {
            var user = new UserModel
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.UserName,
                Email = request.Email,
                Password = request.Password
            };

            var result = await _userService.RegisterUserAsync(user);
            if (result != false)
                return Ok(user);

            return BadRequest("Registration failed.");
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            var user = await _userService.AuthenticateUserAsync(request.UserName, request.Password);
            if (user != null)
            {
                // Generate JWT token
                var token = _userService.GenerateJwtToken(user);
                return Ok(new { Token = token, UserId = user.ID, UserName = user.UserName });
            }

            return Unauthorized("Invalid username or password.");
        }
    }
}
