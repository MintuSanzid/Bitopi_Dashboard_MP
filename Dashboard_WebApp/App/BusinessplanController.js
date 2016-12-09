
var app = angular.module("app", ["ngDialog"]);

app.controller("BusinessplanController", function ($scope, $rootScope, $http, $filter, $window, ngDialog) {

    function openngDiologValidationUnit() {

        $http.get("/Businessplan/DashboardJsonData").then(function (businessplan) {
            if (businessplan.status === 200) {
                $scope.Buyers = businessplan.data.Buyers;
                $scope.Merchants = businessplan.data.Merchants;
                $scope.Companies = businessplan.data.Companies;
                $scope.CompanyUnits = businessplan.data.CompanyUnits;
                $scope.Units = businessplan.data.CompanyUnits;
            }
        });
    }
    openngDiologValidationUnit();

    function loadMonths() {
        var monthnames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = new Date();
        var currentMnth = date.getMonth();
        $scope.PlanStartMonth = currentMnth;

        var currentYear = date.getFullYear().toString().substr(2, 2);
        $scope.SetMonths = [];
        for (var i = 0; i < 12; i++) {
            if (currentMnth === 12) {
                currentMnth = 0;
                currentYear++;
            }
            $scope.SetMonths.push(monthnames[currentMnth] + "-" + currentYear);
            currentMnth++;
        }
    };
    loadMonths();
    $scope.isArray = angular.isArray;

    ////// Get Data From DB //////
    var setCompanyUnits = function () {
        var filterbynewUnits = [];
        if ($scope.CompanyCode !== undefined) {
            var units = $scope.Units;
            
            for (var i = 0; i < units.length; i++) {
                if (units[i].CompanyCode === $scope.CompanyCode) {
                    var unitfilterbyCompanyId = { UnitCode: units[i].UnitCode, UnitName: units[i].UnitName }
                    filterbynewUnits.push(unitfilterbyCompanyId);
                }
            }
        }
        return filterbynewUnits;
    };
    $scope.Bsinessplans = [];
    $scope.ShowBusinessPlan = function () {
        $scope.Message = "Data not Available";
        $scope.buyerVar = 0;
        $scope.color = { name: "" };
        var info = {};
        info.BuyerCode = $scope.BuyerCode;
        info.MerchantCode = $scope.MerchantCode;
        info.CompanyCode = $scope.CompanyCode;
        info.UnitCode = $scope.UnitCode;
        info.FilterName = $scope.FilterName;
        var config = { params: info, headers: { 'Accept': "application/json" } };
        //&& info.MerchantCode === undefined && info.BuyerCode === undefined;
        $scope.CompanyUnits = setCompanyUnits();
        if (info.CompanyCode === undefined || info.UnitCode === undefined || info.FilterName === undefined) {
            $scope.Bsinessplans = [];
        } else {
            $http.get("/Businessplan/DashboardFindByCompanyJsonData", config).then(function (businessplanData) {
                if (businessplanData.data.length > 0 && businessplanData.status === 200) {
                    $scope.Message = "";
                    $scope.Bsinessplans = businessplanData.data;
                } else {
                    $scope.Message = "Data not Available";
                }
            });
        }
    }

   
    $scope.OpenngDiologBP_Capacity = function (event) {
        if (event.target.id === "Capacity") {
            $scope.Capacities = [];
            $scope.Message = "Data not Available";
            var info = {};
            info.BuyerCode = $scope.BuyerCode;
            info.MerchantCode = $scope.MerchantCode;
            info.CompanyCode = "06"; //$scope.CompanyCode; 
           
            var config = { params: info, headers: { 'Accept': "application/json" } };
            $http.get("/Businessplan/DashboardBpCapacityJson", config).then(function (capacity) {
                if (capacity.status === 200) {
                    $scope.Capacities = capacity.data;
                }
            });
            ngDialog.open({ template: "BP_CapacityDetails", controller: "BusinessplanController", className: "ngdialog-theme-default", scope: $scope });
        }
        
    }
    $scope.Filters = [{ Name: "Pcs" }, { Name: "LineDays" }, { Name: "Hours" }, { Name: "LineMinutes" }, { Name: "Sam" }];
    $scope.FilterName = "Pcs";

    $scope.color = { name: "blue" };

    var setCapacityBuyerwise = function(capacities) {
        var buyerwithCapacities = [];
        for (var i = 1; i < 7; i++) {
            var buyerwithCapacity = { BuyerName: "Buyer " + i, Capacities: capacities }
            buyerwithCapacities.push(buyerwithCapacity);
        }
        return buyerwithCapacities;
    };
    $scope.ShowBP_CapacityDetails = function () {
        if ($scope.Bsinessplans.length > 0) {
        $scope.Details = "DMM Wise Details";
        var name = $scope.color.name;
        if (name === "buyerwise") {
            $scope.Details = "Buyer Wise Details";
        }
        $scope.buyerVar = 1;
        var info = {};
        info.BuyerCode = $scope.BuyerCode;
        info.MerchantCode = $scope.MerchantCode;
        info.CompanyCode = "06"; //$scope.CompanyCode; 
        var config = { params: info, headers: { 'Accept': "application/json" } };
            $http.get("/Businessplan/DashboardBpCapacityJson", config).then(function(capacity) {
                if (capacity.status === 200) {
                    $scope.Buyerwise = setCapacityBuyerwise(capacity.data);
                    $scope.CapacityBuyerwise = capacity.data;
                }
            });
        } else {
            $scope.Message = "You have to select minimum one company and one Unit";
        }
    }
});
