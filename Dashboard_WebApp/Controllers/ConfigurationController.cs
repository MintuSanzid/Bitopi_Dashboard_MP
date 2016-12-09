using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using DashboardHR.Models.Models;
using Dashboard_HR.Data.Handler;

namespace Dashboard_WebApp.Controllers
{
    [Authorize]
    public class ConfigurationController : Controller
    {
        private DashboardHandler _aDashboardHandler;

        // GET: Configuration/DashboardHRF
        public ActionResult DashboardHrf()
        {
            return View();
        }

        // GET: Configuration/DashboardCompanyJsonData
        public JsonResult DashboardCompanyJsonData(BusinessInfo aInfo)
        {
            List<Company> data = null;
            try
            {
                var userId = Session["UserId"].ToString();
                if (true)
                {
                    _aDashboardHandler = new DashboardHandler();
                    data = _aDashboardHandler.GetHrCompanies(userId, aInfo.EmployeeType);
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: Configuration/DashboardDivisionJsonData
        public JsonResult DashboardDivisionJsonData(BusinessInfo aInfo)
        {
            var userId = Session["UserId"].ToString();
            if (true)
            {
                _aDashboardHandler = new DashboardHandler();
                List<Division> data = _aDashboardHandler.GetHrAllDivisions(userId, aInfo.EmployeeType);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: Configuration/DashboardUnitJsonData
        public JsonResult DashboardUnitJsonData(BusinessInfo aInfo)
        {
            var userId = Session["UserId"].ToString();
            if (true)
            {
                _aDashboardHandler = new DashboardHandler();
                List<CompanyUnit> data = _aDashboardHandler.GetHrUnits(userId, aInfo.EmployeeType);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: Configuration/DashboardHRFJson
        public JsonResult DashboardHrfDepartmentJson(CompanyObj obj)
        {
            _aDashboardHandler = new DashboardHandler();
            List<Department> data = _aDashboardHandler.GetHrDepartments(obj.CompanyId, obj.UnitId, obj.EmployeeType);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        // GET: Configuration/DashboardHrfSectionJson
        public JsonResult DashboardHrfSectionJson(CompanyObj obj)
        {
            _aDashboardHandler = new DashboardHandler();
            List<Section> data = _aDashboardHandler.GetHrSections(obj.CompanyId, obj.UnitId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DashboardHrfSubSectionJson(CompanyObj obj)
        {
            _aDashboardHandler = new DashboardHandler();
            List<SubSection> data = _aDashboardHandler.GetHrSubSections(obj.CompanyId, obj.UnitId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DashboardExcessEmpList(string companyCode)
        {
            _aDashboardHandler = new DashboardHandler();
            var data = _aDashboardHandler.GetHrExcessEmpList(companyCode);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DashboardUnallocatedEmpList(string companyCode)
        {
            _aDashboardHandler = new DashboardHandler();
            var data = _aDashboardHandler.GetHrUnallocatedEmpList(companyCode);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DashboardAllocatedEmpList(CompanyObj companyObj)
        {
            _aDashboardHandler = new DashboardHandler();
            var data = _aDashboardHandler.GetHrAllocatedEmpList(companyObj);
            return Json(data, JsonRequestBehavior.AllowGet);
        }


        //// GET: Configuration/DashboardHRFC
        //[ActionName("DashboardHRFC")]
        //[Authorize]
        //public ActionResult DashboardHRFC()
        //{
        //    return View("DashboardHRFC");
        //}

        //// POST: Configuration/DashboardHRFC
        //[ActionName("DashboardHRFC")]
        //[HttpPost]
        //[Authorize]
        //public ActionResult DashboardHRFC(ConfigurationViewModel collection)
        //{
        //    //var aDataHandler = new ConfigurationSettingsDataHandler();
        //    try
        //    {
        //        //    if (TempData["ConfigurationViewModel"] != null)
        //        //    {
        //        //        var oldCollection = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        //        aDataHandler.DashboardHrp(collection, oldCollection);
        //        //    }
        //        //    else
        //        //    {
        //        //        var configurationViewModel = aDataHandler.GetSettings();
        //        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //        DashboardHrp(collection);
        //        //    }
        //        return View("DashboardHRFC");
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.Message = ex.Message;
        //        return ViewBag as ActionResult;
        //    }
        //}


        //// GET: Configuration/DashboardHraw
        //[ActionName("DashboardHraw")]
        //[Authorize]
        //public ActionResult DashboardHraw()
        //{
        //    return View("DashboardHraw");
        //}

        //// POST: Configuration/DashboardHraw
        //[ActionName("DashboardHraw")]
        //[HttpPost]
        //[Authorize]
        //public ActionResult DashboardHraw(ConfigurationViewModel collection)
        //{
        //    //var aDataHandler = new ConfigurationSettingsDataHandler();
        //    try
        //    {
        //        //    if (TempData["ConfigurationViewModel"] != null)
        //        //    {
        //        //        var oldCollection = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        //        aDataHandler.DashboardHrp(collection, oldCollection);
        //        //    }
        //        //    else
        //        //    {
        //        //        var configurationViewModel = aDataHandler.GetSettings();
        //        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //        DashboardHrp(collection);
        //        //    }
        //        return View("DashboardHraw");
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.Message = ex.Message;
        //        return ViewBag as ActionResult;
        //    }
        //}


        //// GET: Configuration/HomeJsonResult
        //[ActionName("HomeJsonResult")]
        //[Authorize]
        //public JsonResult HomeJsonResult()
        //{
        //    if (TempData["ConfigurationViewModel"] != null)
        //    {
        //        var configurationViewModel = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //    }
        //    else
        //    {
        //        //var aDataHandler = new ConfigurationSettingsDataHandler();
        //        //var configurationViewModel = aDataHandler.GetSettings();
        //        //TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //    }
        //    return null;
        //}

        //// GET: Configuration/DashboardHrp
        //[ActionName("DashboardHrp")]
        //[Authorize]
        //public ActionResult DashboardHrp()
        //{
        //    return View();
        //}

        //// POST: Configuration/DashboardHrp
        //[ActionName("DashboardHrp")]
        //[HttpPost]
        //[Authorize]
        //public ActionResult DashboardHrp(ConfigurationViewModel collection)
        //{
        //    //var aDataHandler = new ConfigurationSettingsDataHandler();
        //    try
        //    {
        //        //    if (TempData["ConfigurationViewModel"] != null)
        //        //    {
        //        //        var oldCollection = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        //        aDataHandler.DashboardHrp(collection, oldCollection);
        //        //    }
        //        //    else
        //        //    {
        //        //        var configurationViewModel = aDataHandler.GetSettings();
        //        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //        DashboardHrp(collection);
        //        //    }
        //        return View();
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.Message = ex.Message;
        //        return ViewBag as ActionResult;
        //    }
        //}

        //// GET: Configuration/DashboardHrpJsonResult
        //[ActionName("DashboardHrpJsonResult")]
        //[Authorize]
        //public JsonResult DashboardHrpJsonResult()
        //{
        //    if (TempData["ConfigurationViewModel"] != null)
        //    {
        //        var configurationViewModel = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //    }
        //    else
        //    {
        //        //var aDataHandler = new ConfigurationSettingsDataHandler();
        //        //var configurationViewModel = aDataHandler.GetSettings();
        //        //TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //        return null;
        //    }
        //}


        ///// <summary>
        /////  dashboard 
        ///// </summary>
        ///// <returns></returns>
        //// GET: Configuration/Dashboard
        //[ActionName("Dashboard")]
        //[Authorize]
        //public ActionResult Dashboard()
        //{
        //    return View("Dashboard");
        //}

        //// POST: Configuration/Dashboard
        //[ActionName("Dashboard")]
        //[HttpPost]
        //[Authorize]
        //public ActionResult Dashboard(ConfigurationViewModel collection)
        //{
        //    //var aDataHandler = new ConfigurationSettingsDataHandler();
        //    try
        //    {
        //        //    if (TempData["ConfigurationViewModel"] != null)
        //        //    {
        //        //        var oldCollection = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        //        aDataHandler.DashboardHrp(collection, oldCollection);
        //        //    }
        //        //    else
        //        //    {
        //        //        var configurationViewModel = aDataHandler.GetSettings();
        //        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //        DashboardHrp(collection);
        //        //    }
        //        return View();
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.Message = ex.Message;
        //        return ViewBag as ActionResult;
        //    }
        //}

        //// GET: Configuration/DashboardHrpJsonResult
        //[ActionName("DashboardHrpJsonResult")]
        //[Authorize]
        //public JsonResult DashboardJsonResult()
        //{
        //    if (TempData["ConfigurationViewModel"] != null)
        //    {
        //        var configurationViewModel = TempData["ConfigurationViewModel"] as ConfigurationViewModel;
        //        TempData["ConfigurationViewModel"] = configurationViewModel;
        //        return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //    }
        //    else
        //    {
        //        //var aDataHandler = new ConfigurationSettingsDataHandler();
        //        //var configurationViewModel = aDataHandler.GetSettings();
        //        //TempData["ConfigurationViewModel"] = configurationViewModel;
        //        //return Json(configurationViewModel, JsonRequestBehavior.AllowGet);
        //        return null;
        //    }
        //}

        //// GET: Configuration/DashboardHR
        //public ActionResult DashboardHr()
        //{
        //    List<Section> aSection = new List<Section>();
        //    return View("DashboardHR", aSection);
        //}

        //// GET: Configuration/DisplaySection
        //[ActionName("DisplaySection")]
        //[Authorize]
        //public ActionResult DisplaySection()
        //{
        //    return PartialView("_PartialCompanies/_Sections");
        //}
        //// GET: Configuration/DisplaySubSection 
        //[ActionName("DisplaySubSection")]
        //[Authorize]
        //public ActionResult DisplaySubSection()
        //{
        //    return PartialView("_PartialCompanies/_SubSections");
        //}

        //// GET: Configuration/DisplayLine
        //[ActionName("DisplayLine")]
        //[Authorize]
        //public ActionResult DisplayLine()
        //{
        //    return PartialView("_PartialCompanies/_Lines");
        //}

        //// GET: Configuration/DisplayEmpType 
        //[ActionName("DisplayEmpType")]
        //[Authorize]
        //public ActionResult DisplayEmpType()
        //{
        //    return PartialView("_PartialCompanies/_Emptypes");
        //}

        //// GET: Configuration/DisplayDesignationGp 
        //[ActionName("DisplayDesignationGp")]
        //[Authorize]
        //public ActionResult DisplayDesignationGp()
        //{
        //    return PartialView("_PartialCompanies/_DesignationGps");
        //}

        //// GET: Configuration/DisplayDesignation
        //[ActionName("DisplayDesignation")]
        //[Authorize]
        //public ActionResult DisplayDesignation()
        //{
        //    return PartialView("_PartialCompanies/_Designations");
        //}

        //// GET: Configuration/DisplayEmpNames
        //[ActionName("DisplayEmpNames")]
        //[Authorize]
        //public ActionResult DisplayEmpNames()
        //{
        //    return PartialView("_PartialCompanies/_EmpNames");
        //}
    }
}
