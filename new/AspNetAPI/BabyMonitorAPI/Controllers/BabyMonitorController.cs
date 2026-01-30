using BabyMonitorAPI.Data;
using BabyMonitorAPI.Dto;
using BabyMonitorAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BabyMonitorAPI.Controllers
{

    [Route("api/babymonitor")]
    public class BabyMonitorController : ControllerBase
    {
        private readonly BabyContext _context;

        public BabyMonitorController(BabyContext context)
        {
            this._context = context;
        }


        [HttpPost("update/baby")]

        public async Task<IActionResult> UpdateBaby(BabyInfoDto dto)
        {
            try
            {
                var baby = await _context.BabyInfos.FindAsync(1);

                baby.name = dto.name;
                baby.birth_date = dto.birth_date;
                baby.notes = dto.notes;

                await _context.SaveChangesAsync();


                return Ok();
            }

            catch (DbUpdateException)
            {
                return BadRequest("DBside error");
            }
            catch (Exception)
            {
                return StatusCode(500, "Unexpected error");
            }
        }

        [HttpPost("add/record")]
        public async Task<IActionResult> AddRecord(RecordDto dto)
        {
            try
            {
                dto.sound_level = Math.Abs(dto.sound_level ?? 0);
                var record = new Record
                {
                    temperature = dto.temperature,
                    humidity = dto.humidity,
                    sound_level = dto.sound_level,
                    log_time = DateTime.UtcNow
                };

                await _context.AddAsync(record);
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateException)
            {
                return BadRequest("Database error");
            }
            catch (Exception)
            {
                return StatusCode(500, "Unexpected error");
            }

            return Ok();
        }

        [HttpGet("get/babyinfo")]
        public async Task<IActionResult> GetBabyInfo([FromQuery] int id)
        {

            try
            {
                var baby = await _context.BabyInfos
                            .Where(x => x.id == id)
                            .Select(x => new BabyInfoDto
                            {
                                name = x.name,
                                birth_date = x.birth_date,
                                notes = x.notes
                            }).FirstOrDefaultAsync();

                return Ok(baby);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal error occured.");
            }
        }

        [HttpGet("get/lastrecord")]
        public async Task<IActionResult> GetCurrentData()
        {
            try
            {
                var data = await _context.Records
                    .OrderByDescending(x => x.log_time)
                    .FirstOrDefaultAsync();

                return Ok(data);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal error occured.");
            }
        }


        [HttpGet("get/graphdata")]
        public async Task<IActionResult> GetGraphData()
        {
            try
            {
                var data = await _context.Records
                    .OrderByDescending(x => x.log_time)
                    .Take(30)
                    .ToListAsync();

                return Ok(data);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal error occured.");
            }
        }

    }
}
