using BabyMonitorAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BabyMonitorAPI.Data
{
    public class BabyContext(DbContextOptions<BabyContext> options) : DbContext(options)
    {
        public DbSet<BabyInfo> BabyInfos { get; set; }

        public DbSet<Record> Records { get; set; }



    }
}
