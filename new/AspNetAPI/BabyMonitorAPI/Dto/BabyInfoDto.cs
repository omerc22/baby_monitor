namespace BabyMonitorAPI.Dto
{
    public class BabyInfoDto
    {
        public string name { get; set; }

        public DateOnly birth_date { get; set; }

        public string? notes { get; set; }
    }
}
