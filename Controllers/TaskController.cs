using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Repositories;
using TodoApp.Models;
using TodoApp.Services;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;

        public TasksController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveTasks(int userId)
        {
            var tasks = await _taskRepository.GetActiveTasksAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentlyCompletedTasks(int userId)
        {
            var tasks = await _taskRepository.GetRecentlyCompletedTasksAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchTasks(int userId, string title, DateTime? startDate, DateTime? endDate)
        {
            var tasks = await _taskRepository.SearchTasksAsync(userId, title, startDate, endDate);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskModel taskmodel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = new TaskModel
            {
                Title = taskmodel.Title,
                Description = taskmodel.Description,
                DueDate = taskmodel.DueDate,
                IsCompleted = taskmodel.IsCompleted,
                UserId = taskmodel.UserId,
                Priority = taskmodel.Priority,
            };

            await _taskRepository.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = task.ID }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel taskmodel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.Title = taskmodel.Title;
            task.Description = taskmodel.Description;
            task.DueDate = taskmodel.DueDate;
            task.IsCompleted = taskmodel.IsCompleted;
            task.Priority = taskmodel.Priority;

            await _taskRepository.UpdateTaskAsync(task);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskRepository.DeleteTaskAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> MarkTaskAsCompleted(int id)
        {
            await _taskRepository.MarkTaskAsCompletedAsync(id);
            return NoContent();
        }
    }
}
