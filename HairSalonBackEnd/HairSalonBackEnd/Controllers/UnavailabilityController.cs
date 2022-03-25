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
        /// <summary>
        /// something to do with error logging
        /// </summary>
        private readonly ILogger<UnavailabilityController> _logger;

        /// <summary>
        /// constructor that sets the logger
        /// </summary>
        /// <param name="logger">the ILogger to set the logger to</param>
        public UnavailabilityController(ILogger<UnavailabilityController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds unavailability to the SQLite Database 
        /// </summary>
        /// <param name="unavailability">the unavailability to add as an UnavailabilityWebModel</param>
        /// <returns>
        /// an action result containing the added unavailability (with the database-assigned id) 
        /// as an UnavailabilityWebModel or a BadRequest if there is a failure
        /// </returns>
        [HttpPost]
        public ActionResult<Task<UnavailabilityWebModel>> Post([FromBody] UnavailabilityWebModel unavailability)
        {
            try
            {
                Unavailability newUnavailability = SQLiteDbUtility.AddUnavailability(new Unavailability(unavailability));
                return Ok(new UnavailabilityWebModel(newUnavailability));
            }
            catch (Exception e)
            {
                return BadRequest("Could not add unavailability: " + e.Message);
            }
        }

        /// <summary> 
        /// Returns all unavailabilities found in the SQLite Database as an Enurable 
        /// Array of UnavailabilityWebModels
        /// </summary>
        [HttpGet]
        public IEnumerable<UnavailabilityWebModel> Get()
        {
            IEnumerable<Unavailability> unavailabilities = SQLiteDbUtility.GetAllUnavailabilities();
            var returnUnavailabilities = unavailabilities.Select(u => new UnavailabilityWebModel(u, SQLiteDbUtility.GetStylist(u.StylistID)));
            return returnUnavailabilities;
        }

        /// <summary>
        /// returns all unavailailities associated with the passed stylistID.
        /// </summary>
        /// <param name="stylistID"> the stylist id to find all unavailabilities for</param>
        /// <returns>
        /// all unavailabilities with the passed stylistID as an enumerable array of 
        /// UnavailabilityWebModels
        /// </returns>
        [HttpGet]
        [Route("{stylistID}")]
        public IEnumerable<UnavailabilityWebModel> Get(int stylistID)
        {
            IEnumerable<Unavailability> unavailabilities = SQLiteDbUtility.GetAllUnavailabilitiesByStylist(stylistID);
            var returnUnavailabilities = unavailabilities.Select(u => new UnavailabilityWebModel(u, SQLiteDbUtility.GetStylist(u.StylistID)));
            return returnUnavailabilities;
        }

        /// <summary>
        /// Deletes a Unavailability using id in the SQLite Database
        /// </summary>
        /// <param name="id">the id of the unavailability to delete</param>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        {
            SQLiteDbUtility.DeleteUnavailability(id);
        }

        /// <summary>
        /// Updates a Unavailability in the SQLite Database
        /// </summary>
        /// <param name="unavailability">the unavailability to update as an UnavailabilityWebModel</param>
        [HttpPut]
        public void Put([FromBody] UnavailabilityWebModel unavailability)
        {
            SQLiteDbUtility.UpdateUnavailability(new Unavailability(unavailability));
        }
    }


}
