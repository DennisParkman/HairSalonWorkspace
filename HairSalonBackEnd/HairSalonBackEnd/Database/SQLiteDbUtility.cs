using HairSalonBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace HairSalonBackEnd.Database
{
    public static class SQLiteDbUtility
    {
        private static SQLiteDbContext dbContext;

        private static bool isInitialized = false;

        public static void InitializeDB()
        {
            if(!isInitialized)
            {
                dbContext = new SQLiteDbContext();
                dbContext.Database.EnsureCreated();

                isInitialized = true;
            }
        }

        #region Stylist Methods
        /// <summary> A method for adding a stylist data type to the database.</summary>
        /// <param name="stylist"> A stylist object to add to the database.</param> 
        public static Stylist AddStylist(Stylist stylist)
        {
            dbContext.Stylists.Add(stylist);
            dbContext.SaveChanges();
            return stylist;
        }

        /// <summary> Returns all stylists found in the private inner class that contains the Database information as a list </summary>
        public static IEnumerable<Stylist> GetAllStylists()
        {
            return dbContext.Stylists.ToList();
        }

        /// <summary> Inserts update information for a stylist in the database </summary>
        public static void UpdateStylist(Stylist stylist)
        {
            //find stylist in database where stylists match
            var stylistEntry = dbContext.Stylists.Where(x => x.ID == stylist.ID).FirstOrDefault();

            //set stylist values
            stylistEntry.Name = stylist.Name;
            stylistEntry.Level = stylist.Level;
            stylistEntry.Bio = stylist.Bio;
            dbContext.SaveChanges();
        }
        /// <summary> A method for deleting a stylist data type from the database. </summary>
        /// <param name="stylist"> A stylist object that needs to be deleted. </param>
        public static void DeleteStylist(int id)
        { 
            var delStylist = dbContext.Stylists.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Stylists.Remove(delStylist);
            dbContext.SaveChanges();
        }

        #endregion

        #region Appointment Methods

        /// Author: George Garrett
        /// <summary>
        /// Methoding for adding an appointment record to the database.
        /// </summary>
        public static void AddAppointment(Appointment app)
        {
            dbContext.Appointments.Add(app);
        }

        /// Author: George Garrett
        /// <summary>
        /// Method for getting all the appointments.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Appointment> GetAllAppointments()
        {
            return dbContext.Appointments.ToList();
        }

        /// Author: George Garrett
        /// <summary>
        /// The Update method for updating an appointment record.
        /// </summary>
        /// <param name="app"></param>
        public static void UpdateAppointment(Appointment app)
        {
            // Get the record with same ID.
            var AppEntry = dbContext.Appointments.Where(x => x.ID == app.ID).FirstOrDefault();

            // Update Fields and Save
            AppEntry.StylistID = app.StylistID;
            AppEntry.Name = app.Name;
            AppEntry.Email = app.Email;
            AppEntry.Phone = app.Phone;
            AppEntry.Date = app.Date;
            AppEntry.DateCreated = app.DateCreated;
            AppEntry.Description = app.Description;
            dbContext.SaveChanges();
        }

        /// Author: George Garrett
        /// <summary>
        /// The delete method for removing an appointment record.
        /// </summary>
        public static void DeleteAppointment(int id)
        {
            var AppEntry = dbContext.Appointments.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Appointments.Remove(AppEntry);
            dbContext.SaveChanges();
        }

        #endregion

        #region Appointment Methods
        /// <summary> A method for adding an appointment data type to the database.</summary>
        /// <param name="appointment"> An appointment object to add to the database.</param> 
        public static void AddAppointment(Appointment appointment)
        {
            dbContext.Appointments.Add(appointment);
            dbContext.SaveChanges();
        }

        /// <summary> Returns all appointments found in the private inner class that contains the Database information as a list </summary>
        public static IEnumerable<Appointment> GetAllAppointments()
        {
            return dbContext.Appointments.ToList();
        }

        /// <summary> Inserts update information for an appointment in the database </summary>
        public static void UpdateAppointment(Appointment appointment)
        {
            //find an appointment in database where appointments match
            var appointmentEntry = dbContext.Appointments.Where(x => x.ID == Appointment.ID).FirstOrDefault();

            /*//set appointment values
            
            dbContext.SaveChanges();*/
        }
        /// <summary> A method for deleting an appointment data type from the database. </summary>
        /// <param name="id"> An appointment object's id that needs to be deleted. </param>
        public static void DeleteAppointment(int id)
        { 
            var delAppointment = dbContext.Appointments.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Appointments.Remove(delAppointment);
            dbContext.SaveChanges();
        }

        public static IEnumerable<Appointment> GetStylistAppointment(int id)
        { 
            /*Not sure if this seems right////
             * 
             * var appointmentEntry = dbContext.Appointments.Where(x => x.ID == id).FirstOrDefault();
            return dbContext.Appointments.appointmentEntry*/

        }
        #endregion

        private class SQLiteDbContext : DbContext
        {
            public DbSet<Stylist> Stylists { get; set; }
            public DbSet<Appointment> Appointments { get; set; }
            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                optionsBuilder.UseSqlite("FileName=Database/sqlite.db", option =>
                {
                    option.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
                });
                base.OnConfiguring(optionsBuilder);
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Stylist>().ToTable("Stylists", "localSchema");
                modelBuilder.Entity<Appointment>().ToTable("Appointments", "localSchema");
                base.OnModelCreating(modelBuilder);
            }
        }
    }
}