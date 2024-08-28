using System.Text.Json.Serialization;
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
        public string Status { get; set; }
        public int UserId { get; set; }
        public UserModel? User { get; set; }
    }
}
