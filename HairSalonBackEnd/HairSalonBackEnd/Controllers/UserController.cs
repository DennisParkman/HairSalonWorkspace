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
    public class UserController : ControllerBase
    {
        /// <summary>
        /// something to do with error logging
        /// </summary>
        private readonly ILogger<UserController> _logger;

        /// <summary>
        /// constructor that sets the logger
        /// </summary>
        /// <param name="logger">the ILogger to set the logger to</param>
        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds user to the SQLite Database
        /// </summary>
        /// <param name="user">the user to add</param>
        /// <returns>
        /// an action result containing the added user
        /// or a BadRequest if there is a failure
        /// </returns>
        [HttpPost]
        public ActionResult<Task<User>> Post([FromBody] User user)
        {
            try
            {
                User newUser = SQLiteDbUtility.AddUser(user);
                return Ok(newUser);
            }
            catch (Exception e)
            {
                return BadRequest("Could not add User: " + e.Message);
            };
        }

        /// <summary>
        /// Returns all users found in the SQLite Database
        /// </summary>
        /// <returns> all users found in the SQLite Database as an Enurable Array</returns>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return SQLiteDbUtility.GetAllUsers();
        }

        /// <summary>
        /// Deletes an user using id in the SQLite Database
        /// </summary>
        /// <param name="id">the id of the user to delete</param>
        [HttpDelete]
        [Route("{username}")]
        public void Delete(string username)
        {
            SQLiteDbUtility.DeleteUser(username);
        }

        /// <summary>
        /// Updates an user in the SQLite Database
        /// </summary>
        /// <param name="user">the user to update</param>
        [HttpPut]
        public void Put([FromBody] User user)
        {
            SQLiteDbUtility.UpdateUser(user);
        }

    }

}