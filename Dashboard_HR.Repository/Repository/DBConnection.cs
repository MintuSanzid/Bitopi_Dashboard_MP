using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dashboard_HR.Repository.Repository
{
   public class DbConnection 
    {
        public static string GetDefaultConnection() 
        {
            try
            {
                return ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            }
            catch (Exception ex) 
            {
                throw new ApplicationException("Unable to get DB Connection string from Config File. Contact Administrator" + ex);
            }
        }
    }
}
