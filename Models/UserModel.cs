namespace TodoApp.Models
{
    public class UserModel
    {
        public int ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        public ICollection<TaskModel>? Items { get; set; }
    }
}
