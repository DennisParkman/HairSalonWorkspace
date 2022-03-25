using HairSalonBackEnd.WebModels;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// <summary>
    /// The unavailability model class for unavailability entries in the database.
    /// Holds information about when a given stylist is not available for an appointment
    /// </summary>
    public class Unavailability
    {
        /// <summary>
        /// an enum data type for defining the period field of the unavailability.
        /// An unavailability will be able to repeat on one of these periods
        /// </summary>
        public enum TimePeriod
        {
            Once,
            Daily,
            Weekly,
            Monthly,
            Yearly
        }

        /// <summary>
        /// constructor for converting an UnavailabilityWebModel object into an Unavailability object
        /// </summary>
        /// <param name="unavailabilityWebModel"> the UnavailabilityWebModel to pull the unavailability data from
        /// </param>
        public Unavailability(UnavailabilityWebModel unavailabilityWebModel)
        {
            this.ID = unavailabilityWebModel.ID;
            this.StylistID = unavailabilityWebModel.StylistID;
            this.StartDate = unavailabilityWebModel.StartDate;
            this.EndDate = unavailabilityWebModel.EndDate;
            this.Period = unavailabilityWebModel.Period;
        }

        /// <summary>
        /// default constructor
        /// </summary>
        public Unavailability() { }

        /// <summary>
        /// primary key/ID of Unavailability entry
        /// </summary>
        [Key]
        public int ID { get; set; }

        /// <summary>
        /// foreign key; ID of the stylist associated with this unavailability
        /// </summary>
        [ForeignKey("Stylist")]
        [Required]
        public int StylistID { get; set; }

        /// <summary>
        /// date/time at which the unavailability starts
        /// </summary>
        [Required]
        public DateTime StartDate { get; set; }

        /// <summary>
        /// date/time at which the unavailability ends
        /// </summary>
        [Required]
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Period at which the unavailability repeats.
        /// can be one of: Once, Daily, Weekly, Monthly, Yearly
        /// see definition of TimePeriod enum
        /// </summary>
        [Required]
        public TimePeriod Period { get; set; }
    }
}
