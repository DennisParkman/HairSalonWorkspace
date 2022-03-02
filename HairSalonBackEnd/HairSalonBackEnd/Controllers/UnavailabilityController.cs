using HairSalonBackEnd.Database;
using HairSalonBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HairSalonBackEnd.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UnavailabilityController : ControllerBase
    {
        private readonly ILogger<UnavailabilityController> _logger;

        public UnavailabilityController(ILogger<UnavailabilityController> logger)
        {
            _logger = logger;
        }

        /// <summary> Adds Unavailability to the SQLite Database </summary> 
        [HttpPost]
        public ActionResult<Task<Unavailability>> Post([FromBody] Unavailability unavailability)
        {
            try
            {
                Unavailability newUnavailability = SQLiteDbUtility.AddUnavailability(unavailability);
                return Ok(newUnavailability);
            }
            catch (Exception e)
            {
                return BadRequest("Could not add unavailability: " + e.Message);
            }
        }

        /// <summary> Returns all Unavailabilitys found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        public IEnumerable<Unavailability> Get()
        {
            return SQLiteDbUtility.GetAllUnavailabilities();
        }

        /// <summary> Returns all Unavailabilitys found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        [Route("{stylistID}")]
        public IEnumerable<Unavailability> Get(int stylistID)
        {
            return SQLiteDbUtility.GetAllUnavailabilitiesByStylist(stylistID);
        }

        // <summary> Deletes a Unavailability using id in the SQLite Database </summary>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        {
            SQLiteDbUtility.DeleteUnavailability(id);
        }

        /// <summary> Updates a Unavailability in the SQLite Database </summary>
        [HttpPut]
        public void Put([FromBody] Unavailability unavailability)
        {
            SQLiteDbUtility.UpdateUnavailability(unavailability);
        }

        /// <summary> Returns all Unavailabilitys found in the SQLite Database as an Enurable Array </summary>
        [HttpGet("{id}")]
        public IEnumerable<Unavailability> Get(int id)
        {
            return SQLiteDbUtility.GetAllUnavailabilitiesByStylist(id);
        }
    }


}
