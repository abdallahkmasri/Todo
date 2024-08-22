namespace TodoApp.Models
{
    public class TaskModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public DateOnly DueDate { get; set; }
        public DateOnly CreatedDate { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public UserModel? User { get; set; }
    }
}
