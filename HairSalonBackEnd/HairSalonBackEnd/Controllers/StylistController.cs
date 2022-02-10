using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//do we need a using statement?
using HairSalonBackEnd.Models;
using HairSalonBackEnd.Database;

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

        /// Authors: James Pangia and Jake Morris
        /// <summary> Returns all stylists found in the SQLite Database as an Enurable Array </summary>

        [HttpGet]
        public IEnumerable<Stylist> Get()
        {
            return SQLiteDbUtility.GetAllStylists();
        }
    }

    
}
