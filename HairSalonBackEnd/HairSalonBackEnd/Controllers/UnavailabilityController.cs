using HairSalonBackEnd.Database;
using HairSalonBackEnd.Models;
using HairSalonBackEnd.WebModels;
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
        public ActionResult<Task<UnavailabilityWebModel>> Post([FromBody] Unavailability unavailability)
        {
            try
            {
                Unavailability newUnavailability = SQLiteDbUtility.AddUnavailability(unavailability);
                return Ok(new UnavailabilityWebModel(newUnavailability));
            }
            catch (Exception e)
            {
                return BadRequest("Could not add unavailability: " + e.Message);
            }
        }

        /// <summary> Returns all Unavailabilitys found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        public IEnumerable<UnavailabilityWebModel> Get()
        {
            IEnumerable<Unavailability> unavailabilities = SQLiteDbUtility.GetAllUnavailabilities();
            var returnUnavailabilities = unavailabilities.Select(u => new UnavailabilityWebModel(u, SQLiteDbUtility.GetStylist(u.StylistID)));
            return returnUnavailabilities;
        }

        /// <summary> Returns all Unavailabilitys found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        [Route("{stylistID}")]
        public IEnumerable<UnavailabilityWebModel> Get(int stylistID)
        {
            IEnumerable<Unavailability> unavailabilities = SQLiteDbUtility.GetAllUnavailabilitiesByStylist(stylistID);
            var returnUnavailabilities = unavailabilities.Select(u => new UnavailabilityWebModel(u, SQLiteDbUtility.GetStylist(u.StylistID)));
            return returnUnavailabilities;
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
        public void Put([FromBody] UnavailabilityWebModel unavailability)
        {
            SQLiteDbUtility.UpdateUnavailability(new Unavailability(unavailability));
        }
    }


}
