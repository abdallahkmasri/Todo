using Microsoft.EntityFrameworkCore;
using TodoApi.Repositories;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TodoDbContext _context;

        public TaskRepository(TodoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId)
        {
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<TaskModel> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task AddTaskAsync(TaskModel todoItem)
        {
            await _context.Tasks.AddAsync(todoItem);
        }

        public async Task UpdateTaskAsync(TaskModel todoItem)
        {
            _context.Tasks.Update(todoItem);
        }

        public async Task DeleteTaskAsync(int id)
        {
            var todoItem = await _context.Tasks.FindAsync(id);
            if (todoItem != null)
            {
                _context.Tasks.Remove(todoItem);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TaskModel>> GetActiveTasksAsync(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId && !t.IsCompleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskModel>> GetRecentlyCompletedTasksAsync(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId && t.IsCompleted)
                .OrderByDescending(t => t.DueDate)
                .Take(10)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskModel>> SearchTasksAsync(int userId, string title, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.Tasks.AsQueryable();

            query = query.Where(t => t.UserId == userId);

            if (!string.IsNullOrWhiteSpace(title))
                query = query.Where(t => t.Title.Contains(title, StringComparison.OrdinalIgnoreCase));

            if (startDate.HasValue && endDate.HasValue)
                query = query.Where(t => t.DueDate >= startDate.Value && t.DueDate <= endDate.Value);


            else if (startDate.HasValue)
                query = query.Where(t => t.DueDate >= startDate.Value);

            else if (endDate.HasValue)
                query = query.Where(t => t.DueDate <= endDate.Value);

            else return null;

            return await query.ToListAsync();
        }

        public async Task MarkTaskAsCompletedAsync(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task != null)
            {
                task.IsCompleted = true;
                await UpdateTaskAsync(task);
            }
        }
    }
}
