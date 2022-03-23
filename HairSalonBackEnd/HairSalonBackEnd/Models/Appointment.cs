using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// <summary>
    /// The appointment model class for appointment entries in the database.
    /// Holds data assoicated with an appointment
    /// </summary>
    public class Appointment
    {
        /// <summary>
        /// Get/Set for the primary key for the appointment record.
        /// </summary>
        [Key]
        public int ID { get; set; }

        /// <summary>
        /// Get/Set for Stylist with whom the appointment was made.
        /// </summary>
        [ForeignKey("Stylist")]
        public int StylistID { get; set; }

        /// <summary>
        /// Get/Set methods for the Name of the client who made the appointment
        /// </summary>
        [Required]
        [Column(TypeName = "navarchar(100)")]
        public string Name { get; set; }

        /// <summary>
        /// Get/Set methods for the email of the client who made the appointment. Optional.
        /// </summary>
        [Column(TypeName = "navarchar(100)")]
        public string Email { get; set; }

        /// <summary>
        /// Get/Set methods for the phone number of the client who made the appointment. Optional.
        /// </summary>
        [Column(TypeName = "navarchar(10)")]
        public string Phone { get; set; }

        /// <summary>
        /// Get/Set methods for the Date/time of the appointment.
        /// </summary>
        [Required]
        public DateTime Date { get; set; }

        /// <summary>
        /// Get/Set methods for the Date/time the appiontment was created.
        /// </summary>
        [Required]
        public DateTime DateCreated { get; set; }

        /// <summary>
        /// Get set for appointment description. Optional.
        /// </summary>
        public string Description { get; set; }
    }
}
