﻿using Microsoft.AspNetCore.Mvc;
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

    }
}