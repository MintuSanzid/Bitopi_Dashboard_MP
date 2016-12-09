using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using DashboardHR.Models.Models;
using Dashboard_HR.Data.Handler;

namespace Dashboard_WebApp.Controllers
{
    public class BusinessplanController : Controller
    {
        // GET: Configuration/Dashboard
        public ActionResult Dashboard()
        {
            return View();
        }

        // GET: Configuration/BusinessPlanJsonData 
        public JsonResult DashboardJsonData()
        {
            Businessplan data = null;
            try
            {
                if (true)
                {
                    var aBusinessplanHandler = new BusinessplanHandler();
                    data = aBusinessplanHandler.GetBusinessplanData();
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult DashboardFindByCompanyJsonData(BusinessInfo aBusinessInfo)
        {
            List<BusinessplanData> data = null;
            try
            {
                if (aBusinessInfo == null) return Json(null, JsonRequestBehavior.AllowGet); 
                var aBusinessplanHandler = new BusinessplanHandler();
                data = aBusinessplanHandler.GetDashboardFindByCompanyData(aBusinessInfo);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
        
        public JsonResult DashboardBpCapacityJson(BusinessInfo aBusinessInfo)
        {
            List<BusinessplanData> data = null;
            try
            {
                if (aBusinessInfo == null) return Json(null, JsonRequestBehavior.AllowGet);
                var aBusinessplanHandler = new BusinessplanHandler();
                data = aBusinessplanHandler.GetBpCapacityData(aBusinessInfo); 
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
