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

        public static void AddStylist(Stylist stylist)
        {
            dbContext.Stylists.Add(stylist);
            dbContext.SaveChanges();
        }

        /// Authors: James Pangia and Jake Morris
        /// <summary> Returns all stylists found in the private inner class that contains the Database information as a list </summary>
        public static IEnumerable<Stylist> GetAllStylists()
        {
            return dbContext.Stylists.ToList();
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
