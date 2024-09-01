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
        public async Task<IActionResult> AddTask([FromBody] TaskModel taskModel, [FromQuery] List<string>? categoryIds)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {
                List<int> parsedCategoryIds = new List<int>();
                var tasksToSave = new List<TaskModel>();
                if (categoryIds.Any())
                {
                    foreach (var id in categoryIds)
                    {
                        if (int.TryParse(id, out int parsedId))
                        {
                            parsedCategoryIds.Add(parsedId);
                        }
                        else
                        {
                            return BadRequest("Invalid category ID format.");
                        }
                    }
                }

                // Check for duplicate task title within any provided category
                if (parsedCategoryIds.Count > 0)
                {
                    foreach (var categoryId in parsedCategoryIds)
                    {
                        if (await _taskService.IsDuplicateTask(taskModel.Title, categoryId))
                        {
                            return BadRequest("Task with the same title already exists in one of the selected categories.");
                        }
                    }

                    foreach (var categoryId in parsedCategoryIds)
                    {

                        tasksToSave = new List<TaskModel>();
                        var taskWithCategory = new TaskModel
                        {
                            Title = taskModel.Title,
                            Description = taskModel.Description,
                            DueDate = taskModel.DueDate,
                            Priority = taskModel.Priority,
                            Status = taskModel.Status,
                            UserId = userId,
                            CreatedDate = taskModel.CreatedDate,
                            TaskCategories = new List<TaskCategory> { new TaskCategory { CategoryId = categoryId } },
                        };

                        tasksToSave.Add(taskWithCategory);
                        await _taskService.AddTasksAsync(tasksToSave);
                    }

                    var taskToSend = await _taskService.GetTaskByIdAsync(tasksToSave.ElementAt(0).ID);

                    var taskDto = new TaskDto
                    {
                        ID = taskToSend.ID,
                        Title = taskToSend.Title,
                        Description = taskToSend.Description,
                        DueDate = taskToSend.DueDate,
                        Priority = taskToSend.Priority,
                        Status = taskToSend.Status.ToString(),
                        CreatedDate = taskToSend.CreatedDate,
                        TaskCategories = taskToSend.TaskCategories.Select(tc => tc.Category?.Name).ToList(),
                    };

                    return CreatedAtAction("GetTaskById", new { id = taskDto.ID }, taskDto);

                }
                else {
                    if (await _taskService.IsDuplicateTask(taskModel.Title))
                    {
                        return BadRequest("Task with the same title already exists with no categories.");
                    }
                }

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

                tasksToSave.Add(task);
                await _taskService.AddTasksAsync(tasksToSave);
                return CreatedAtAction("GetTaskById", new { id = tasksToSave[0].ID }, tasksToSave[0]);
            }

            return Unauthorized();
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskModel taskModel, [FromQuery] List<string>? categoryIds)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (HttpContext.Items.TryGetValue("UserId", out var userIdObj) && int.TryParse(userIdObj.ToString(), out int userId))
            {
                // Parse categoryIds from string to integer
                List<int> parsedCategoryIds = new List<int>();
                if (categoryIds.Any())
                {
                    foreach (var categoryId in categoryIds)
                    {
                        if (int.TryParse(categoryId, out int parsedId))
                        {
                            parsedCategoryIds.Add(parsedId);
                        }
                        else
                        {
                            return BadRequest("Invalid category ID format.");
                        }
                    }
                }

                // Retrieve the existing task
                var task = await _taskService.GetTaskByIdAsync(id);
                if (task == null) return NotFound();

                if (parsedCategoryIds.Count < 1)
                {
                    task.Title = taskModel.Title;
                    task.Description = taskModel.Description;
                    task.DueDate = taskModel.DueDate;
                    task.Priority = taskModel.Priority;
                    task.Status = taskModel.Status;
                    task.TaskCategories.Clear();
                    await _taskService.UpdateTaskAsync(task);
                }
                else
                {
                    // Update the existing task with the first category (if any)
                    if (parsedCategoryIds.Count > 0)
                    {
                        task.Title = taskModel.Title;
                        task.Description = taskModel.Description;
                        task.DueDate = taskModel.DueDate;
                        task.Priority = taskModel.Priority;
                        task.Status = taskModel.Status;

                        // Clear existing categories and assign the first one
                        task.TaskCategories.Clear();
                        task.TaskCategories.Add(new TaskCategory { TaskId = task.ID, CategoryId = parsedCategoryIds[0] });

                        await _taskService.UpdateTaskAsync(task);
                    }

                    // Create new tasks for each additional category
                    if (parsedCategoryIds.Count > 1)
                    {
                        for (int i = 1; i < parsedCategoryIds.Count; i++)
                        {
                            var newTask = new TaskModel
                            {
                                Title = taskModel.Title,
                                Description = taskModel.Description,
                                DueDate = taskModel.DueDate,
                                Priority = taskModel.Priority,
                                Status = taskModel.Status,
                                UserId = userId,
                                CreatedDate = taskModel.CreatedDate,
                                TaskCategories = new List<TaskCategory> { new TaskCategory { CategoryId = parsedCategoryIds[i] } },
                            };

                            await _taskService.AddTaskAsync(newTask);
                        }
                    }
                }

                // Prepare the response DTO for the updated task
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
