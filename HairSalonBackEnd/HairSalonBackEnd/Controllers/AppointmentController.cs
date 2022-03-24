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
        /// <summary>
        /// something to do with error logging
        /// </summary>
        private readonly ILogger<AppointmentController> _logger;

        /// <summary>
        /// constructor that sets the logger
        /// </summary>
        /// <param name="logger">the ILogger to set the logger to</param>
        public AppointmentController(ILogger<AppointmentController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds appointment to the SQLite Database
        /// </summary>
        /// <param name="appointment">the appointment to add</param>
        /// <returns>
        /// an action result containing the added appointment (with the database-assigned id) 
        /// or a BadRequest if there is a failure
        /// </returns>
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

        /// <summary>
        /// Returns all appointments found in the SQLite Database
        /// </summary>
        /// <returns> all appointments found in the SQLite Database as an Enurable Array</returns>
        [HttpGet]
        public IEnumerable<Appointment> Get()
        {
            return SQLiteDbUtility.GetAllAppointments();
        }

        /// <summary>
        /// Deletes an appointment using id in the SQLite Database
        /// </summary>
        /// <param name="id">the id of the appointment to delete</param>
        [HttpDelete]
        [Route("{id}")]
        public void Delete(int id)
        {
            SQLiteDbUtility.DeleteAppointment(id);
        }

        /// <summary>
        /// Updates an appointment in the SQLite Database
        /// </summary>
        /// <param name="appointment">the appointment to update</param>
        [HttpPut]
        public void Put([FromBody] Appointment appointment)
        {
            SQLiteDbUtility.UpdateAppointment(appointment);
        }

        /// <summary>
        /// Returns all appointments for a specific stylist found in the SQLite Database
        /// </summary>
        /// <param name="stylistID"> the id of the stylist whose appointments are to be returned</param>
        /// <returns>all appointments for the specified stylist as an Enurable Array</returns>
        [HttpGet]
        [Route("{stylistID}")]
        public IEnumerable<Appointment> Get(int stylistID)
        {
            return SQLiteDbUtility.GetAppointmentsByStylist(stylistID);
        }
    }

}