using HairSalonBackEnd.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static HairSalonBackEnd.Models.Unavailability;

namespace HairSalonBackEnd.WebModels
{
    /// <summary>
    /// The unavailability web model class used for joining data from the
    /// unavailability table in the database, and the stylist table.
    /// Holds information about when a given stylist is not available for 
    /// an appointment and the stylist's name.
    /// </summary>
    public class UnavailabilityWebModel
    {
        public UnavailabilityWebModel(Unavailability unavailability, Stylist? stylist = null)
        {
            this.ID = unavailability.ID;
            this.StylistID = unavailability.StylistID;
            this.StylistName = stylist?.Name;
            this.StartDate = unavailability.StartDate;
            this.EndDate = unavailability.EndDate;
            this.Period = unavailability.Period;
        }

        /// <summary>
        /// default constructor
        /// </summary>
        public UnavailabilityWebModel() { }

        /// <summary>
        /// primary key/ID of Unavailability entry
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// foreign key; ID of the stylist associated with this unavailability
        /// </summary>
        public int StylistID { get; set; }

        /// <summary>
        /// name of the associated stylist
        /// </summary>
        public string StylistName { get; set; }

        /// <summary>
        /// date/time at which the unavailability starts
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// date/time at which the unavailability ends
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Period at which the unavailability repeats.
        /// can be one of: Once, Daily, Weekly, Monthly, Yearly
        /// see definition of TimePeriod enum
        /// </summary>
        public TimePeriod Period { get; set; }
    }
}
