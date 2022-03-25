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
    public class StylistController : ControllerBase
    {
        /// <summary>
        /// something to do with error logging
        /// </summary>
        private readonly ILogger<StylistController> _logger;

        /// <summary>
        /// constructor that sets the logger
        /// </summary>
        /// <param name="logger">the ILogger to set the logger to</param>
        public StylistController(ILogger<StylistController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds stylist to the SQLite Database 
        /// </summary>
        /// <param name="stylist">the stylist to add</param>
        /// <returns>
        /// an action result containing the added stylist (with the database-assigned id) 
        /// or a BadRequest if there is a failure
        /// </returns>
        [HttpPost]
        public ActionResult<Task<Stylist>> Post([FromBody] Stylist stylist)
        {
            try
            {
                Stylist newStylist = SQLiteDbUtility.AddStylist(stylist);
                return Ok(newStylist);
            }
            catch(Exception e)
            {
                return BadRequest("Could not add Stylist: " + e.Message);
            }
        }

        /// <summary> 
        /// Returns all stylists found in the SQLite Database as an Enurable Array 
        /// </summary>
        [HttpGet]
        public IEnumerable<Stylist> Get()
        {
            return SQLiteDbUtility.GetAllStylists();
        }

        /// <summary>
        /// Deletes a stylist using id in the SQLite Database
        /// </summary>
        /// <param name="id">the id of the stylist to delete</param>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        { 
            SQLiteDbUtility.DeleteStylist(id);
        }

        /// <summary>
        /// Updates a stylist in the SQLite Database
        /// </summary>
        /// <param name="stylist">the stylist to update</param>
        [HttpPut]
        public void Put([FromBody] Stylist stylist)
        {
            SQLiteDbUtility.UpdateStylist(stylist);
        }
    }

    
}
