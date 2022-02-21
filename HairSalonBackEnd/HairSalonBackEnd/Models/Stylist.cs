using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// <summary> A stylist class modeling the stylist data type entered
    /// into the database. </summary>
    public class Stylist
    {
        /// <summary> The get/set methods for the stylist primary key.</summary>
        [Key]
        public int ID { get; set; }

        /// <summary> The get/set methods for a stylist entry name. This field
        /// must be present when adding a new stylist.</summary>
        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }

        /// <summary> The get/set methods for a stylist level. This field
        /// must be present when adding a new stylist.</summary>
        [Required]
        public int Level { get; set; }

        /// <summary> The get/set methods for a stylist description. This field
        /// must be present when adding a new stylist.</summary>
        [Required]
        [Column(TypeName = "nvarchar(1000)")]
        public string Bio { get; set; }
    }
}
