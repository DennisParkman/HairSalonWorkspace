using HairSalonBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Threading;

namespace HairSalonBackEnd.Database
{
    public static class SQLiteDbUtility
    {
        /// <summary>
        /// DbContext for performing query operations on the database.
        /// It contains the database tables in a list-like format
        /// </summary>
        private static SQLiteDbContext dbContext;

        /// <summary>
        /// flag for if the database has been initialized
        /// </summary>
        private static bool isInitialized = false;

        /// <summary>
        /// semaphore used to lock db access; 
        /// prevents problems when a webpage needs to make multiple db calls while loading
        /// </summary>
        private static Semaphore dbAccess;

        /// <summary>
        /// initialize the database if it is not initialized
        /// </summary>
        public static void InitializeDB()
        {
            if(!isInitialized)
            {
                dbContext = new SQLiteDbContext();
                dbContext.Database.EnsureCreated();

                dbAccess = new Semaphore(1, 1);

                isInitialized = true;
            }
        }

        #region Stylist Methods
        /// <summary> 
        /// A method for adding a stylist data type to the database.
        /// locks the database until completed
        /// </summary>
        /// <param name="stylist"> A stylist object to add to the database.</param> 
        public static Stylist AddStylist(Stylist stylist)
        {
            dbAccess.WaitOne();
            dbContext.Stylists.Add(stylist);
            dbContext.SaveChanges();
            dbAccess.Release();
            return stylist;
        }

        /// <summary>
        /// returns the first stylist whose id matches the passed id.
        /// locks the database until completed
        /// </summary>
        /// <param name="id">the id to search for</param>
        /// <returns>the first stylist that has the passed id </returns>
        public static Stylist GetStylist(int id)
        {
            dbAccess.WaitOne();
            Stylist stylist = dbContext.Stylists.Where(stylist => stylist.ID == id).FirstOrDefault();
            dbAccess.Release();
            return stylist;
        }

        /// <summary>
        /// Returns all stylists found in the Database
        /// locks the database until completed
        /// </summary>
        /// <returns>all stylists found in the Database </returns>
        public static IEnumerable<Stylist> GetAllStylists()
        {
            dbAccess.WaitOne();
            IEnumerable<Stylist> stylists = dbContext.Stylists.ToList();
            dbAccess.Release();
            return stylists;
        }

        /// <summary>
        /// Inserts update information for a stylist in the database 
        /// locks the database until completed
        /// </summary>
        /// <param name="stylist"> the stylist to update</param>
        public static void UpdateStylist(Stylist stylist)
        {
            dbAccess.WaitOne();
            //find stylist in database where stylists match
            var stylistEntry = dbContext.Stylists.Where(x => x.ID == stylist.ID).FirstOrDefault();

            //set stylist values
            stylistEntry.Name = stylist.Name;
            stylistEntry.Level = stylist.Level;
            stylistEntry.Bio = stylist.Bio;
            stylistEntry.StylistImage = stylist.StylistImage;
            Console.WriteLine(stylist.StylistImage);

            dbContext.SaveChanges();
            dbAccess.Release();
        }

        /// <summary> 
        /// A method for deleting a stylist data type from the database. 
        /// locks the database until completed
        /// </summary>
        /// <param name="stylist"> A stylist object that needs to be deleted. </param>
        public static void DeleteStylist(int id)
        {
            dbAccess.WaitOne();
            var delStylist = dbContext.Stylists.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Stylists.Remove(delStylist);
            dbContext.SaveChanges();
            dbAccess.Release();
        }

        #endregion

        #region Appointment Methods

        /// <summary>
        /// Method for adding an appointment record to the database.
        /// locks the database until completed
        /// </summary>
        /// <param name="app">the appointment to add</param>
        /// <returns>the appointment added with automatically assigned id</returns>
        public static Appointment AddAppointment(Appointment app)
        {
            dbAccess.WaitOne();

            dbContext.Appointments.Add(app);
            dbContext.SaveChanges();

            dbAccess.Release();
            return app;
        }

        /// <summary>
        /// Method for getting all the appointments.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Appointment> GetAllAppointments()
        {
            dbAccess.WaitOne();

            IEnumerable<Appointment> appointments = dbContext.Appointments.ToList();

            dbAccess.Release();

            return appointments;
        }

        /// <summary>
        /// The Update method for updating an appointment record.
        /// </summary>
        /// <param name="app"></param>
        public static void UpdateAppointment(Appointment app)
        {
            dbAccess.WaitOne();

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

            dbAccess.Release();
        }

        /// <summary>
        /// The delete method for removing an appointment record.
        /// </summary>
        public static void DeleteAppointment(int id)
        {
            dbAccess.WaitOne();
            var AppEntry = dbContext.Appointments.Where(x => x.ID == id).FirstOrDefault();
            dbContext.Appointments.Remove(AppEntry);
            dbContext.SaveChanges();
            dbAccess.Release();
        }

        public static IEnumerable<Appointment> GetAppointmentsByStylist(int stylistID)
        {
            dbAccess.WaitOne();
            var stylistAppointments = dbContext.Appointments.Where(x => x.StylistID == stylistID);
            dbAccess.Release();
            return stylistAppointments;
        }
        #endregion

        #region Unavailability Methods

        public static Unavailability AddUnavailability(Unavailability unavailability)
        {
            dbAccess.WaitOne();
            dbContext.Unavailabilities.Add(unavailability);
            dbContext.SaveChanges();
            dbAccess.Release();
            return unavailability;
        }

        public static IEnumerable<Unavailability> GetAllUnavailabilities()
        {
            dbAccess.WaitOne();
            IEnumerable<Unavailability> unavailabilities = dbContext.Unavailabilities.ToList();
            dbAccess.Release();
            return unavailabilities;
        }

        public static void UpdateUnavailability(Unavailability unavailability)
        {
            dbAccess.WaitOne();
            var unavailabilityEntry = dbContext.Unavailabilities.Where(x => x.ID == unavailability.ID).FirstOrDefault();

            unavailabilityEntry.StylistID = unavailability.StylistID;
            unavailabilityEntry.StartDate = unavailability.StartDate;
            unavailabilityEntry.EndDate = unavailability.EndDate;
            unavailabilityEntry.Period = unavailability.Period;

            dbContext.SaveChanges();
            dbAccess.Release();
        }

        public static void DeleteUnavailability(int id)
        {
            dbAccess.WaitOne();
            var delUnavailability = dbContext.Unavailabilities.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Unavailabilities.Remove(delUnavailability);
            dbContext.SaveChanges();
            dbAccess.Release();
        }

        public static IEnumerable<Unavailability> GetAllUnavailabilitiesByStylist(int stylistID)
        {
            dbAccess.WaitOne();
            IEnumerable<Unavailability> unavailabilities = dbContext.Unavailabilities.Where(x => x.StylistID == stylistID).ToList();
            dbAccess.Release();
            return unavailabilities;
        }

        #endregion

        private class SQLiteDbContext : DbContext
        {
            public DbSet<Stylist> Stylists { get; set; }
            public DbSet<Appointment> Appointments { get; set; }
            public DbSet<Unavailability> Unavailabilities { get; set; }
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

                modelBuilder.Entity<Unavailability>().ToTable("Unavailabilities", "localSchema");
                modelBuilder.Entity<Unavailability>().Property(u => u.Period).HasConversion<string>();

                base.OnModelCreating(modelBuilder);
            }
        }
    }
}