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
        private readonly ILogger<StylistController> _logger;

        public StylistController(ILogger<StylistController> logger)
        {
            _logger = logger;
        }

	    /// <summary> Adds stylist to the SQLite Database </summary> 
        [HttpPost]
        public void Post([FromBody] Stylist stylist)
        {
            SQLiteDbUtility.AddStylist(stylist);
        }

        /// <summary> Returns all stylists found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        public IEnumerable<Stylist> Get()
        {
            return SQLiteDbUtility.GetAllStylists();
        }

        // <summary> Deletes a stylist in the SQLite Database </summary>
        [HttpDelete]
        public void Delete(Stylist stylist)
        { 
            SQLiteDbUtility.DeleteStylist(stylist);
        }
    }

    
}
