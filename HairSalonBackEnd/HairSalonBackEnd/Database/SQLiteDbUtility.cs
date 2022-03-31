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
        /// locks the database until completed
        /// </summary>
        /// <returns> an enumerable array of all the appointments in the database</returns>
        public static IEnumerable<Appointment> GetAllAppointments()
        {
            dbAccess.WaitOne();

            IEnumerable<Appointment> appointments = dbContext.Appointments.ToList();

            dbAccess.Release();

            return appointments;
        }

        /// <summary>
        /// The Update method for updating an appointment record.
        /// locks the database until completed
        /// </summary>
        /// <param name="app"> the appointment to update</param>
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
        /// locks the database until completed
        /// </summary>
        /// <param name="id">the id of the appintment to delete</param>
        public static void DeleteAppointment(int id)
        {
            dbAccess.WaitOne();
            var AppEntry = dbContext.Appointments.Where(x => x.ID == id).FirstOrDefault();
            dbContext.Appointments.Remove(AppEntry);
            dbContext.SaveChanges();
            dbAccess.Release();
        }

        /// <summary>
        /// gets all appointments for a specified stylist.
        /// locks the database until completed
        /// </summary>
        /// <param name="stylistID"> the id of the stylist to get the appointments for</param>
        /// <returns> an enumerable array of the appointments for the specified stylist</returns>
        public static IEnumerable<Appointment> GetAppointmentsByStylist(int stylistID)
        {
            dbAccess.WaitOne();
            var stylistAppointments = dbContext.Appointments.Where(x => x.StylistID == stylistID);
            dbAccess.Release();
            return stylistAppointments;
        }
        #endregion

        #region Unavailability Methods

        /// <summary>
        /// Adds a unavailability to the database
        /// locks the database until completed
        /// </summary>
        /// <param name="unavailability">the unavailability to add</param>
        /// <returns>the added unavailability with the automatically assigned database id</returns>
        public static Unavailability AddUnavailability(Unavailability unavailability)
        {
            dbAccess.WaitOne();
            dbContext.Unavailabilities.Add(unavailability);
            dbContext.SaveChanges();
            dbAccess.Release();
            return unavailability;
        }

        /// <summary>
        /// gets all unavailabilities in the database
        /// locks the database until completed
        /// </summary>
        /// <returns>an enumerable array of all the unavailabilities in the database</returns>
        public static IEnumerable<Unavailability> GetAllUnavailabilities()
        {
            dbAccess.WaitOne();
            IEnumerable<Unavailability> unavailabilities = dbContext.Unavailabilities.ToList();
            dbAccess.Release();
            return unavailabilities;
        }

        /// <summary>
        /// updates the specified unavailability
        /// locks the database until completed
        /// </summary>
        /// <param name="unavailability">the unavailability to update</param>
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

        /// <summary>
        /// deletes the unavailability with the specified id
        /// locks the database until completed
        /// </summary>
        /// <param name="id">the id of the unavailability to delete</param>
        public static void DeleteUnavailability(int id)
        {
            dbAccess.WaitOne();
            var delUnavailability = dbContext.Unavailabilities.Where(x => x.ID == id).FirstOrDefault();

            dbContext.Unavailabilities.Remove(delUnavailability);
            dbContext.SaveChanges();
            dbAccess.Release();
        }

        /// <summary>
        /// gets all unavailabilities associated to a specified stylist
        /// locks the database until completed
        /// </summary>
        /// <param name="stylistID">the id of the stylist to get unavailabilities for</param>
        /// <returns>an enumerable array of all unavailabilities associated to the specified stylist</returns>
        public static IEnumerable<Unavailability> GetAllUnavailabilitiesByStylist(int stylistID)
        {
            dbAccess.WaitOne();
            IEnumerable<Unavailability> unavailabilities = dbContext.Unavailabilities.Where(x => x.StylistID == stylistID).ToList();
            dbAccess.Release();
            return unavailabilities;
        }

        #endregion

        #region User Methods

        /// <summary>
        /// Method for adding an user record to the database.
        /// locks the database until completed
        /// </summary>
        /// <param name="user">the user to add</param>
        /// <returns>the user added </returns>
        public static User AddUser(User user)
        {
            dbAccess.WaitOne();

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            dbAccess.Release();
            return user;
        }

        /// <summary>
        /// Method for getting all the users.
        /// locks the database until completed
        /// </summary>
        /// <returns> an enumerable array of all the users in the database</returns>
        public static IEnumerable<User> GetAllUsers()
        {
            dbAccess.WaitOne();

            IEnumerable<User> users = dbContext.Users.ToList();

            dbAccess.Release();

            return users;
        }

        /// <summary>
        /// The Update method for updating an user record.
        /// locks the database until completed
        /// </summary>
        /// <param name="user"> the user to update</param>
        public static void UpdateUser(User user)
        {
            dbAccess.WaitOne();

            // Get the record with same username.
            var UserEntry = dbContext.Users.Where(x => x.ID == user.ID).FirstOrDefault();

            // Update Fields and Save
            UserEntry.Username = user.Username;
            UserEntry.Password = user.Password;
            UserEntry.Role = user.Role;

            dbContext.SaveChanges();

            dbAccess.Release();
        }

        /// <summary>
        /// The delete method for removing an user record.
        /// locks the database until completed
        /// </summary>
        /// <param name="id">the id of the user to delete</param>
        public static void DeleteUser(int id)
        {
            dbAccess.WaitOne();
            var UserEntry = dbContext.Users.Where(x => x.ID == ID).FirstOrDefault();
            dbContext.Users.Remove(UserEntry);
            dbContext.SaveChanges();
            dbAccess.Release();
        }
        #endregion

        private class SQLiteDbContext : DbContext
        {
            /// <summary>
            /// abstraction of the stylists table
            /// </summary>
            public DbSet<Stylist> Stylists { get; set; }

            /// <summary>
            /// abstraction of the appintments table
            /// </summary>
            public DbSet<Appointment> Appointments { get; set; }

            /// <summary>
            /// abstraction of the unavailabilities table
            /// </summary>
            public DbSet<Unavailability> Unavailabilities { get; set; }

             /// <summary>
            /// abstraction of the users table
            /// </summary>
            public DbSet<User> Users { get; set; }

            /// <summary>
            /// method for configuring the database
            /// </summary>
            /// <param name="optionsBuilder">object containing the options to configure the database with</param>
            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                //first argument specifies the database file to read from
                optionsBuilder.UseSqlite("FileName=Database/sqlite.db", option =>
                {
                    option.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
                });
                base.OnConfiguring(optionsBuilder);
            }

            /// <summary>
            /// creates the database
            /// </summary>
            /// <param name="modelBuilder">ModelBuilder used to create the database</param>
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                //set up the stylists table
                modelBuilder.Entity<Stylist>().ToTable("Stylists", "localSchema");
                //set up the Appointments table
                modelBuilder.Entity<Appointment>().ToTable("Appointments", "localSchema");
                //set up the Unavailabilities table
                modelBuilder.Entity<Unavailability>().ToTable("Unavailabilities", "localSchema");
                modelBuilder.Entity<Unavailability>().Property(u => u.Period).HasConversion<string>();
                //set up the Users table
                modelBuilder.Entity<User>().ToTable("Users", "localSchema");

                //create the database
                base.OnModelCreating(modelBuilder);
            }
        }
    }
}