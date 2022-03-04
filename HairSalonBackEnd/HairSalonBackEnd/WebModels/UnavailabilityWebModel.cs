using HairSalonBackEnd.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static HairSalonBackEnd.Models.Unavailability;

namespace HairSalonBackEnd.WebModels
{
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

        public int ID { get; set; }

        public int StylistID { get; set; }

        public string StylistName { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public TimePeriod Period { get; set; }
    }
}
