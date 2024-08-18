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

        // GET: api/tasks?status=active&title=Sample&startDate=2024-01-01&endDate=2024-01-31
        [HttpGet]
        public async Task<IActionResult> GetTasks(int userId)
        {
            var tasks = await _taskRepository.GetTasksByUserIdAsync(userId);
            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskRepository.GetTaskByIdAsync(id);
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
            };

            await _taskRepository.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = task.ID }, task);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel taskModel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.Title = taskModel.Title;
            task.Description = taskModel.Description;
            task.DueDate = taskModel.DueDate;
            task.IsCompleted = taskModel.IsCompleted;
            task.Priority = taskModel.Priority;

            await _taskRepository.UpdateTaskAsync(task);
            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            await _taskRepository.DeleteTaskAsync(id);
            return NoContent();
        }

        // PUT: api/tasks/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkTaskAsCompleted(int id)
        {
            var task = await _taskRepository.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.IsCompleted = true;
            await _taskRepository.UpdateTaskAsync(task);
            return NoContent();
        }
    }
}
