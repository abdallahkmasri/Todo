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
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskRepository)
        {
            _taskService = taskRepository;
        }

        // GET: api/tasks?status=active&title=Sample&startDate=2024-01-01&endDate=2024-01-31
        [HttpGet]
        public async Task<IActionResult> GetTasks(int userId)
        {
            var tasks = await _taskService.GetUserTaskAsync(userId);
            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskModel taskModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = new TaskModel
            {
                Title = taskModel.Title,
                Description = taskModel.Description,
                DueDate = taskModel.DueDate,
                Priority = taskModel.Priority,
                Status = taskModel.Status,
                IsCompleted = taskModel.IsCompleted,
                UserId = taskModel.UserId,
                CreatedDate = taskModel.CreatedDate,
            };

            await _taskService.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = task.ID }, task);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel taskModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.Title = taskModel.Title;
            task.Description = taskModel.Description;
            task.DueDate = taskModel.DueDate;
            task.IsCompleted = taskModel.IsCompleted;
            task.Priority = taskModel.Priority;
            task.Status = taskModel.Status;
            task.CreatedDate = taskModel.CreatedDate;

            await _taskService.UpdateTaskAsync(task);
            return Ok(task);
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            await _taskService.DeleteTaskAsync(id);
            return NoContent();
        }

        // PUT: api/tasks/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkTaskAsCompleted(int id)
        {
            await _taskService.MarkTaskAsCompletedAsync(id);
            return NoContent();
        }

        //GET: api/tasks/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchTask(int userId, string title, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var tasks = await _taskService.SearchTasksAsync(userId, title, startDate, endDate);

            if (tasks == null) return NotFound("No Tasks Found");

            return Ok(tasks);
        }
    }
}
