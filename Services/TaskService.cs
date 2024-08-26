using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TodoApi.Repositories;
using TodoApp.Models;

namespace TodoApp.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _todoRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TaskService(ITaskRepository todoRepository ,IHttpContextAccessor httpContextAccessor)
        {
            _todoRepository = todoRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<TaskModel>> GetUserTaskAsync(int userId) => 
            await _todoRepository.GetTasksByUserIdAsync(userId);

        public async Task<TaskModel> GetTaskByIdAsync(int id) =>
            await _todoRepository.GetTaskByIdAsync(id);

        public async Task AddTaskAsync(TaskModel todoItem)
        {
            await _todoRepository.AddTaskAsync(todoItem);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task UpdateTaskAsync(TaskModel todoItem)
        {
            await _todoRepository.UpdateTaskAsync(todoItem);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task DeleteTaskAsync(int id)
        {
            await _todoRepository.DeleteTaskAsync(id);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task MarkTaskAsCompletedAsync(int id) =>
            await _todoRepository.MarkTaskAsCompletedAsync(id);

        public async Task<IEnumerable<TaskModel>> SearchTasksAsync(int userId, string searchTerm) =>
            await _todoRepository.SearchTasksAsync(userId, searchTerm);

        public int GetUserIdFromToken()
        {
            var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return -1; // Handle invalid token or missing authorization header
            }

            

            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var claimsPrincipal = tokenHandler.ReadToken(token) as JwtSecurityToken;
                var userIdClaim = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "UserId");

                if (userIdClaim == null)
                {
                    return -1; // Handle missing UserId claim
                }

                return int.Parse(userIdClaim.Value);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error extracting user ID from token: {0}", ex.Message);
                return -1; // Handle unexpected errors
            }
        }
    }
}
