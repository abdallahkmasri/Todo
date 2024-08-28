using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsersTasks()
        {

            var tasks = await _taskService.GetAllUsersTasks();

            var result = tasks.Select(t =>
            {
                string status = t.Status.ToString();
                return new
                {
                    t.ID,
                    t.Title,
                    t.Description,
                    status,
                    t.CreatedDate,
                    t.DueDate,
                    t.Priority,
                    t.UserId,
                    t.User.UserName,
                    t.Category,
                };
            });

            return Ok(result);
        }

        // GET: api/tasks/
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
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

            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {

                if (await _taskService.IsDuplicateTask(taskModel.Title, taskModel.Category))
                    return BadRequest();

                var task = new TaskModel
                {
                    Title = taskModel.Title,
                    Description = taskModel.Description,
                    DueDate = taskModel.DueDate,
                    Priority = taskModel.Priority,
                    Status = taskModel.Status,
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

            if (await _taskService.IsDuplicateTask(taskModel.Title, taskModel.Category))
                return BadRequest();

            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            task.Title = taskModel.Title;
            task.Description = taskModel.Description;
            task.DueDate = taskModel.DueDate;
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
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            await _taskService.MarkTaskAsCompletedAsync(id);
            return NoContent();
        }

        //GET: api/tasks/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchTask([FromQuery] string searchTerm)
        {
            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {

                var tasks = await _taskService.SearchTasksAsync(userId, searchTerm);

                if (tasks == null) return NotFound("No Tasks Found");

                return Ok(tasks);
            }
            return Unauthorized();
        
        }
    }
}
