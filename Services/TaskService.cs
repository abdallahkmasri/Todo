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
        
    }
}
