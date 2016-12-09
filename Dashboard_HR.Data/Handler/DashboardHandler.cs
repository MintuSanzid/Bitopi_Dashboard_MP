using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DashboardHR.Models.Models;
using Dashboard_HR.Repository;
using Dashboard_HR.Repository.Repository;

namespace Dashboard_HR.Data.Handler
{
    public class DashboardHandler : DashboardHr
    {
        private List<Department> _aDepartments;
        private List<CompanyUnit> _conpanyUnits;
        private List<Division> _divisions;
        private List<Section> _sections;
        private List<SubSection> _ssections;
        private List<Employee> _employees;
        private List<Company> _companies;
        private DashboardHr _aDashboardHr;

        public DashboardHandler()
        {
            _aDashboardHr = new DashboardHr();
        }
        public List<Company> GetHrCompanies( string userId, string empType)
        {
            var data = _aDashboardHr.GetHrCompanyFromDb(userId, empType);
            return ListGenerateCompany(data);
        }
        public List<Division> GetHrAllDivisions(string userId, string empType)
        {
            var data = _aDashboardHr.GetHrAllDivisionFromDb(userId, empType);
            return ListGenerateDivision(data);
        }
        public List<CompanyUnit> GetHrUnits(string userId, string empType)
        {
            var data = _aDashboardHr.GetHrUnitsFromDb(userId, empType);
            return ListGenerateUnit(data);
        }
        public List<Department> GetHrDepartments(string companyCode, string unitCode, string empType)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrDepartmentsFromDb(companyCode, unitCode, empType);
            return GenerateDepartmentList(data);
        }
        public List<Section> GetHrSections(string companyCode, string unitCode)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrSectionsFromDb(companyCode, unitCode);
            return ListGenerateSection(data);
        }
        public List<SubSection> GetHrSubSections(string companyCode, string unitCode)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrSubSectionsFromDb(companyCode, unitCode);
            return ListGenerateSubSection(data);
        }

        public List<Employee> GetHrUnallocatedEmpList(string companyCode)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrUnallocatedEmpListFromDb(companyCode);
            return UnallocatedEmpListGenerate(data);
        }
        public List<Employee> GetHrAllocatedEmpList(CompanyObj obj)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrAllocatedEmpListFromDb(obj.CompanyId, obj.UnitId, obj.DepartmentId, obj.SectionId, obj.SubSectionId);
            return AllocatedEmpListGenerate(data);
        }

        private List<Employee> UnallocatedEmpListGenerate(DataTable employee)
        {
            _employees = new List<Employee>();
            foreach (DataRow aRow in employee.Rows)
            {
                var aEmployee = new Employee
                {
                    CompanyCode = aRow["CompanyCode"].ToString(),
                    CompanyName = aRow["CompanyName"].ToString(),
                    BudgetCode = aRow["EmpWiseBgtCD"].ToString(),
                    EmployeeCode = aRow["EmployeeCode"].ToString(),
                    EmployeeName = aRow["EmployeeName"].ToString(),
                    EmployeeStatus = aRow["EmployeeStatus"].ToString(),
                    Designation = aRow["Designation"].ToString(),
                    Department = aRow["Department"].ToString(),
                    JoiningDate = Convert.ToDateTime(aRow["JoiningDate"]).ToShortDateString(),
                    Total = Convert.ToDouble(aRow["Total"].ToString())
                };
                _employees.Add(aEmployee);
            }
            return _employees;
        }
        private List<Employee> AllocatedEmpListGenerate(DataTable employee)
        {
            _employees = new List<Employee>();
            foreach (DataRow aRow in employee.Rows)
            {
                //AE.CompanyName, AE.BudgetCode, AE.CompanyShortName, AE.EmployeeCode, E.EmployeeName, E.Designation,
                //AE.SubSection, 'Line one' AS Line 
                try
                {
                    var aEmployee = new Employee
                    {
                        CompanyCode = aRow["CompanyCode"].ToString(),
                        CompanyName = aRow["CompanyName"].ToString(),
                        BudgetCode = aRow["BudgetCode"].ToString(),
                        EmployeeCode = aRow["EmployeeCode"].ToString(),
                        EmployeeName = aRow["EmployeeName"].ToString(),
                        DesignationId = Convert.ToInt32(aRow["DesgCD"].ToString()),
                        Designation = aRow["Designation"].ToString(),
                        JoiningDate = Convert.ToDateTime(aRow["JoiningDate"]).ToShortDateString(),
                        SubSection = aRow["SubSection"].ToString(),
                        Line = aRow["Line"].ToString(),
                        Total = Convert.ToDouble(aRow["Total"].ToString())
                    };
                    _employees.Add(aEmployee);

                }
                catch (Exception)
                {
                    return _employees;
                }
            }
            return _employees;
        }

        private List<Company> ListGenerateCompany(DataTable companies)
        {
            try
            {
                _companies = new List<Company>();
                foreach (DataRow aRow in companies.Rows)
                {
                    var value = Convert.ToInt32(aRow["Shartage"]);
                    var company = new Company
                    {
                        CompanyId = Convert.ToInt32(aRow["CompanyId"]),
                        CompanyName = aRow["CompanyName"].ToString(),
                        CompanyCode = aRow["CompanyCode"].ToString(),
                        Budget = aRow["Budget"].ToString(),
                        Actual = aRow["Actual"].ToString(),
                        Shartage = (value > 0 ? value : 0).ToString(),
                        Exceed = (value < 0 ? Math.Abs(value) : 0).ToString(),
                        Unallocated = aRow["Unallocated"].ToString()
                    };
                    _companies.Add(company);
                }

            }
            catch (Exception ex)
            {
                return _companies;
            }
            return _companies;
        }
        private List<Division> ListGenerateDivision(DataTable aDivision)
        {
            try
            {
                _divisions = new List<Division>();
                foreach (DataRow aRow in aDivision.Rows)
                {
                    var value = Convert.ToInt32(aRow["ShortageOrExcess"]);
                    var division = new Division
                    {
                        CompanyId = aRow["CompanyID"].ToString(),
                        CompanyCode = aRow["CompanyCode"].ToString(),
                        CompanyName = aRow["CompanyName"].ToString(),
                        DivisionId = aRow["DivCD"].ToString(),
                        DivisionName = aRow["Division"].ToString(),
                        Budget = Convert.ToInt32(aRow["Budget"]),
                        Actual = Convert.ToInt32(aRow["Actual"]),
                        Shortage = value >= 0 ? 0 : Math.Abs(value),
                        Excess = value > 0 ? value : 0
                    };
                    _divisions.Add(division);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return _divisions;
        }
        private List<CompanyUnit> ListGenerateUnit(DataTable aCompanyUnit)
        {
            // UnitCD, DT.UnitName, COUNT(*) UnitTotal, (SELECT COUNT(*) Unallocated
            try
            {
                _conpanyUnits = new List<CompanyUnit>();
                foreach (DataRow aRow in aCompanyUnit.Rows)
                {
                    var conpanyUnit = new CompanyUnit
                    {
                        CompanyCode = aRow["CompanyCode"].ToString(),
                        CompanyName = aRow["CompanyName"].ToString(),
                        UnitCode = aRow["UnitCD"].ToString(),
                        UnitName = aRow["UnitName"].ToString(),

                        Budget = Convert.ToInt32(aRow["Budget"]),
                        Actual = Convert.ToInt32(aRow["Actual"]),
                        Shortage = Convert.ToInt32(aRow["Shortage"]),
                        Excess = Convert.ToInt32(aRow["Excess"]),
                        Unallocated = Convert.ToInt32(aRow["Unallocated"]),
                        ExcessCost= Convert.ToInt32(aRow["ExcessCost"])
                    };
                    _conpanyUnits.Add(conpanyUnit);
                }
            }
            catch (Exception ex)
            {
                return _conpanyUnits;
            }
            return _conpanyUnits;
        }
        private List<Department> GenerateDepartmentList(DataTable aDataTable)
        {
            try
            {
                _aDepartments = new List<Department>();

                foreach (DataRow aRow in aDataTable.Rows)
                {
                    var value = Convert.ToInt32(aRow["ShortageOrExcess"]);
                    var aDepartment = new Department
                    {
                        DeptId = Convert.ToInt32(aRow["DeptCD"]),
                        DeptName = aRow["Department"].ToString(),
                        Actual = Convert.ToInt32(aRow["Actual"]),
                        Budget = Convert.ToInt32(aRow["Budget"]),
                        Short = value >= 0 ? "0" : Math.Abs(value).ToString(),
                        Ex = value > 0 ? value.ToString() : "0"
                    };
                    _aDepartments.Add(aDepartment);
                }
            }
            catch (Exception ex)
            {
                return _aDepartments;
            }
            return _aDepartments;
        }

        //private static string GetNewShortageValue(int value)
        //{
        //    return value >= 0 ? "0" : "(" + Math.Abs(value) + ")";
        //}

        //private static string GetNewExcessValue(int value)
        //{
        //    return value > 0 ? value.ToString() : "0";
        //}

        private List<Section> ListGenerateSection(DataTable aDataTable)
        {
            try
            {
                _sections = new List<Section>();
                foreach (DataRow aRow in aDataTable.Rows)
                {
                    var value = Convert.ToInt32(aRow["ShortageOrExcess"]);
                    var aSection = new Section
                    {
                        Sections = aRow["Section"].ToString(),
                        Budget = Convert.ToInt32(aRow["Budget"].ToString()),
                        Actual = Convert.ToInt32(aRow["Actual"].ToString()),
                        Short = value >= 0 ? "0" : Math.Abs(value).ToString(),
                        Ex = value > 0 ? value.ToString() : "0",
                        SectionId = Convert.ToInt32(aRow["SecCD"].ToString()),
                        DeptId = Convert.ToInt32(aRow["DeptCD"].ToString())
                    };
                    _sections.Add(aSection);
                }
            }
            catch (Exception ex)
            {
                return _sections;
            }
            return _sections;
        }
        public List<SubSection> ListGenerateSubSection(DataTable aDataTable)
        {
            try
            {
                _ssections = new List<SubSection>();
                foreach (DataRow aRow in aDataTable.Rows)
                {
                    var value = Convert.ToInt32(aRow["ShortageOrExcess"]);
                    var aSSection = new SubSection
                    {
                        SSection = aRow["SubSection"].ToString(),
                        Budget = Convert.ToInt32(aRow["Budget"].ToString()),
                        Actual = Convert.ToInt32(aRow["Actual"].ToString()),
                        Short = value >= 0 ? "0" : Math.Abs(value).ToString(),
                        Ex = value > 0 ? value.ToString() : "0",
                        SSectionId = Convert.ToInt32(aRow["SSecCD"]),
                        SectionId = Convert.ToInt32(aRow["SecCD"]),
                        DeptId = Convert.ToInt32(aRow["DeptCD"])
                    };
                    _ssections.Add(aSSection);
                }
            }
            catch (Exception ex)
            {
                return _ssections;
            }
            return _ssections;
        }

        public List<Employee> GetHrExcessEmpList(string companyCode)
        {
            _aDashboardHr = new DashboardHr();
            var data = _aDashboardHr.GetHrExcessEmpListFromDb(companyCode);
            return ExcessEmpListGenerate(data);

        }
        private List<Employee> ExcessEmpListGenerate(DataTable aDataTable)
        {
            _employees = new List<Employee>();
            foreach (DataRow aRow in aDataTable.Rows)
            {
                var aEmployee = new Employee
                {
                    CompanyCode = aRow["CompanyCode"].ToString(),
                    CompanyName = aRow["CompanyName"].ToString(),
                    BudgetCode = aRow["BudgetCode"].ToString(),
                    EmployeeCode = aRow["EmployeeCode"].ToString(),
                    EmployeeName = aRow["EmployeeName"].ToString(),
                    EmployeeStatus = aRow["EmployeeStatus"].ToString(),
                    Designation = aRow["Designation"].ToString(),
                    Department = aRow["Department"].ToString(),
                    JoiningDate = Convert.ToDateTime(aRow["JoiningDate"].ToString()).ToShortDateString(),
                    Total = Convert.ToDouble(aRow["Total"].ToString())
                };
                _employees.Add(aEmployee);
            }
            return _employees;

            //         SELECT E.CompanyCode, AE.CompanyName, AE.CompanyShortName, AE.EmployeeCode, AE.BudgetCode, E.EmployeeName, 
            //E.Designation, E.DOJ,  AE.SubSection, 'Line one' AS Line, 08 as Total
        }
    }
}
