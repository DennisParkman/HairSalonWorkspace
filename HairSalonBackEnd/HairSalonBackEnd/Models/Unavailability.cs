using HairSalonBackEnd.WebModels;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
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

        public Unavailability(UnavailabilityWebModel unavailabilityWebModel)
        {
            this.StylistID = unavailabilityWebModel.StylistID;
            this.StartDate = unavailabilityWebModel.StartDate;
            this.EndDate = unavailabilityWebModel.EndDate;
            this.Period = unavailabilityWebModel.Period;
        }

        public Unavailability() { }

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
