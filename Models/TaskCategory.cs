namespace TodoApp.Models
{
    public class TaskCategory
    {
        public int TaskId { get; set; }
        public TaskModel? Task { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
