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

        [HttpGet]
        public IEnumerable<Stylist> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new Stylist
            {
                ID = rng.Next(0, 5),
                Name = "Default",
                Level = rng.Next(1,3),
                Bio = "This is where a cool fact would go!"
            })
            .ToArray();
        }
    }

    
}
