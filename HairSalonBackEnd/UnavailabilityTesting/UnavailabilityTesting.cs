using Microsoft.VisualStudio.TestTools.UnitTesting;
using HairSalonBackEnd.Database;

namespace UnavailabilityTesting
{
    [TestClass]
    public class UnavailabilityControllerTesting
    {
        [TestMethod]
        public void THEtest()
        {
            SQLiteDbUtility.InitializeDB();
        }
    }
}
