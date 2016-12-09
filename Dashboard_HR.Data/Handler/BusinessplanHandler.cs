using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using DashboardHR.Models.Models;
using Dashboard_HR.Repository.Repository;

namespace Dashboard_HR.Data.Handler
{
    public class BusinessplanHandler
    {
        private readonly DashboardBp _aDashboardBp;
        private Businessplan _aBusinessplans;
        private List<BusinessplanData> _aBusinessplanData;
        public BusinessplanHandler()
        {
            _aDashboardBp = new DashboardBp();
        }

        public Businessplan GetBusinessplanData()
        {
            var data = _aDashboardBp.GetBusinessplanDataFromDb();
            return ListGenerateBusinessplanData(data);
        }
        private Businessplan ListGenerateBusinessplanData(DataSet aDataSet)
        {
            try
            {
                var aBuyers = new List<Buyer>();
                GetBuyerList(aDataSet, aBuyers);

                var aMerchants = new List<Merchant>();
                GetMerchantsList(aDataSet, aMerchants);

                var aCompanys = new List<Company>();
                GetCompanysList(aDataSet, aCompanys);

                var aunits = new List<CompanyUnit>();
                GetUnitList(aDataSet, aunits);

                _aBusinessplans = new Businessplan
                {
                    Buyers = aBuyers,
                    Merchants = aMerchants,
                    Companies = aCompanys,
                    CompanyUnits = aunits
            };
        }
            catch (Exception ex)
            {
                return _aBusinessplans;
            }
            return _aBusinessplans;
        }

private void GetUnitList(DataSet aDataSet, List<CompanyUnit> units)
{
            units.AddRange(from DataRow aRow in aDataSet.Tables[3].Rows
                       select new CompanyUnit
                       {
                           UnitCode = aRow["UnitCode"].ToString(),
                           UnitName = aRow["UnitName"].ToString(),
                           CompanyCode = aRow["CompanyCode"].ToString()
                       });
}

private void GetCompanysList(DataSet aDataSet, List<Company> aCompanys)
{
    aCompanys.AddRange(from DataRow aRow in aDataSet.Tables[2].Rows
                       select new Company
                       {
                           CompanyCode = aRow["CompanyCode"].ToString(),
                           CompanyName = aRow["CompanyName"].ToString()
                       });
}

private static void GetMerchantsList(DataSet aDataSet, List<Merchant> aMerchants)
{
    aMerchants.AddRange(from DataRow aRow in aDataSet.Tables[1].Rows
                        select new Merchant
                        {
                            MerchantCode = aRow["MerchantCode"].ToString(),
                            MerchantName = aRow["MerchantName"].ToString()
                        });
}

private static void GetBuyerList(DataSet aDataSet, List<Buyer> aBuyers)
{
    aBuyers.AddRange(from DataRow aRow in aDataSet.Tables[0].Rows
                     select new Buyer
                     {
                         BuyerCode = aRow["BuyerCode"].ToString(),
                         BuyerName = aRow["BuyerName"].ToString(),
                     });
}

public List<BusinessplanData> GetDashboardFindByCompanyData(BusinessInfo aBusinessInfo)
{
    try
    {
        var data = _aDashboardBp.GetDashboardFindByCompanyFromDb(aBusinessInfo.BuyerCode, aBusinessInfo.MerchantCode, aBusinessInfo.CompanyCode, aBusinessInfo.FilterName);
        return ListGenerateGetDashboardFindByCompanyData(data);
    }
    catch (Exception ex)
    {
        return _aBusinessplanData;
    }
}

private List<BusinessplanData> ListGenerateGetDashboardFindByCompanyData(DataSet aDataSet)
{
    _aBusinessplanData = new List<BusinessplanData>();
    GenerateDataTableToList(aDataSet);
    return _aBusinessplanData;
}

private void GenerateDataTableToList(DataSet aDataSet)
{
    foreach (DataRow aRow in aDataSet.Tables[0].Rows)
    {
        var aData = new BusinessplanData
        {
            BusinessName = aRow["BPName"].ToString() == "" ? "0" : aRow["BPName"].ToString(),
            Month1 = aRow["Month1"].ToString() == "" ? "0" : aRow["Month1"].ToString(),
            Month2 = aRow["Month2"].ToString() == "" ? "0" : aRow["Month2"].ToString(),
            Month3 = aRow["Month3"].ToString() == "" ? "0" : aRow["Month3"].ToString(),
            Month4 = aRow["Month4"].ToString() == "" ? "0" : aRow["Month4"].ToString(),
            Month5 = aRow["Month5"].ToString() == "" ? "0" : aRow["Month5"].ToString(),
            Month6 = aRow["Month6"].ToString() == "" ? "0" : aRow["Month6"].ToString(),
            Month7 = aRow["Month7"].ToString() == "" ? "0" : aRow["Month7"].ToString(),
            Month8 = aRow["Month8"].ToString() == "" ? "0" : aRow["Month8"].ToString(),
            Month9 = aRow["Month9"].ToString() == "" ? "0" : aRow["Month9"].ToString(),
            Month10 = aRow["Month10"].ToString() == "" ? "0" : aRow["Month10"].ToString(),
            Month11 = aRow["Month11"].ToString() == "" ? "0" : aRow["Month11"].ToString(),
            Month12 = aRow["Month12"].ToString() == "" ? "0" : aRow["Month12"].ToString()
        };
        _aBusinessplanData.Add(aData);
    }
}

public List<BusinessplanData> GetBpCapacityData(BusinessInfo aBusinessInfo)
{
    try
    {
        var data = _aDashboardBp.GetBpCapacityDataFromDb(aBusinessInfo.BuyerCode, aBusinessInfo.MerchantCode, aBusinessInfo.CompanyCode);
        return ListGenerateGetBpCapacityData(data);
    }
    catch (Exception ex)
    {
        return _aBusinessplanData;
    }
}

private List<BusinessplanData> ListGenerateGetBpCapacityData(DataSet aDataSet)
{
    _aBusinessplanData = new List<BusinessplanData>();
    GenerateDataTableToList(aDataSet);
    return _aBusinessplanData;
}
    }
}
