using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// <summary>
    /// The model for adding stylist work hours into the database.
    /// </summary>
    public class StylistHours
    {
        /// <summary>
        /// A enum for each day of the week, to be used as an attribute for the stylisthours table
        /// </summary>
        public enum WeekDay
        {
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday
        }
        
        /// <summary>
        /// The primary key for this datase entry.
        /// </summary>
        [Key]
        public int ID { get; set; }

        /// <summary>
        /// A foreign key linking to a stylist record.
        /// </summary>
        [ForeignKey("Stylist")]
        public int StylistID { get; set; }

        /// <summary>
        /// Denotes what day of the week this work hour entry is for.
        /// </summary>
        [Required]
        public WeekDay Day { get; set; }

        /// <summary>
        /// Denotes the start time for this work day
        /// </summary>
        [Required]
        public string StartTime { get; set; }

        /// <summary>
        /// Denotes the end time for this work day
        /// </summary>
        [Required]
        public string EndTime { get; set; }
    }
}
