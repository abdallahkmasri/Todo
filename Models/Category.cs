namespace TodoApp.Models
{
    public class Category
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ICollection<TaskCategory> TaskCategories { get; set; }
    }
}
