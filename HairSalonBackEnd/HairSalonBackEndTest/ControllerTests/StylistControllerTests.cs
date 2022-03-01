using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Microsoft.Extensions.Logging;

using HairSalonBackEnd.Controllers;
using HairSalonBackEnd.Models;
using HairSalonBackEnd.Database;

namespace HairSalonBackEndTest
{
    [TestClass]
    public class StylistControllerTests
    {
        private Stylist insertStylist = new Stylist
        {
            ID = 1,
            Name = "test",
            Level = 1,
            Bio = "I'm a test"
        };

        private const string TEST_DB_NAME = "test-sqlite.db";

        /// <summary>
        /// sets the <c>SQLiteDbUtility</c> to affect the test database instead of the production db
        /// </summary>
        private void SetupDB()
        {
            SQLiteDbUtility.SetLoadDb(TEST_DB_NAME);
        }

        /// <summary>
        /// clears the stylist database of all entries
        /// <throws>NotImplementedException because it's not implemented yet</throws>
        /// </summary>
        private void ClearDB()
        {
            if (SQLiteDbUtility.GetLoadDb().Equals(TEST_DB_NAME))
            {
                SQLiteDbUtility.SetLoadDb(TEST_DB_NAME);
            }

            //this is actually probably a bad idea right now
            throw new NotImplementedException("Not implemented yet, since clearing the database is a bad idea until we're sure what db we're clearing");
        }

        /// <summary>
        /// tests StylistController.Post(stylist: Stylist) to see that it properly sends a stylist object
        /// </summary>
        [TestMethod]
        public void TestPost()
        {
            Console.WriteLine("TestPost");//debug
            Console.Read();//debug
            /*
            SetupDB();
            //it should be fine; we never use the logger. Right?
            ILogger<StylistController> test_logger =
                LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<StylistController>();

            var controller = new StylistController(test_logger);
            
            //insert the test stylist
            controller.Post(insertStylist);

            //get the stylists
            var stylists = controller.Get();

            //test that insertStylist is in stylists
            CollectionAssert.Contains((System.Collections.ICollection)stylists, insertStylist);
            */
        }


    }
}
