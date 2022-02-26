using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

using HairSalonBackEnd.Controllers;
using Microsoft.Extensions.Logging;
using HairSalonBackEnd.Models;

namespace HairSalonBackEndTest
{
    [TestClass]
    public class StylistControllerTests
    {
        /// <summary>
        /// tests StylistController.Post(stylist: Stylist) to see that it properly sends a stylist object
        /// </summary>
        [TestMethod]
        public void TestPost()
        {
            //it should be fine; we never use the logger. Right?
            ILogger<StylistController> test_logger =
                LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<StylistController>();

            var controller = new StylistController(test_logger);
            Stylist s = new Stylist
            {
                ID = 1,
                Name = "test",
                Level = 1,
                Bio = "I'm a test"
            };

            controller.Post(s); //but how can I intercept the SQLiteDbUtility.AddStylist call in the Post function so an insert isn't actually performed?

            //then test that ... a parameter is passed to a method....
        }


    }
}
