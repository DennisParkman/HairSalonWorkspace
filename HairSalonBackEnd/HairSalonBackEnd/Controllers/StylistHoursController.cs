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
    public class StylistHoursController : ControllerBase
    {
        /// <summary>
        /// something to do with error logging
        /// </summary>
        private readonly ILogger<StylistHoursController> _logger;

        /// <summary>
        /// constructor that sets the logger
        /// </summary>
        /// <param name="logger">the ILogger to set the logger to</param>
        public StylistHoursController(ILogger<StylistHoursController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds stylisthours to the SQLite Database
        /// </summary>
        /// <param name="stylisthours">the stylisthours to add</param>
        /// <returns>
        /// an action result containing the added stylisthours (with the database-assigned id) 
        /// or a BadRequest if there is a failure
        /// </returns>
        [HttpPost]
        public ActionResult<Task<StylistHours>> Post([FromBody] StylistHours stylisthours)
        {
            try
            {
                StylistHours newStylistHours = SQLiteDbUtility.AddStylistHours(stylisthours);
                return Ok(newStylistHours);
            }
            catch (Exception e)
            {
                return BadRequest("Could not add StylistHours: " + e.Message);
            };
        }

        /// <summary>
        /// Returns all stylisthours found in the SQLite Database
        /// </summary>
        /// <returns> all stylisthours found in the SQLite Database as an Enurable Array</returns>
        [HttpGet]
        public IEnumerable<StylistHours> Get()
        {
            return SQLiteDbUtility.GetAllStylistHours();
        }

        /// <summary>
        /// Deletes a stylisthours using id in the SQLite Database
        /// </summary>
        /// <param name="id">the id of the stylisthours to delete</param>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        {
            SQLiteDbUtility.DeleteStylistHours(id);
        }

        /// <summary>
        /// Updates a stylisthour in the SQLite Database
        /// </summary>
        /// <param name="stylisthour">the stylisthour to update</param>
        [HttpPut]
        public void Put([FromBody] StylistHours stylisthours)
        {
            SQLiteDbUtility.UpdateStylistHours(stylisthours);
        }

    }

}
