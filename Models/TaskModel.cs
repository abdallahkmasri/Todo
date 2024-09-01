using System.Text.Json;
using System.Text.Json.Serialization;
using TodoApp.Enums;
using TodoApp.Utilities;

namespace TodoApp.Models
{
    public class TaskModel
    {
        public int ID { get; set; }
        public string Title { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateOnly DueDate { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateOnly CreatedDate { get; set; }

        public string Priority { get; set; }
        public string Description { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EnumTaskStatus Status { get; set; }

        public int UserId { get; set; }
        public UserModel? User { get; set; }

        public IList<TaskCategory> TaskCategories { get; set; } = new List<TaskCategory>();
    }
}
