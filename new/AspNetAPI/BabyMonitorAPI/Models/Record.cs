using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;

namespace BabyMonitorAPI.Models
{
    [Table("records")]
    public class Record
    {
        public int id { get; set; }

        public decimal? temperature { get; set; }

        public decimal? humidity { get; set; }

        public decimal? sound_level { get; set; }

        public DateTime log_time { get; set; }

    }
}
