using System;
using System.Collections.Generic;

namespace DashboardHR.Models.Models
{
    public class Buyer
    {
        public int BuyerId { get; set; }
        public string BuyerCode { get; set; }
        public string BuyerName { get; set; }
    }

    public class Merchant
    {
        public int MerchantId { get; set; }
        public string MerchantCode { get; set; }
        public string MerchantName { get; set; }
    }
    public class Company
    {
        public int CompanyId { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string Budget { get; set; }
        public string Actual { get; set; }
        public string Shartage { get; set; }
        public string Exceed { get; set; }
        public string Unallocated { get; set; }

    }

    public class CompanyObj
    {
        public string CompanyId { get; set; }
        public string UnitId { get; set; }
        public int DivisionId { get; set; }
        public int DepartmentId { get; set; }
        public int SectionId { get; set; }
        public int SubSectionId { get; set; }
        public string EmployeeType { get; set; }
    }

    public class Employee
    {
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeStatus { get; set; }
        public int DesignationId { get; set; }
        public string Designation { get; set; }
        public string Department { get; set; }
        public string JoiningDate { get; set; }
        public string BudgetCode { get; set; }
        public string SubSection { get; set; }
        public string Line { get; set; }
        public double Total { get; set; }

    }
    public class Department
    {
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public int Budget { get; set; }
        public int Actual { get; set; }
        public string Short { get; set; }
        public string Ex { get; set; }

    }
    public class CompanyUnit
    {
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string UnitCode { get; set; }
        public string UnitName { get; set; }
        public int Budget { get; set; }
        public int Actual { get; set; }
        public int Shortage { get; set; }
        public int Excess { get; set; }
        public int Unallocated { get; set; }
        public int UnitTotal { get; set; }
        public int ExcessCost { get; set; }

    }
    public class Division
    {
        public string CompanyId { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string DivisionId { get; set; }
        public string DivisionName { get; set; }
        public int Budget { get; set; }
        public int Actual { get; set; }
        public int Shortage { get; set; }
        public int Excess { get; set; }
    }
    public class Section
    {
        public string Sections { get; set; }
        public int Budget { get; set; }
        public int Actual { get; set; }
        public string Short { get; set; }
        public string Ex { get; set; }
        public int DeptId { get; set; }
        public int SectionId { get; set; }
    }
    public class SubSection
    {
        public string SSection { get; set; }
        public int Budget { get; set; }
        public int Actual { get; set; }
        public string Short { get; set; }
        public string Ex { get; set; }
        public int SSectionId { get; set; }
        public int SectionId { get; set; }
        public int DeptId { get; set; }

    }
    public class Line
    {
        public EmpType AEmpType { get; set; }
    }
    public class EmpType
    {
        public DesignationGp ADesignationGp { get; set; }
    }
    public class DesignationGp
    {

    }
    public class ConfigurationViewModel
    {
        //public SettingsGlobalEntity SettingsGlobalEntity { get; set; }
        //public SoftwareDomainEntity SoftwareDomainEntity { get; set; }
        //public HardwareDomainEntity HardwareDomainEntity { get; set; }
        //public FirmwareDomainEntity FirmwareDomainEntity { get; set; }
        //public SoftwarePriorityEntity SoftwarePriorityEntity { get; set; }
        //public HardwarePriorityEntity HardwarePriorityEntity { get; set; }
        //public FirmwarePriorityEntity FirmwarePriorityEntity { get; set; }
        //public ThumbnailEntity ThumbnailEntity { get; set; }
    }

    public class Businessplan
    {
        public List<Buyer> Buyers { get; set; }
        public List<Merchant> Merchants { get; set; }
        public List<Company> Companies { get; set; }
        public List<CompanyUnit> CompanyUnits { get; set; }
    }
    public class BusinessInfo
    {
        public string BuyerCode { get; set; }
        public string MerchantCode { get; set; }
        public string CompanyCode { get; set; }
        public string FilterName { get; set; }
        public string EmployeeType { get; set; }
    }
    public class BusinessplanData
    {
        public string BusinessName { get; set; }
        public string Month1 { get; set; }
        public string Month2 { get; set; }
        public string Month3 { get; set; }
        public string Month4 { get; set; }
        public string Month5 { get; set; }
        public string Month6 { get; set; }
        public string Month7 { get; set; }
        public string Month8 { get; set; }
        public string Month9 { get; set; }
        public string Month10 { get; set; }
        public string Month11 { get; set; }
        public string Month12 { get; set; }
    }
}
