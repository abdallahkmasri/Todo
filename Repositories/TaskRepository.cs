using Microsoft.EntityFrameworkCore;
using System.Globalization;
using TodoApi.Repositories;
using TodoApp.Data;
using TodoApp.Enums;
using TodoApp.Models;


namespace TodoApp.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TodoDbContext _context;

        public TaskRepository(TodoDbContext context) => _context = context;

        public async Task AddTasksAsync(IEnumerable<TaskModel> tasks)
        {
            foreach (var task in tasks)
            {
                await AddTaskAsync(task);
                await SaveChangesAsync();
            }
        }

        public async Task<bool> IsDuplicateTask(string title, int? categoryId, int? taskId = null)
        {
            // Query for tasks with the same title within the same category (excluding current task if editing)
            var query = _context.Tasks
                .Where(t => t.Title == title);

            if (categoryId.HasValue)
            {
                query = query.Where(t => t.TaskCategories.Any(tc => tc.CategoryId == categoryId));
            }

            if (taskId.HasValue)
            {
                query = query.Where(t => t.ID != taskId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<IEnumerable<TaskModel>> GetAllUsersTasks()
        {
            var tasks = await _context.Tasks.Where(t => t.Status != EnumTaskStatus.Completed)
                .Include(t => t.User)
                .Include(t => t.TaskCategories)
                .ThenInclude(t => t.Category)
                .OrderByDescending(t => t.ID)
                .ToListAsync();

            return tasks;
        }
            

        public async Task<IEnumerable<TaskModel>> GetTasksByUserIdAsync(int userId) =>
            await _context.Tasks.Where(t => t.UserId == userId)
                .Include(t => t.TaskCategories)
                .ThenInclude(t => t.Category)
                .ToListAsync();


        public async Task<TaskModel> GetTaskByIdAsync(int id) =>
            await _context.Tasks
                .Include(t => t.TaskCategories)
                .ThenInclude(tc => tc.Category)
                .FirstOrDefaultAsync(t => t.ID == id);

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
                task.Status = EnumTaskStatus.Completed;
                await UpdateTaskAsync(task);
                await SaveChangesAsync();
            }
        }
    }
}
