﻿using TodoApi.Repositories;
using TodoApp.Models;

namespace TodoApp.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _todoRepository;

        public TaskService(ITaskRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<TaskModel>> GetUserTaskAsync(int userId)
        {
            return await _todoRepository.GetTasksByUserIdAsync(userId);
        }

        public async Task<TaskModel> GetTaskByIdAsync(int id)
        {
            return await _todoRepository.GetTaskByIdAsync(id);
        }

        public async Task AddTaskAsync(TaskModel todoItem)
        {
            await _todoRepository.AddTaskAsync(todoItem);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task UpdateTaskAsync(TaskModel todoItem)
        {
            await _todoRepository.UpdateTaskAsync(todoItem);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task DeleteTaskAsync(int id)
        {
            await _todoRepository.DeleteTaskAsync(id);
            await _todoRepository.SaveChangesAsync();
        }

        public async Task MarkTaskAsCompletedAsync(int id)
        {
            var todoItem = await _todoRepository.GetTaskByIdAsync(id);
            if (todoItem != null)
            {
                todoItem.IsCompleted = true;
                await _todoRepository.UpdateTaskAsync(todoItem);
                await _todoRepository.SaveChangesAsync();
            }
        }
    }
}
