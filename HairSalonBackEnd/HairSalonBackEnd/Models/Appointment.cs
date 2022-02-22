using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    public class Appointment
    {
        /// <summary>
        /// Get/Set for primary key.
        /// </summary>
        [Key]
        public int ID { get; set; }

        /// <summary>
        /// Get/Set for foreign key pointing to stylist.
        /// </summary>
        [ForeignKey("Stylist")]
        public int StylistID { get; set; }

        /// <summary>
        /// Get/Set methods for Date db field.
        /// </summary>
        [Required]
        public string Date { get; set; }

        /// <summary>
        /// Get set for appointment description. Not required. Dunno what attribute goes here.
        /// </summary>
        public string Description { get; set; }
    }
}
