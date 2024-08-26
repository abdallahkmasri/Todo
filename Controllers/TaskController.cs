using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
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

        public TasksController(ITaskService taskRepository) => _taskService = taskRepository;

        // GET: api/tasks/
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            int userId = _taskService.GetUserIdFromToken();

            if (userId > -1)
            {

                var tasks = await _taskService.GetUserTaskAsync(userId);
                return Ok(tasks);
            }

            return Unauthorized();
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

            int userId = _taskService.GetUserIdFromToken();

            if (userId > -1)
            {

                var task = new TaskModel
                {
                    Title = taskModel.Title,
                    Description = taskModel.Description,
                    DueDate = taskModel.DueDate,
                    Priority = taskModel.Priority,
                    Status = taskModel.Status,
                    IsCompleted = taskModel.IsCompleted,
                    UserId = userId,
                    CreatedDate = taskModel.CreatedDate,
                };

                await _taskService.AddTaskAsync(task);
                return CreatedAtAction(nameof(GetTaskById), new { id = task.ID }, task);
            }

            return Unauthorized();
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
        public async Task<IActionResult> SearchTask([FromQuery] string searchTerm)
        {
            int userId = _taskService.GetUserIdFromToken();

            if (userId > -1)
            {

                var tasks = await _taskService.SearchTasksAsync(userId, searchTerm);

                if (tasks == null) return NotFound("No Tasks Found");

                return Ok(tasks);
            }
            return Unauthorized();
        
        }
    }
}
