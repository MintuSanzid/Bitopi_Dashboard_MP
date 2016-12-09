
var app = angular.module("app", ["ngDialog"]);

app.controller("ConfigurationController", function ($scope, $rootScope, $http, $filter, $window, ngDialog) {

    $scope.companyname = "Bitopi Group (BG)";
    var config = { params: null, headers: { 'Accept': "application/json" } };
    function openngDiologValidationUnit() {
        $http.get("/Configuration/DashboardCompanyJsonData").then(function (company) {
            if (company.data.length > 0 && company.status === 200) {
                $scope.Companies = company.data;
                //$scope.companycode = company.data[0].CompanyCode;
                //$scope.companyname = company.data[0].CompanyName + " (" + company.data[0].CompanyCode + ")";

                $scope.GroupTotal = $scope._getGroupTotalBudget(company.data);
                $scope.GroupTotalActual = $scope._getGroupTotalActual(company.data);
                $scope.GroupTotalExcess = ($scope.GroupTotalActual - $scope.GroupTotal);
                $http.get("/Configuration/DashboardDivisionJsonData").then(function (division) {
                    if (division.data.length > 0 && division.status === 200) {
                        $scope.Divisions = division.data;

                        $http.get("/Configuration/DashboardUnitJsonData").then(function (unit) {
                            if (unit.data.length > 0 && unit.status === 200) {
                                $scope.Units = unit.data;
                                $scope._insertDivisions();
                            }
                        });
                    }
                });
                //$http.get("/Configuration/DashboardUnitJsonData", config).then(function (unit) {
                //    if (unit.data.length > 0 && unit.status === 200)
                //        $scope.Units = unit.data;
                //    //$scope._insertDivisions();
                //});
            }
        });

        $http.get("/Configuration/DashboardDivisionJsonData").then(function (response) {
            if (response.data.length > 0 && response.status === 200) {
                $scope._divisions = response.data;
                //$scope.companycode = response.data[0].CompanyCode;
                //$scope.companyname = response.data[0].CompanyName + " (" + response.data[0].CompanyCode + ")";
            }
        });

        $http.get("/Configuration/DashboardUnitJsonData").then(function (response) {
            if (response.data.length > 0 && response.status === 200) {
                $scope._units = response.data;
                $scope.companytotal = $scope._getcompanytotal(response.data);
                $scope.companyUnallocated = response.data[0].Unallocated;
                $scope.companybudgeted = $scope.companytotal + response.data[0].Unallocated;
            }
        });
    }
    openngDiologValidationUnit();
    $scope._insertDivisions = function () {
        if ($scope.Companies.length > 0 && $scope.Divisions.length > 0) {
            for (var i = 0; i < $scope.Companies.length; i++) {
                var companycode = $scope.Companies[i].CompanyCode;

                var aDivisions = [];
                for (var j = 0; j < $scope.Divisions.length; j++) {
                    if (companycode === $scope.Divisions[j].CompanyCode) {
                        var aDivision = {};
                        aDivision.CompanyCode = $scope.Divisions[j].CompanyCode;
                        aDivision.CompanyName = $scope.Divisions[j].CompanyName;
                        aDivision.DivisionId = $scope.Divisions[j].DivisionId;
                        aDivision.DivisionName = $scope.Divisions[j].DivisionName;
                        aDivision.Budget = $scope.Divisions[j].Budget;
                        aDivision.Actual = $scope.Divisions[j].Actual;
                        aDivision.Shortage = $scope.Divisions[j].Shortage;
                        aDivision.Excess = $scope.Divisions[j].Excess;

                        $scope._insertUnits(companycode);
                        aDivision.Units = $scope.aCompanyUnits;
                        aDivisions.push(aDivision);
                    }
                }
                $scope.Companies[i].Divisions = aDivisions;
            }
        }
    }
    $scope._insertUnits = function (companycode) {
        if ($scope.Units.length > 0) {
            var units = [];
            for (var i = 0; i < $scope.Units.length; i++) {
                var value = $scope.Units[i].Excess;
                if ($scope.Units[i].CompanyCode === companycode) {
                    var aUnit = {};

                    aUnit.CompanyCode = $scope.Units[i].CompanyCode;
                    aUnit.CompanyName = $scope.Units[i].CompanyName;
                    aUnit.UnitCode = $scope.Units[i].UnitCode;
                    aUnit.UnitName = $scope.Units[i].UnitName;
                    aUnit.Budget = $scope.Units[i].Budget;
                    aUnit.Actual = $scope.Units[i].Actual;
                    aUnit.Shortage = value < 0 ? Math.abs(value) : 0;
                    aUnit.Excess = value > 0 ? value : 0; 
                    units.push(aUnit);
                }
            }
            $scope.aCompanyUnits = units;
        }
    }

    $scope._getshortage = function (shortage) {
        if (shortage > 0) {
            return shortage;
        } else {
            return 0;
        }
    }
    $scope._getexcess = function (shortage) {
        if (shortage < 0) {
            return Math.abs(shortage);
        } else {
            return 0;
        }
    }
    $scope._getcompanytotal = function (data) {
        var total = 0;
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                total = total + data[i].UnitTotal;
            }
        }
        return total;
    }
    $scope._getGroupTotalBudget = function (allCompany) {
        var gtotal = 0;
        for (var i = 0; i < allCompany.length; i++) {
            var total = allCompany[i].Budget;
            gtotal = parseInt(gtotal) + parseInt(total);
        }
        return gtotal;
    }
    $scope._getGroupTotalActual = function (allCompany) {
        var gtotal = 0;
        for (var i = 0; i < allCompany.length; i++) {
            var total = allCompany[i].Actual;
            gtotal = parseInt(gtotal) + parseInt(total);
        }
        return gtotal;
    }

    $scope.OpenngDiologValidation_Dept = function (event) {
        $scope.departments = [];
        var obj = event.target.title;
        var aCompany = obj.split("_");
        $scope.depts = [{ CompanyCode: "-(" + aCompany[0] + ")" }, { CompanyName: aCompany[1] }];

        var comobj = {};
        comobj.CompanyId = aCompany[0];
        comobj.UnitId = event.target.id;
        var config = { params: comobj, headers: { 'Accept': "application/json" } };
        $http.get("/Configuration/DashboardHrfDepartmentJson", config).then(function (dept) {
            if (dept.status === 200) {
                $http.get("/Configuration/DashboardHRFSectionJson", config).then(function (section) {
                    if (section.status === 200) {
                        $http.get("/Configuration/DashboardHrfSubSectionJson", config).then(function (subsection) {
                            if (subsection.data.length > 0 && subsection.status === 200) {

                                var insertedSectiondata = $scope.InsertSection(dept.data, section.data, subsection.data, comobj);
                                $scope.departments = insertedSectiondata;
                                $scope.cols = Object.keys($scope.departments[0]);
                            }

                        });
                    }
                });
            }
        });
        ngDialog.open({ template: "Validation_DepartmentList", controller: "ConfigurationController", className: "ngdialog-theme-default", scope: $scope });
    };
    $scope.InsertSection = function (dept, section, ssection, comobj) {
        if (dept.length > 0) {
            for (var i = 0; i < dept.length; i++) {
                comobj.deptId = dept[i].DeptId;
                var insertedSectiondata = [];
                for (var j = 0; j < section.length; j++) {

                    comobj.sectionId = section[j].SectionId;
                    if (section[j].DeptId === comobj.deptId && section[j].SectionId === comobj.sectionId) {

                        insertedSectiondata.push(section[j]);
                        $scope.insertedSubSection(insertedSectiondata, ssection, comobj);
                    }
                }
                for (var k = 0; k < insertedSectiondata.length; k++) {
                    delete insertedSectiondata[k].SectionId;
                    delete insertedSectiondata[k].DeptId;
                    if (insertedSectiondata[k].SubSections.length > 0) {
                        var sSection = insertedSectiondata[k].SubSections;
                        for (var l = 0; l < sSection.length; l++) {
                            delete sSection[l].DeptId;
                            delete sSection[l].SectionId;
                            delete sSection[l].SSectionId;
                        }
                    }
                }
                dept[i].Sections = insertedSectiondata;
                delete dept[i].DeptId;
            }
        };
        return dept;
    };
    $scope.insertedSubSection = function (sectiondata, sSection, comobj) {
        if (sectiondata.length > 0 && sSection.length > 0) {

            for (var j = 0; j < sectiondata.length; j++) {
                comobj.sectionId = sectiondata[j].SectionId;
                var subSections = [];

                for (var i = 0; i < sSection.length; i++) {
                    comobj.ssectionId = sSection[i].SSectionId;
                    if (sSection[i].DeptId === comobj.deptId && sSection[i].SectionId === comobj.sectionId && sSection[i].SSectionId === comobj.ssectionId) {

                        //delete sSection[i].SSectionId;
                        sSection[i].Action = [{
                            CompanyId: comobj.CompanyId, DivisionId: comobj.division, UnitId: comobj.UnitId, DepartmentId: comobj.deptId,
                            SectionId: comobj.sectionId, SubSectionId: comobj.ssectionId
                        }];
                        subSections.push(sSection[i]);
                        //$scope.insertedLine(insertedSectiondata, ssection, deptId, companyCode);
                    }
                    sectiondata[j].SubSections = subSections;
                    //delete sectiondata[j].SectionId;
                }
            }
        }
        return sectiondata;
    };
    $scope.OpenngDiologValidation = function () {
        ngDialog.open({ template: "Validation_Id", controller: "ConfigurationController", className: "ngdialog-theme-default", scope: $scope });
    };

    $scope._openExcessList = function (event) {
        $scope.companycode = event.target.id;
        $scope.companyname = event.target.title;
        $rootScope.companycode = event.target.id;
        $rootScope.companyname = event.target.title;
        $scope.Excessemployees = [];
        $http.get("/Configuration/DashboardExcessEmpList?companyCode=" + $scope.companycode).then(function (response) {
            if (response.data.length > 0 && response.status === 200) {
                $scope.Excessemployees = response.data;
            }
        });
        ngDialog.open({ template: "ExcessEmpList", controller: "ConfigurationController", className: "ngdialog-theme-default", scope: $scope });

    };
    $scope._openUnallocated = function (event) {
        $scope.companycode = event.target.id;
        $scope.companyname = event.target.title;
        $rootScope.companycode = event.target.id;
        $rootScope.companyname = event.target.title;
        $scope.employees = [];
        $http.get("/Configuration/DashboardUnallocatedEmpList?companyCode=" + $scope.companycode).then(function (response) {
            if (response.data.length > 0 && response.status === 200) {
                $scope.employees = response.data;
            }
        });
        ngDialog.open({ template: "UnallocatedEmpList_Table", controller: "ConfigurationController", className: "ngdialog-theme-default", scope: $scope });

    };
    $scope.ShowLineDetails = function (codes) {
        $scope.employees = [];
        var sa = $scope.companycode;
        var config = { params: codes, headers: { 'Accept': "application/json" } };
        $http.get("/Configuration/DashboardAllocatedEmpList", config).then(function (response) {
            if (response.data.length > 0 && response.status === 200) {
                $scope.employees = response.data;
            }
        });
        ngDialog.open({ template: "AllocatedEmpList", controller: "ConfigurationController", className: "ngdialog-theme-default", scope: $scope });

    }
    $scope.isArray = angular.isArray;
    $scope.toggleChildRow = function (event) {
        $("#target").toggle(function () {
            $("img#" + event.currentTarget.id).attr("src", "http://i.imgur.com/d4ICC.png");
            alert("First handler for .toggle() called.");
        }, function () {
            alert("Second handler for .toggle() called.");
        });



        $scope.id = 0;
        if (event.currentTarget.id !== 0 && $scope.expand === 1) {
            $("img#" + event.currentTarget.id).attr("src", "http://i.imgur.com/d4ICC.png");
            $scope.expand = 0;
        } else {
            $("img#" + event.currentTarget.id).attr("src", "http://i.imgur.com/SD7Dz.png");
            $scope.id = event.currentTarget.id;
            $scope.expand = 1;
        }
    }

    ///////////////// All Value Set ////////////////////


    ///////////////// Pages Render ////////////////////







    //In controller
    $scope.exportAction = function () {
        alert("hi");
        switch ($scope.export_action) {
            case "pdf": $scope.$broadcast("export-pdf", {});
                break;
            case "excel": $scope.$broadcast("export-excel", {});
                break;
            case "doc": $scope.$broadcast("export-doc", {});
                break;
            default: console.log("no event caught");
        }
    }


    function drawTable() {
        var data = [
                      {
                          id: 1,
                          firstName: "Peter",
                          lastName: "Jhons"
                      },
                  {
                      id: 2,
                      firstName: "David",
                      lastName: "Bowie"
                  }
        ];
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
    }
    drawTable();

    function drawRow(rowData) {
        var row = $("<tr />");
        $("#personDataTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td>" + rowData.id + "</td>"));
        row.append($("<td>" + rowData.firstName + "</td>"));
        row.append($("<td>" + rowData.lastName + "</td>"));
    }

    $scope._qualityMetrics = [
        { id: 1, metrictype: "quality", key: "SDUserStoryClosure", name: "1. Central Division" },
        { id: 2, metrictype: "quality", key: "SDTestPassFailOverTime", name: "2. General Division" },
        { id: 3, metrictype: "quality", key: "SDDefectMttrInternal", name: "3. Grarment Division" },
        { id: 4, metrictype: "quality", key: "SDDefectsFoundInHardening", name: "4. Corporate Division" },
        { id: 5, metrictype: "quality", key: "SDDefectClosureInternal", name: "5. Washing Division" }
    ];

    //$scope._units = [
    //    { id: 1111, key: "Key1", name: "Unit General" },
    //    { id: 2222, key: "Key1", name: "Unit Washing" },
    //    { id: 3333, key: "Key1", name: "Unit One" },
    //    { id: 4444, key: "Key1", name: "Unit Two" },
    //    { id: 5555, key: "Key1", name: "Unit Three" },
    //    { id: 6666, key: "Key1", name: "Unit Four" }
    //];
    $scope._catagories = ["Production & Quality", "Production & Suport Direct", "Production & Suport Indirect"];
    $scope._departments = [
        "General", "Project & Development", "Development & Sampling", "Marketing & Merchandising",
        "Planning & Co-Ordination", "Sorcing & Supply Chain", "Finance & Accounts", "Commercial",
        "Production", "Quality", "QA, Audit & Technical", " IE & Production Acconting", "Maintenance",
        "Utility & Engineering", "HR/Personnel/Admin/Compliance", "IT & DSS"
    ];

    $scope._sections = ["General", "Planning", "Project", "Design Studio", "Merchandising", "CAD & Pattern", "Sampling",
        "Research & Development", "Development", "Technical", "Lab", "Raw Material", "Cutting", "Sewing", "Dry Process",
        "Wet Process", "Pressing & Curing", "Finishing CPU", "Finishing", "Audit", "Industrial Engineering", "Production Accounting",
        "Material Handling & Movement", "Maintenance", "Preventive Maintenance", "Regular Maintenance", "Power", "Steam & Condensate",
        "Air, Vacume & Air Cooling", "WTP, ETP & RO", "Electro-Mechnical", "Electronics", "HR", "Personnel", "Administration",
        "Compliance", "Industrial Relations", "Welfare", "Security", "Accounts", "MIS", "Commercial", "Store & Warehouse",
        "Finish Goods Warehouse", "DSS", "IT", "Supply Chain (Production)", "Supply Chain (Non-Production)", "Laboratory",
        "Embroidery"];

    $scope.activities = ["General", "Washing", "Unit One", "Unit Two", "Unit Three", "Unit Four"];
    $scope.priorities = ["Critical", "High", "Medium", "Low"];

    $scope.loadPartialSection = function (section) {
        var detailDiv = $("#section_1");
        $.get("/Configuration/DisplaySection", function (data) {
            detailDiv.html(data);
            return false;
        });
    }


    ///// New Company Object //////
    $scope._designationObj = [
        { id: 1, empname: "", name: "Managing Director" },
        { id: 1, empname: "", name: "Dy. Managing Director" },
        { id: 1, empname: "", name: "Director " },
        { id: 1, empname: "", name: "Chief Executive Officer " },
        { id: 1, empname: "", name: "Executive Director " },
        { id: 1, empname: "", name: "Chief Operating Officer " },
        { id: 1, empname: "", name: "Chief Financial Officer " },
        { id: 1, empname: "", name: "Marketing Head " },
        { id: 1, empname: "", name: "Operation Head " },
        { id: 1, empname: "", name: "Unit Head " },
        { id: 1, empname: "", name: "Assistant Chief Financial Officer " },
        { id: 1, empname: "", name: "Senior General Manager " },
        { id: 1, empname: "", name: "General Manager " },
        { id: 1, empname: "", name: "Deputy General Manager " },
        { id: 1, empname: "", name: "Assistant General Manager " },
        { id: 1, empname: "", name: "Senior Manager " },
        { id: 1, empname: "", name: "Manager " },
        { id: 1, empname: "", name: "Deputy Manager " },
        { id: 1, empname: "", name: "Assistant Manager " },
        { id: 1, empname: "", name: "Management Trainee " },
        { id: 1, empname: "", name: "Senior Executive " },
        { id: 1, empname: "", name: "Executive " },
        { id: 1, empname: "", name: "Deputy Executive " },
        { id: 1, empname: "", name: "Assistant Executive " },
        { id: 1, empname: "", name: "Executive Trainee " },
        { id: 1, empname: "", name: "Senior Officer " },
        { id: 1, empname: "", name: "Officer " },
        { id: 1, empname: "", name: "Deputy Officer " },
        { id: 1, empname: "", name: "Assistant Officer " },
        { id: 1, empname: "", name: "Officer Trainee " },
        { id: 1, empname: "", name: "Senior Front Line Manager " },
        { id: 1, empname: "", name: "Front Line Manager " },
        { id: 1, empname: "", name: "Senior Assistant " },
        { id: 1, empname: "", name: "Assistant " },
        { id: 1, empname: "", name: "Junior Assistant " },
        { id: 1, empname: "", name: "Assistant Trainee " },
        { id: 1, empname: "", name: "Senior Supervisor " },
        { id: 1, empname: "", name: "Supervisor " },
        { id: 1, empname: "", name: "Assistant Supervisor " },
        { id: 1, empname: "", name: "Supervisor Trainee " },
        { id: 1, empname: "", name: "Senior Technician " },
        { id: 1, empname: "", name: "Technician " },
        { id: 1, empname: "", name: "Junior Technician " },
        { id: 1, empname: "", name: "Assistant Technician " },
        { id: 1, empname: "", name: "Technician Trainee " },
        { id: 1, empname: "", name: "Other " },
        { id: 1, empname: "", name: "Senior Auditor " },
        { id: 1, empname: "", name: "Auditor " },
        { id: 1, empname: "", name: "Junior Auditor " },
        { id: 1, empname: "", name: "Special Operator " },
        { id: 1, empname: "", name: "Senior Operator " },
        { id: 1, empname: "", name: "Operator " },
        { id: 1, empname: "", name: "Junior Operator " },
        { id: 1, empname: "", name: "Assistant Operator" },
        { id: 1, empname: "", name: "Trainee Operator " },
        { id: 1, empname: "", name: "Senior Checker " },
        { id: 1, empname: "", name: "Checker " },
        { id: 1, empname: "", name: "Junior Checker " },
        { id: 1, empname: "", name: "Checker Trainee " },
        { id: 1, empname: "", name: "Special Helper " },
        { id: 1, empname: "", name: "Senior Helper " },
        { id: 1, empname: "", name: "Helper " },
        { id: 1, empname: "", name: "Doctor " },
        { id: 1, empname: "", name: "Office Boy " },
        { id: 1, empname: "", name: "Driver " },
        { id: 1, empname: "", name: "Gardener " },
        { id: 1, empname: "", name: "Cleaner " },
        { id: 1, empname: "", name: "Security Guard" }
    ];
    $scope._designationgpObj = [
        { id: 1, designation: $scope._designationObj, name: "Unclassified" },
        { id: 1, designation: $scope._designationObj, name: "CEO/ED " },
        { id: 1, designation: $scope._designationObj, name: "COO/CFO " },
        { id: 1, designation: $scope._designationObj, name: "GM/ACFO " },
        { id: 1, designation: $scope._designationObj, name: "Manager " },
        { id: 1, designation: $scope._designationObj, name: "Executive " },
        { id: 1, designation: $scope._designationObj, name: "Officer " },
        { id: 1, designation: $scope._designationObj, name: "Supervisor" },
        { id: 1, designation: $scope._designationObj, name: "Assistant " },
        { id: 1, designation: $scope._designationObj, name: "Technicial & Other " },
        { id: 1, designation: $scope._designationObj, name: "Auditor " },
        { id: 1, designation: $scope._designationObj, name: "Operator " },
        { id: 1, designation: $scope._designationObj, name: "Checker " },
        { id: 1, designation: $scope._designationObj, name: "Helper " },
        { id: 1, designation: $scope._designationObj, name: "Other " },
        { id: 1, designation: $scope._designationObj, name: "Trainee " },
        { id: 1, designation: $scope._designationObj, name: "Cleaner" }
    ];
    $scope.emptypeObj = [
        { id: 1, designationgp: $scope._designationgpObj, name: "Staff" },
        { id: 1, designationgp: $scope._designationgpObj, name: "Sub-Staff" },
        { id: 1, designationgp: $scope._designationgpObj, name: "Worker" },
        { id: 1, designationgp: $scope._designationgpObj, name: "Other" }
    ];
    $scope._misamiLineObj = [
        { id: 1, name: "Line-01", empType: $scope.emptypeObj },
        { id: 1, name: "Line-02", empType: $scope.emptypeObj },
        { id: 1, name: "Line-03", empType: $scope.emptypeObj },
        { id: 1, name: "Line-04", empType: $scope.emptypeObj },
        { id: 1, name: "Line-05", empType: $scope.emptypeObj },
        { id: 1, name: "Line-06", empType: $scope.emptypeObj },
        { id: 1, name: "Line-07", empType: $scope.emptypeObj },
        { id: 1, name: "Line-08", empType: $scope.emptypeObj },
        { id: 1, name: "Line-09", empType: $scope.emptypeObj },
        { id: 1, name: "Line-10", empType: $scope.emptypeObj },
        { id: 1, name: "Line-11", empType: $scope.emptypeObj },
        { id: 1, name: "Line-12", empType: $scope.emptypeObj },
        { id: 1, name: "Line-13", empType: $scope.emptypeObj },
        { id: 1, name: "Line-14", empType: $scope.emptypeObj },
        { id: 1, name: "Line-15", empType: $scope.emptypeObj }
    ];

    $scope._misamiSubsectionObj = [
        { Id: 1, _subsection: $scope._misamiLineObj, name: "General" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Project" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Planning" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Project & Process Development" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "CAD & Pattern" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Development" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Sampling" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-1" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-2" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-3" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-4" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-5" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-6" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-7" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-8" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Merch-9" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Quality Assurance" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Technical" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Pilot Line" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Lab" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Buyer Audit" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Job-Work" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Production Accounting" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Material Handling & Movement" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Marker Checking" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Input Control" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Laying" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Cutting" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Fusing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Numbering" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Bundling" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Parts Checking" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Parts Replacement" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Sewing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Sewing Line" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Batch Making" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Spray & Dry" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Special Finish" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Curing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Washing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Hydro" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Drying" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Finishing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Finishing CPU" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Finishing Line" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Pressing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Legger & Topper" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Spot Removing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Mending" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Killed Garments" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Surplus Garment" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Packing" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Dispatch" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Rechecking" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Surplus & Rejection" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "General Maintenance" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Maintenance" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Needle Control & Product Safety" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Power Generation & Distribution" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Boiler & Condensate" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Air Compressor & Vacuum" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Air Conditioning & Cooling" },
        { Id: 1, _subsection: $scope._misamiLineObj, name: "Wtp" }
    ];
    $scope.misamiSubSectionObj = [
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "General" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Planning" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Project" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Design Studio" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Merchandising" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "CAD & Pattern" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Sampling" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Research & Development" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Development" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Technical" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Lab" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Raw Material" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Cutting" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Sewing" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Dry Process" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Wet Process" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Pressing & Curing" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Finishing CPU" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Finishing" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Audit" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Industrial Engineering" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Production Accounting" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Material Handling & Movement" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Maintenance" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Preventive Maintenance" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Regular Maintenance" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Power" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Steam & Condensate" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Air, Vacume & Air Cooling" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "WTP, ETP & RO" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Electro-Mechnical" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Electronics" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "HR" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Personnel" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Administration" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Compliance" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Industrial Relations" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Welfare" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Security" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Accounts" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "MIS" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Commercial" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Store & Warehouse" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Finish Goods Warehouse" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "DSS" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "IT" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Supply Chain (Production)" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Supply Chain (Non-Production)" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Laboratory" },
        { id: 1, _subsections: $scope._misamiSubsectionObj, name: "Embroidery" }
    ];
    var misamiSectionObj = [
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "General" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Planning" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Project" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Design Studio" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Merchandising" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "CAD & Pattern" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Sampling" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Research & Development" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Development" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Technical" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Lab" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Raw Material" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Cutting" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Sewing" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Dry Process" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Wet Process" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Pressing & Curing" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Finishing CPU" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Finishing" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Audit" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Industrial Engineering" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Production Accounting" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Material Handling & Movement" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Maintenance" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Preventive Maintenance" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Regular Maintenance" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Power" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Steam & Condensate" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Air, Vacume & Air Cooling" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "WTP, ETP & RO" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Electro-Mechnical" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Electronics" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "HR" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Personnel" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Administration" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Compliance" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Industrial Relations" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Welfare" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Security" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Accounts" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "MIS" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Commercial" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Store & Warehouse" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Finish Goods Warehouse" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "DSS" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "IT" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Supply Chain (Production)" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Supply Chain (Non-Production)" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Laboratory" },
        { id: 1, _subsections: $scope.misamiSubSectionObj, name: "Embroidery" }
    ];
    var misamiDepartmentsObj = [
        { id: 1, _sections: misamiSectionObj, name: "General" },
        { id: 2, _sections: misamiSectionObj, name: "Project & Development" },
        { id: 3, _sections: misamiSectionObj, name: "Development & Sampling" },
        { id: 4, _sections: misamiSectionObj, name: "Marketing & Merchandising" },
        { id: 5, _sections: misamiSectionObj, name: "Planning & Co-Ordination" },
        { id: 5, _sections: misamiSectionObj, name: "Sorcing & Supply Chain" },
        { id: 1, _sections: misamiSectionObj, name: "Finance & Accounts" },
        { id: 2, _sections: misamiSectionObj, name: "Commercial" },
        { id: 3, _sections: misamiSectionObj, name: "Production" },
        { id: 4, _sections: misamiSectionObj, name: "Quality" },
        { id: 5, _sections: misamiSectionObj, name: "QA, Audit & Technical" },
        { id: 5, _sections: misamiSectionObj, name: "IE & Production Acconting" },
        { id: 1, _sections: misamiSectionObj, name: "Maintenance" },
        { id: 2, _sections: misamiSectionObj, name: "Utility & Engineering" },
        { id: 3, _sections: misamiSectionObj, name: "HR/Personnel/Admin/Compliance" },
        { id: 4, _sections: misamiSectionObj, name: "IT & DSS" }
    ];
    var misamiCatagoriesObj = [
        { id: 1, _departments: misamiDepartmentsObj, name: "Production & Quality" },
        { id: 2, _departments: misamiDepartmentsObj, name: "Production & Suport Direct" },
        { id: 3, _departments: misamiDepartmentsObj, name: "Production & Suport Indirect" }
    ];
    $scope._misami_unitsObj = [
        { id: 1, _catagories: misamiCatagoriesObj, name: "General" },
        { id: 2, _catagories: misamiCatagoriesObj, name: "Washing" },
        { id: 3, _catagories: misamiCatagoriesObj, name: "Unit One" },
        { id: 4, _catagories: misamiCatagoriesObj, name: "Unit Two" },
        { id: 5, _catagories: misamiCatagoriesObj, name: "Unit Three" },
        { id: 5, _catagories: misamiCatagoriesObj, name: "Unit Four" }
    ];
    $scope._misamiGrarments = [
        { id: 1, _units: $scope._misami_unitsObj, key: "centraldivision", name: "1. Central Division" },
        { id: 2, _units: $scope._misami_unitsObj, key: "generaldivision", name: "2. General Division" },
        { id: 3, _units: $scope._misami_unitsObj, key: "grarmentdivision", name: "3. Grarment Division" },
        { id: 4, _units: $scope._misami_unitsObj, key: "corporatedivision", name: "4. Corporate Division" },
        { id: 5, _units: $scope._misami_unitsObj, key: "washingdivision", name: "5. Washing Division" }
    ];
    var test = $scope._misamiGrarments;

    ///// End of New Company  Object//////

    $scope.greenColors = [
        "#007f00",
        "#009900",
        "#00b200",
        "#00cc00",
        "#00e500",
        "#00ff00",
        "#32ff32",
        "#66ff66",
        "#7fff7f",
        "#99ff99",
        "#b2ffb2",
        "#ccffcc"
    ];
    $scope.redColors = [
        "#b30000",
        "#cc0000",
        "#e60000",
        "#ec1414",
        "#ff0000",
        "#ff1818",
        "#ff3232",
        "#ff4c4c",
        "#ff6666",
        "#ff7f7f",
        "#ff9999",
        "#ffb2b2"
    ];
    $scope.yellowColors = [
        "#979900",
        "#b1b200",
        "#cacc00",
        "#e3e500",
        "#fdff19",
        "#fdff32",
        "#fdff4c",
        "#fdff66",
        "#feff7f",
        "#feff99",
        "#feffb2",
        "#feffcc"
    ];

    /////////////// Pages Render ////////////////////
    $scope.OpenG = function () {
        var hasid = ($("#greenUl").has("li").length ? "Yes" : "No");
        if (hasid === "No") {
            $("#greenAdd").append("<ul id=\"greenUl\"> </ul>");
            for (var i = 0; i < $scope.greenColors.length; i++) {
                var id = "<li style=\"background-color: " + $scope.greenColors[i] + ";height: 20px;\" class=\"col-md-1 col-sm-1 col-xs-1\" onclick=\"_setG(this)\"></li>";
                $("#greenUl").append(id);
            }
        } else {
            $("#greenUl").remove();
        }
    }
    $scope.OpenR = function () {
        var hasid = ($("#redUl").has("li").length ? "Yes" : "No");
        if (hasid === "No") {
            $("#redAdd").append("<ul id=\"redUl\"> </ul>");
            for (var i = 0; i < $scope.redColors.length; i++) {
                var id = "<li style=\"background-color: " + $scope.redColors[i] + ";height: 20px;\" class=\"col-md-1 col-sm-1  col-xs-1\" onclick=\"_setR(this)\"></li>";
                $("#redUl").append(id);
            }
        }
        else {
            $("#redUl").remove();
        }
    }
    $scope.OpenY = function () {
        var hasid = ($("#yelloUl").has("li").length ? "Yes" : "No");
        if (hasid === "No") {
            $("#yellowAdd").append("<ul id=\"yelloUl\"> </ul>");
            for (var i = 0; i < $scope.yellowColors.length; i++) {
                var id = "<li style=\"background-color: " + $scope.yellowColors[i] + ";height: 20px;\" class=\"col-md-1 col-sm-1  col-xs-1\" onclick=\"_setY(this)\"></li>";
                $("#yelloUl").append(id);
            }
        } else {
            $("#yelloUl").remove();
        }
    }

    //////////////// Thumbnail Validation /////////////////////
    $scope.changeQualityThumbnail = function (tcb) {

        var qualityMetrics = $scope._qualityMetrics;
        var count = 0;
        var value;
        for (var i = 0; i < qualityMetrics.length; i++) {
            if (count <= 4) {
                value = $("#_quality_" + qualityMetrics[i].key + "_Thumbnail").prop("checked");
                if (value && count < 5) {
                    count++;
                    if (count === 5) {
                        $("#_quality_" + tcb._qmetrics.key + "_Thumbnail").prop("checked", false);
                        value = false;
                    }
                }

            } else {
                if (value) {
                    $("#_quality_" + tcb._qmetrics.key + "_Thumbnail").prop("checked", false);
                    value = false; count--;
                }
            }
        }
        if (count === 5) {
            count--;
            alert("Sorry, Your have exits the maximum " + count + " number of Metrics thumbnail");
        } else {
            alert("Your have select the " + count + " number of Metrics thumbnail");
        }
    }
    $scope.changeCmetricsThumbnail = function (tcb) {

        var qualityMetrics = $scope._ConstraintsMetrics;
        var count = 0;
        var value;
        for (var i = 0; i < qualityMetrics.length; i++) {
            if (count <= 4) {
                value = $("#_cmetrics_" + qualityMetrics[i].key + "_Thumbnail").prop("checked");
                if (value && count < 5) {
                    count++;
                    if (count === 5) {
                        $("#_cmetrics_" + tcb._cmetrics.key + "_Thumbnail").prop("checked", false);
                        value = false;
                    }
                }

            } else {
                if (value) {
                    $("#_cmetrics_" + tcb._cmetrics.key + "_Thumbnail").prop("checked", false);
                    value = false;
                    count--;
                }
            }
        }
        if (count === 5) {
            count--;
            alert("Sorry, Your have exits the maximum " + count + " number of Metrics thumbnail");
        } else {
            alert("Your have select the " + count + " number of Metrics thumbnail");
        }
    }
    $scope.changeValueThumbnail = function (tcb) {

        var qualityMetrics = $scope._ValueMetrics;
        var count = 0;
        var value;
        for (var i = 0; i < qualityMetrics.length; i++) {
            if (count <= 4) {
                value = $("#_value_" + qualityMetrics[i].key + "_Thumbnail").prop("checked");
                if (value && count < 5) {
                    count++;
                    if (count === 5) {
                        $("#_value_" + tcb._value.key + "_Thumbnail").prop("checked", false);
                        value = false;
                    }
                }


            } else {
                if (value) {
                    $("#_value_" + tcb._value.key + "_Thumbnail").prop("checked", false);
                    value = false; count--;
                }
            }
        }
        if (count === 5) {
            count--;
            alert("Sorry, Your have exits the maximum " + count + " number of Metrics thumbnail");
        } else {
            alert("Your have select the " + count + " number of Metrics thumbnail");
        }

    }
    //////////////// End Of Thumbnail Validation /////////////////////

});

