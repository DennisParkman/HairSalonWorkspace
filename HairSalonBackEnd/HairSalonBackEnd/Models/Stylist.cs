using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    public class Stylist
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }

        [Required]
        public int Level { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(1000)")]
        public string Bio { get; set; }
    }
}
