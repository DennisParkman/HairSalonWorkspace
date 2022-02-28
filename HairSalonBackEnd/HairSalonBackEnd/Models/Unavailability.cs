using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// Author: George Garrett
    /// <summary>
    /// The appointment model class for appointment entries in the database.
    /// </summary>
    public class Unavailability
    {
        public enum TimePeriod
        {
            Once,
            Daily,
            Weekly,
            Monthly,
            Yearly
        }

        [Key]
        public int ID { get; set; }

        [ForeignKey("Stylist")]
        [Required]
        public int StylistID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        //ENUM: Once, Daily, weekly, monthly, yearly
        [Required]
        public TimePeriod Period { get; set; }
    }
}
