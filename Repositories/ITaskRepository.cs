using TodoApp.Enums;
using TodoApp.Models;

namespace TodoApi.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId);
        Task<TaskModel> GetTaskByIdAsync(int id);
        Task AddTaskAsync(TaskModel todoItem);
        Task UpdateTaskAsync(TaskModel todoItem);
        Task DeleteTaskAsync(int id);
        Task SaveChangesAsync();
        Task<IEnumerable<TaskDto>> SearchTasksAsync(int userId, string searchTerm);
        Task MarkTaskAsCompletedAsync(int taskId);
        Task<IEnumerable<TaskModel>> GetAllUsersTasks();
        Task<bool> IsDuplicateTask(string title, int? categoryId, int? taskId = null);

        Task AddTasksAsync(IEnumerable<TaskModel> tasks);

    }
}
