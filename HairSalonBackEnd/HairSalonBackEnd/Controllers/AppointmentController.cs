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
    public class AppointmentController : ControllerBase
    {
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(ILogger<AppointmentController> logger)
        {
            _logger = logger;
        }
        /// <summary> Adds appointment to the SQLite Database </summary> 
        [HttpPost]
        public ActionResult<Task<Appointment>> Post([FromBody] Appointment appointment)
        {
            try
            {
                Appointment newApp = SQLiteDbUtility.AddAppointment(appointment);
                return Ok(newApp);
            }
            catch (Exception e)
            {
                return BadRequest("Could not add Appointment: " + e.Message);
            };
        }

        /// <summary> Returns all appointments found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        public IEnumerable<Appointment> Get()
        {
            return SQLiteDbUtility.GetAllAppointments();
        }

        // <summary> Deletes an appointment using id in the SQLite Database </summary>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        {
            SQLiteDbUtility.DeleteAppointment(id);
        }

        /// <summary> Updates an appointment in the SQLite Database </summary>
        [HttpPut]
        public void Put([FromBody] Appointment appointment)
        {
            SQLiteDbUtility.UpdateAppointment(appointment);
        }

        /// <summary> Returns all appointments for a specific stylist found in the SQLite Database as an Enurable Array </summary>
        [HttpGet]
        [Route("{stylistID}")]
        public IEnumerable<Appointment> Get(int stylistID)
        {
            return SQLiteDbUtility.GetAppointmentsByStylist(stylistID);
        }
    }

}