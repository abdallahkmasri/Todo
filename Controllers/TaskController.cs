using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Migrations;
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
                var categories = t.TaskCategories.Select(tc => tc.Category.Name);
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
                    TaskCategories = categories,
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

                var result = tasks.Select(t =>
                {
                    string status = t.Status.ToString();
                    var categories = t.TaskCategories.Select(tc => tc.Category.Name);
                    return new
                    {
                        t.ID,
                        t.Title,
                        t.Description,
                        status,
                        t.CreatedDate,
                        t.DueDate,
                        t.Priority,
                        TaskCategories = categories,
                    };
                });
                return Ok(result);
            }

            return Unauthorized();
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            var taskDto = new TaskDto
            {
                ID = task.ID,
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                Priority = task.Priority,
                Status = task.Status.ToString(),
                CreatedDate = task.CreatedDate,
                TaskCategories = task.TaskCategories.Select(tc => tc.Category?.Name).ToList(),
            };
            if (taskDto == null) return NotFound();
            return Ok(taskDto);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskModel taskModel, [FromQuery] List<int> categoryIds)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {

                var task = new TaskModel
                {
                    Title = taskModel.Title,
                    Description = taskModel.Description,
                    DueDate = taskModel.DueDate,
                    Priority = taskModel.Priority,
                    Status = taskModel.Status,
                    UserId = userId,
                    CreatedDate = taskModel.CreatedDate,
                    TaskCategories = categoryIds.Select(cid => new TaskCategory { CategoryId = cid }).ToList()
                };

                await _taskService.AddTaskAsync(task);

                var taskDto = new TaskDto
                {
                    ID = task.ID,
                    Title = task.Title,
                    Description = task.Description,
                    DueDate = task.DueDate,
                    Priority = task.Priority,
                    Status = task.Status.ToString(),
                    CreatedDate = task.CreatedDate,
                    TaskCategories = task.TaskCategories.Select(tc => tc.Category?.Name).ToList(),
                };

                return CreatedAtAction("GetTaskById", new { id = task.ID }, taskDto);
            }
            return Unauthorized();
        }


        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel taskModel, [FromQuery] List<int>? categoryIds)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {

                var task = await _taskService.GetTaskByIdAsync(id);
                if (task == null) return NotFound();

                task.Title = taskModel.Title;
                task.Description = taskModel.Description;
                task.DueDate = taskModel.DueDate;
                task.Priority = taskModel.Priority;
                task.Status = taskModel.Status;

                if (categoryIds != null)
                {
                    task.TaskCategories.Clear();

                    foreach (var categoryId in categoryIds)
                    {
                        task.TaskCategories.Add(new TaskCategory
                        {
                            TaskId = task.ID,
                            CategoryId = categoryId
                        });
                    }
                }

                await _taskService.UpdateTaskAsync(task);

                var taskDto = new TaskDto
                {
                    ID = task.ID,
                    Title = task.Title,
                    Description = task.Description,
                    DueDate = task.DueDate,
                    Priority = task.Priority,
                    Status = task.Status.ToString(),
                    CreatedDate = task.CreatedDate,
                    TaskCategories = task.TaskCategories.Select(tc => tc.Category?.Name).ToList(),
                };

                return Ok(taskDto);
            }
            return Unauthorized();
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
