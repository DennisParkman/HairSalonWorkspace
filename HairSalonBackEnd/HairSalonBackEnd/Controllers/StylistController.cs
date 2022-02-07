/*
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HairSalonBackEnd.Controllers
{
    public class StylistController
    {
    }
}
*/

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
        private readonly ILogger<WeatherForecastController> _logger;

        public StylistController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Stylist> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new Stylist
            {
                
            })
            .ToArray();
        }

        [HttpPost]
        public void Post([FromBody] Stylist stylist)
        {
            Console.WriteLine(stylist);
        }
    }
}
