using Microsoft.VisualBasic;

namespace BabyMonitorAPI.Dto
{
    public class RecordDto
    {
        public decimal? temperature { get; set; }

        public decimal? humidity { get; set; }

        public decimal? sound_level { get; set; }
    }
}
