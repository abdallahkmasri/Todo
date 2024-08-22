using TodoApp.Models;

namespace TodoApi.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId);
        Task<TaskModel> GetTaskByIdAsync(int id);
        Task<int> GetLastIdAsync();
        Task AddTaskAsync(TaskModel todoItem);
        Task UpdateTaskAsync(TaskModel todoItem);
        Task DeleteTaskAsync(int id);
        Task SaveChangesAsync();
        Task<IEnumerable<TaskModel>> GetActiveTasksAsync(int userId);
        Task<IEnumerable<TaskModel>> GetRecentlyCompletedTasksAsync(int userId);
        Task<IEnumerable<TaskModel>> SearchTasksAsync(int userId, string searchTerm);
        Task MarkTaskAsCompletedAsync(int taskId);

    }
}