(function () {
    //export html table to pdf, excel and doc format directive
    var exportTable = function () {
        var link = function ($scope, elm, attr) {
            $scope.$on("export-pdf", function (e, d) {
                elm.tableExport({ type: "pdf", escape: "false" });
            });
            $scope.$on("export-excel", function (e, d) {
                elm.tableExport({ type: "excel", escape: false });
            });
            $scope.$on("export-doc", function (e, d) {
                elm.tableExport({ type: "doc", escape: false });
            });
        }
        return {
            restrict: "C",
            link: link
        }
    }
    //angular.module("CustomDirectives", [])
    app.directive("exportTable", exportTable);
})();

var renderTable = function () {

    function fnFormatDetails(tableId, html) {
        var sOut = "<table id=\"exampleTable_" + tableId + "\">";
        sOut += html;
        sOut += "</table>";
        return sOut;
    }

    var iTableCounter = 1;
    var oTable;
    var oInnerTable;
    var tableHtml;

    //Run On HTML Build
    $(document).ready(function () {
        //tableHtml = $("#exampleTable").html();


        //Insert a 'details' column to the table
        var nCloneTh = document.createElement("th");
        var nCloneTd = document.createElement("td");
        nCloneTd.innerHTML = '<img src="http://i.imgur.com/SD7Dz.png">';
        nCloneTd.className = "center";

        $("#exampleTable thead tr").each(function () {
            this.insertBefore(nCloneTh, this.childNodes[0]);
        });

        $("#exampleTable tbody tr").each(function () {
            this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
        });

        //Initialse DataTables, with no sorting on the 'details' column
        oTable = $("#exampleTable").dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "aoColumnDefs": [{ "bSortable": false, "aTargets": [0] }],
            "aaSorting": [[1, "asc"]]
        });

        /* Add event listener for opening and closing details
        * Note that the indicator for showing which row is open is not controlled by DataTables,
        * rather it is done here
        */
        $(document).on("click", "#exampleTable tbody td img", function () {
            tableHtml = $("#example").html();
            alert("hi");
            var nTr = $("#example").parents("tr")[0];
            //if (oTable.fnIsOpen(nTr)) {
            //    /* This row is already open - close it */
            //    this.src = "http://i.imgur.com/SD7Dz.png";
            //    oTable.fnClose(nTr);
            //}
            //else {
            /* Open this row */
            this.src = "http://i.imgur.com/d4ICC.png";
            oTable.fnOpen(nTr, fnFormatDetails(iTableCounter, tableHtml), "details");
            oInnerTable = $("#example" + iTableCounter).dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers"
            });
            iTableCounter = iTableCounter + 1;
            //}
        });


    });
};

