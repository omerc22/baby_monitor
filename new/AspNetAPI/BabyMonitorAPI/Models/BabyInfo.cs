using System.ComponentModel.DataAnnotations.Schema;

namespace BabyMonitorAPI.Models
{
    [Table("baby_info")]
    public class BabyInfo
    {
        public int id { get; set; }

        public string name { get; set; }

        public DateOnly birth_date { get; set; }

        public string? notes { get; set; }


    }
}
