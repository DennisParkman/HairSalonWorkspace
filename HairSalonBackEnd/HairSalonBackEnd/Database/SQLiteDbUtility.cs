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

        private class SQLiteDbContext : DbContext
        {
            public DbSet<Stylist> Stylists { get; set; }
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
                base.OnModelCreating(modelBuilder);
            }
        }
    }

    
}
