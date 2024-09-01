namespace TodoApp.Models
{
    public class TaskDto
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateOnly DueDate { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public DateOnly CreatedDate { get; set; }
        public List<string> TaskCategories { get; set; }
    }
}
