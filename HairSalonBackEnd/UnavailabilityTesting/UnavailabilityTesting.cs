using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Extensions.Logging;
using HairSalonBackEnd.Database;
using HairSalonBackEnd.Controllers;
using HairSalonBackEnd.Models;
using HairSalonBackEnd.WebModels;

namespace UnavailabilityTesting
{
    [TestClass]
    public class UnavailabilityControllerTesting
    {
        private UnavailabilityController Controller = null;
        
        // Cleanup the database by removing its right to exist.
        // Handled by destructor so that nobody forgets.
        [TestCleanup]
        public void RemoveDatabase()
        {
            // Note: When a database is built for the test case its put in the bin folder, must be
            // deleted from there as well. The following if statement must be present to 
            // remove test database.
            SQLiteDbUtility.UninitializeDB();
            Controller = null;
            if (File.Exists("../sqliteTest.db"))
            {
                File.Delete("../sqliteTest.db");
            }
        }

        // Starts the database and sets a global access controller object.
        [TestInitialize]
        public void startDatabase()
        {
            if (Controller != null)
            {
                return;
            }

            // Initialize the database
            SQLiteDbUtility.InitializeDB();

            // Create logger
            ILogger<UnavailabilityController> test_logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<UnavailabilityController>();

            // Create Controller
            Controller = new UnavailabilityController(test_logger);
        }

        // Get a record from the database using the numeric id of the record.
        // Returns null if no matching record exists.
        private UnavailabilityWebModel getFromID(IEnumerable<UnavailabilityWebModel> models, int id)
        {
            foreach (UnavailabilityWebModel mod in models)
            {
                if (mod.ID == id)
                {
                    return mod;
                }
            }
            return null;
        }
        
        [TestMethod]
        public void verifyPeriod()
        {
            // Create unavailability object and add it to the database.
            UnavailabilityWebModel theModel = new UnavailabilityWebModel();
            theModel.ID = 1;
            theModel.Period = Unavailability.TimePeriod.Weekly;
            Controller.Post(theModel);

            // Get the same model from the database.
            UnavailabilityWebModel temp = getFromID(Controller.Get(), theModel.ID);

            // Assert.AreEqual("James Pangia", "BASED");
            // Assert that the period retreived is correct.
            Assert.AreEqual(temp.Period, theModel.Period);
        }

        [TestMethod]
        public void verifyStartDate()
        {
            // Create unavailability object and add it to the database.
            UnavailabilityWebModel theModel = new UnavailabilityWebModel();
            theModel.ID = 1;
            theModel.StartDate = new DateTime(2022, 04, 17); // <-- George's bday
            Controller.Post(theModel);

            // Get the same model from the database.
            UnavailabilityWebModel temp = getFromID(Controller.Get(), theModel.ID);

            // Assert.AreEqual("James Pangia", "BASED");
            // Assert that the period retreived is correct.
            Assert.AreEqual(temp.StartDate, theModel.StartDate);
        }

        [TestMethod]
        public void verifyEndDate()
        {
            // Create unavailability object and add it to the database.
            UnavailabilityWebModel theModel = new UnavailabilityWebModel();
            theModel.ID = 1;
            theModel.EndDate = new DateTime(2022, 04, 17); // <-- George's bday
            Controller.Post(theModel);

            // Get the same model from the database.
            UnavailabilityWebModel temp = getFromID(Controller.Get(), theModel.ID);

            // Assert.AreEqual("James Pangia", "BASED");
            // Assert that the period retreived is correct.
            Assert.AreEqual(temp.EndDate, theModel.EndDate);
        }
    }
}
