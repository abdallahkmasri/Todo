using Microsoft.EntityFrameworkCore;
using System.Globalization;
using TodoApi.Repositories;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TodoDbContext _context;

        public TaskRepository(TodoDbContext context) => _context = context;

        public async Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId) =>
            await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();


        public async Task<TaskModel> GetTaskByIdAsync(int id) =>
            await _context.Tasks.FindAsync(id);

        public async Task AddTaskAsync(TaskModel todoItem) =>
            await _context.Tasks.AddAsync(todoItem);

        public Task UpdateTaskAsync(TaskModel todoItem) =>
            Task.Run(() => _context.Tasks.Update(todoItem));

        public async Task DeleteTaskAsync(int id)
        {
            var todoItem = await _context.Tasks.FindAsync(id);
            if (todoItem != null)
            {
                _context.Tasks.Remove(todoItem);
            }
        }

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();

        public async Task<IEnumerable<TaskModel>> SearchTasksAsync(int userId, string searchTerm)
        {
            // Attempt to parse the searchTerm as a DateOnly
            DateOnly parsedDueDate;
            bool isDate = DateOnly.TryParseExact(searchTerm, "yyyy/MM/dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out parsedDueDate);

            // Build the query
            IQueryable<TaskModel> query = _context.Tasks.Where(t => t.UserId == userId);

            if (isDate)
            {
                // If searchTerm is a date, search by DueDate
                query = query.Where(t => t.DueDate == parsedDueDate);
            }
            else
            {
                // Otherwise, search by Title
                query = query.Where(t => t.Title.Contains(searchTerm));
            }

            return await query.ToListAsync();

        }

        public async Task MarkTaskAsCompletedAsync(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task != null)
            {
                task.Status = "Completed";
                await UpdateTaskAsync(task);
                await SaveChangesAsync();
            }
        }
    }
}
