using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalonBackEnd.Models
{
    /// <summary>
    /// The user model class for users entries in the database.
    /// Holds data assoicated with an user for the website and 
    /// allows for access control through roles
    /// </summary>
    public class User
    {

        /// <summary>
        /// an enum data type for defining the role field of the user.
        /// An user will be given access control based on this role
        /// </summary>
        public enum UserRole
        {
            Manager,
            Stylist,
            Receptionist
        }

        /// <summary>
        /// primary key/ID of user entry
        /// </summary>
        [Key]
        public int ID { get; set; }

        /// <summary>
        /// Get/Set for the username of a given user on the website.
        /// </summary>
        [Required]
        [Column(TypeName = "navarchar(50)")]
        public string Username { get; set; }

        /// <summary>
        /// Get/Set for the password of a given user on the website.
        /// </summary>
        [Required]
        [Column(TypeName = "navarchar(100)")]
        public string Password { get; set; }

        /// <summary>
        /// Role that determines access control on the website
        /// can be one of: Manager, Stylist, Receptionist
        /// see definition of UserRole enum
        /// </summary>
        [Required]
        public UserRole Role { get; set; }
    }
}
