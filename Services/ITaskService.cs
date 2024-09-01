using TodoApp.Enums;
using TodoApp.Models;

namespace TodoApp.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskModel>> GetUserTaskAsync(int userId);
        Task<TaskModel> GetTaskByIdAsync(int id);
       Task AddTaskAsync(TaskModel todoItem);
        Task UpdateTaskAsync(TaskModel todoItem);
        Task DeleteTaskAsync(int id);
        Task MarkTaskAsCompletedAsync(int id);
        Task<IEnumerable<TaskModel>> SearchTasksAsync(int userId, string searchTerm);
        Task<IEnumerable<TaskModel>> GetAllUsersTasks();
        Task<bool> IsDuplicateTask(string title, int? categoryId = null, int? taskId = null);
        Task AddTasksAsync(IEnumerable<TaskModel> tasks);
    }
}
