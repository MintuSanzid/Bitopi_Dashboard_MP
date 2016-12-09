
var app = angular.module("app", ["ngDialog"]);

app.controller("ColorController", function ($scope, $http, $window, ngDialog) { 

    /////// Default Value Set ////////////////
    $scope.Symbols = [{ "Id": "<", "Symbol": "<" }, { "Id": ">", "Symbol": ">" }, { "Id": "≬", "Symbol": "≬" }];
    $scope.Symbol = [{ "Id": "%", "Symbol": "%" }];
    var parameters = { keyword: $scope.keyword };
    var config = { params: parameters };
    $scope.changeRangeRedshow = function (redsymbol, metric) {
        //var valueSelectedN = $scope._getUpId(redsymbol, metric, color);
        if (redsymbol === "≬") {
            $(metric).show();
        } else {
            $(metric).hide();
        }
    };
    $scope.changeRangeYellowshow = function (redsymbol, metric) {
        if (redsymbol === "≬") {
            $(metric).show();
        } else {
            $(metric).hide();
        }
    };
    $scope.changeRangeGreenshow = function (redsymbol, metric) {
        if (redsymbol === "≬") {
            $(metric).show();
        } else {
            $(metric).hide();
        }
    };

    $scope.changeRangeRed = function (e, metric, color) {
        var valueSelectedN = $scope._getUpId(e, metric, color);
        if (e._Red_Symbol === "≬") {
            $("#" + valueSelectedN + "_Up").show();
        } else {
            $("#" + valueSelectedN + "_Up").hide();
        }
    };
    $scope.changeRangeYellow = function (e, metric, color) {
        var valueSelectedN = $scope._getUpId(e, metric, color);
        if (e._Yellow_Symbol === "≬") {
            $("#" + valueSelectedN + "_Up").show();
        } else {
            $("#" + valueSelectedN + "_Up").hide();
        }
    };
    $scope.changeRangeGreen = function (e, metric, color) {
        var valueSelectedN = $scope._getUpId(e, metric, color);
        if (e._Green_Symbol === "≬") {
            $("#" + valueSelectedN + "_Up").show();
        } else {
            $("#" + valueSelectedN + "_Up").hide();
        }
    };
    $scope._getUpId = function (e, metric, color) {
        var valueSelectedN = null;
        if (metric === "_qmetrics_") {
            valueSelectedN = metric + e._qmetrics.key + color;
        }
        if (metric === "_cmetrics_") {
            valueSelectedN = metric + e._cmetrics.key + color;
        }
        if (metric === "_values_") {
            valueSelectedN = metric + e._values.key + color;
        }
        return valueSelectedN;
    }
    $scope.changeProjectName = function () {
        getMetricValueFromDb($scope.Color_ProjectName_Update);
    };
    /////// Default Value Set ////////////////
    function loadProjectForDdl() {
        $http.get("/Project/GetProjects", config).success(function (data, status, headers, config) {
            $scope.Projects = data;
            $scope.Project_Project = $scope.Projects[0];
            $scope._MIF_Symbol = "%";
        });
    };
    loadProjectForDdl();
    //headers: {'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
    function getMetricValueFromDb(projectId) {
        var config = { params: { projectid: projectId } };
        $http.get("/Color/_ColorJsonResult", config).success(function (data, status, headers, config) {
            if (data !== "") {
                $scope.AllMetrics = data;
                $scope.setMetricColor(data);
            } else {
              //  $window.location.reload();
            }
           
        }).error(function(data, status, header, config) {
            $window.location.reload();
        });
    };
    getMetricValueFromDb(null);
    
    ///////////////// value Change /////////////////

    $scope.setMetricColor = function (parameters) {
        var array = $.map(parameters, function (value, name) { return { name: name, value: value }; });
        $scope.Color_ProjectName_Update = array[0].value.ProjectId; 
        for (var i = 0; i < array.length; i++) {
            ////// for _qmetrics_ ////
            $scope.changeRangeRedshow(array[i].value.RedSymbol, "#_qmetrics_SD" + array[i].name + "_Red_Symbol_Up");
            $scope.changeRangeYellowshow(array[i].value.YellowSymbol, "#_qmetrics_SD" + array[i].name + "_Yellow_Symbol_Up");
            $scope.changeRangeGreenshow(array[i].value.GreenSymbol, "#_qmetrics_SD" + array[i].name + "_Green_Symbol_Up");

            $scope.changeRangeRedshow(array[i].value.RedSymbol, "#_cmetrics_SD" + array[i].name + "_Red_Symbol_Up");
            $scope.changeRangeYellowshow(array[i].value.YellowSymbol, "#_cmetrics_SD" + array[i].name + "_Yellow_Symbol_Up");
            $scope.changeRangeGreenshow(array[i].value.GreenSymbol, "#_cmetrics_SD" + array[i].name + "_Green_Symbol_Up");

            $scope.changeRangeRedshow(array[i].value.RedSymbol, "#_values_SD" + array[i].name + "_Red_Symbol_Up");
            $scope.changeRangeYellowshow(array[i].value.YellowSymbol, "#_values_SD" + array[i].name + "_Yellow_Symbol_Up");
            $scope.changeRangeGreenshow(array[i].value.GreenSymbol, "#_values_SD" + array[i].name + "_Green_Symbol_Up");

            $("#_qmetrics_SD" + array[i].name + "_Red").val(array[i].value.RedLowest);
            $("#_qmetrics_SD" + array[i].name + "_Red_Symbol").val("string:" + array[i].value.RedSymbol);
            $("#_qmetrics_SD" + array[i].name + "_Red_Symbol_Up").val(array[i].value.RedHighest);

            $("#_qmetrics_SD" + array[i].name + "_Yellow").val(array[i].value.YellowLowest);
            $("#_qmetrics_SD" + array[i].name + "_Yellow_Symbol").val("string:" + array[i].value.YellowSymbol);
            $("#_qmetrics_SD" + array[i].name + "_Yellow_Symbol_Up").val(array[i].value.YellowHighest);

            $("#_qmetrics_SD" + array[i].name + "_Green").val(array[i].value.GreenLowest);
            $("#_qmetrics_SD" + array[i].name + "_Green_Symbol").val("string:" + array[i].value.GreenSymbol);
            $("#_qmetrics_SD" + array[i].name + "_Green_Symbol_Up").val(array[i].value.GreenHighest);

            $("#_qmetrics_SD" + array[i].name + "_MIF").val(array[i].value.MIF);
            ////// for _qmetrics_ ////

            ////// for _cmetrics_ ////
            $("#_cmetrics_SD" + array[i].name + "_Red").val(array[i].value.RedLowest);
            $("#_cmetrics_SD" + array[i].name + "_Red_Symbol").val("string:" + array[i].value.RedSymbol);
            $("#_cmetrics_SD" + array[i].name + "_Red_Symbol_Up").val(array[i].value.RedHighest);

            $("#_cmetrics_SD" + array[i].name + "_Yellow").val(array[i].value.YellowLowest);
            $("#_cmetrics_SD" + array[i].name + "_Yellow_Symbol").val("string:" + array[i].value.YellowSymbol);
            $("#_cmetrics_SD" + array[i].name + "_Yellow_Symbol_Up").val(array[i].value.YellowHighest);

            $("#_cmetrics_SD" + array[i].name + "_Green").val(array[i].value.GreenLowest);
            $("#_cmetrics_SD" + array[i].name + "_Green_Symbol").val("string:" + array[i].value.GreenSymbol);
            $("#_cmetrics_SD" + array[i].name + "_Green_Symbol_Up").val(array[i].value.GreenHighest);

            $("#_cmetrics_SD" + array[i].name + "_MIF").val(array[i].value.MIF);
            ////// for _cmetrics_ ////

            ////// for _qmetrics_ //// #_values_SDRequirementDecompositionRate_Red
            $("#_values_SD" + array[i].name + "_Red").val(array[i].value.RedLowest);
            $("#_values_SD" + array[i].name + "_Red_Symbol").val("string:" + array[i].value.RedSymbol);
            $("#_values_SD" + array[i].name + "_Red_Symbol_Up").val(array[i].value.RedHighest);
                   
            $("#_values_SD" + array[i].name + "_Yellow").val(array[i].value.YellowLowest);
            $("#_values_SD" + array[i].name + "_Yellow_Symbol").val("string:" + array[i].value.YellowSymbol);
            $("#_values_SD" + array[i].name + "_Yellow_Symbol_Up").val(array[i].value.YellowHighest);
                    
            $("#_values_SD" + array[i].name + "_Green").val(array[i].value.GreenLowest);
            $("#_values_SD" + array[i].name + "_Green_Symbol").val("string:" + array[i].value.GreenSymbol);
            $("#_values_SD" + array[i].name + "_Green_Symbol_Up").val(array[i].value.GreenHighest);
                    
            $("#_values_SD" + array[i].name + "_MIF").val(array[i].value.MIF);
            ////// for _qmetrics_ ////
        }
    };
    $scope.qMetricsMIFValueChange = function () {
        var total = 0;
        for (var i = 0; i < $scope._qualityMetrics.length; i++) {
            total = total + parseInt($("#_qmetrics_" + $scope._qualityMetrics[i].key + "_MIF").val());
        }
        if (total > 100) {
            alert("MIF total for all Quality Metrics should be 100. Current total is " + total + ".");
            total = 0;
            //$("#_qmetrics_" + $scope._qualityMetrics[i].key + "_MIF").val(total);
        }
    }
    $scope.cMetricsMIFValueChange = function () {
        var total = 0;
        for (var i = 0; i < $scope._constraintsMetrics.length; i++) {
            total = total + parseInt($("#_cmetrics_" + $scope._constraintsMetrics[i].key + "_MIF").val());
        }
        if (total > 100) {
            alert("MIF total for all Constraint Metrics should be 100. Current total is " + total + ".");
            total = 0;
        }
    }
    $scope.vMetricsMIFValueChange = function () {
        var total = 0;
        for (var i = 0; i < $scope._valuesMetrics.length; i++) {
            total = total + parseInt($("#_values_" + $scope._valuesMetrics[i].key + "_MIF").val());
        }
        if (total > 100) {
            alert("MIF total for all Value Metrics should be 100. Current total is " + total + ".");
            total = 0;
        }
    }

    /////////////// Data Save to Db ////////////////////

    $scope.save = function () {
        var projectid = $scope.Color_ProjectName_Update;
        if (projectid !== "-1") {
            $scope.btndisabled = true;
            var allMetrixObj = $scope.getUpdateColorfiguration();
            $http.post("/Color/Update", allMetrixObj).success(function (returnData) {
                $("#msg").text("Data Updated Successfully!");
                $scope.btndisabled = false;
            }).error(function (message) {
                $("#msg").text(" There was an Error updating your changes! ");
            });
        }
        return true;
    };
    $scope._getSettingsGlobalEntity = function () {
        var aProject = {
            Id: $scope.Color_ProjectName_Update,
            Name: $("#Color_ProjectName_Update option:selected").text()
        }
        return aProject;
    };
    $scope.getUpdateColorfiguration = function () {
        return $scope._getRedColorMetrics();
    };

    $scope._getRedColorMetrics = function () {

        var config = {
            RequirementDecompositionRate: $scope._getQualityMetricsValue("RequirementDecompositionRate"),
            UserStoryConsumptionRate: $scope._getQualityMetricsValue("UserStoryConsumptionRate"),
            FeatureComprehension: $scope._getQualityMetricsValue("FeatureComprehension"),
            CostPerformanceIndex: $scope._getQualityMetricsValue("CostPerformanceIndex"),
            Budget: $scope._getQualityMetricsValue("Budget"),
            TeamAssessments: $scope._getQualityMetricsValue("TeamAssessments"),
            SprintTargets: $scope._getQualityMetricsValue("SprintTargets"),
            Accuracy: $scope._getQualityMetricsValue("Accuracy"),
            Scopechange: $scope._getQualityMetricsValue("Scopechange"),
            Velocity: $scope._getQualityMetricsValue("Velocity"),
            Capacity: $scope._getQualityMetricsValue("Capacity"),
            BurndownCharts: $scope._getQualityMetricsValue("BurndownCharts"),
            TestBurndownchart: $scope._getQualityMetricsValue("TestBurndownchart"),
            ProductivityOverEfficiencyImprovement: $scope._getQualityMetricsValue("ProductivityOverEfficiencyImprovement"),
            ChangeRequestsFeaturesQualityTimingCost: $scope._getQualityMetricsValue("ChangeRequestsFeaturesQualityTimingCost"),
            ProductMaintenanceBudgetOverCost: $scope._getQualityMetricsValue("ProductMaintenanceBudgetOverCost"),
            PlndVsActlRelDtOverDur: $scope._getQualityMetricsValue("PlndVsActlRelDtOverDur"),
            PlndVsActlRelDtOverDurVsCrSlipsVsTargets: $scope._getQualityMetricsValue("PlndVsActlRelDtOverDurVsCrSlipsVsTargets"),
            PlndvsActlStoriesOverIteration: $scope._getQualityMetricsValue("PlndvsActlStoriesOverIteration"),

            TeamMix: $scope._getQualityMetricsValue("TeamMix"),
            Wip: $scope._getQualityMetricsValue("Wip"),
            Tip: $scope._getQualityMetricsValue("Tip"),

            UserStoryClosure: $scope._getQualityMetricsValue("UserStoryClosure"),
            TestPassFailOverTime: $scope._getQualityMetricsValue("TestPassFailOverTime"),
            DefectMttrInternal: $scope._getQualityMetricsValue("DefectMttrInternal"),
            DefectClosureInternal: $scope._getQualityMetricsValue("DefectClosureInternal"),
            DefectSeverityInternal: $scope._getQualityMetricsValue("DefectSeverityInternal"),
            DefectArrivalInternal: $scope._getQualityMetricsValue("DefectArrivalInternal"),
            DefectsFoundInHardening: $scope._getQualityMetricsValue("DefectsFoundInHardening"),
            DefectsPerRelease: $scope._getQualityMetricsValue("DefectsPerRelease"),
            DefectsOccurAfterRelease: $scope._getQualityMetricsValue("DefectsOccurAfterRelease"),
            DefectsByStateInternal: $scope._getQualityMetricsValue("DefectsByStateInternal"),
            DefectsByPriorityInternal: $scope._getQualityMetricsValue("DefectsByPriorityInternal"),
            DefectsByType: $scope._getQualityMetricsValue("DefectsByType"),

            NetPresentValue: $scope._getQualityMetricsValue("NetPresentValue"),
            UserStoryValue: $scope._getQualityMetricsValue("UserStoryValue"),
            UserStoryCompletion: $scope._getQualityMetricsValue("UserStoryCompletion"),
            TaskCompletionPerDeveloper: $scope._getQualityMetricsValue("TaskCompletionPerDeveloper"),
            DefectMttrCustomerReported: $scope._getQualityMetricsValue("DefectMttrCustomerReported"),
            DefectArrivalCustomerReported: $scope._getQualityMetricsValue("DefectArrivalCustomerReported"),
            DefectClosureCustomerReported: $scope._getQualityMetricsValue("DefectClosureCustomerReported"),
            DefectSeverityCustomerReported: $scope._getQualityMetricsValue("DefectSeverityCustomerReported"),
            FeatureCompletionPercentage: $scope._getQualityMetricsValue("FeatureCompletionPercentage"),
            CustomerRetention: $scope._getQualityMetricsValue("CustomerRetention"),
            CycleTime: $scope._getQualityMetricsValue("CycleTime"),
            RevenueOverSalesImpact: $scope._getQualityMetricsValue("RevenueOverSalesImpact"),
            ProductUtilization: $scope._getQualityMetricsValue("ProductUtilization"),
            CumulativeFlowChart: $scope._getQualityMetricsValue("CumulativeFlowChart"),
            BusinessValueDelivered: $scope._getQualityMetricsValue("BusinessValueDelivered"),
            CustomerSatisfaction: $scope._getQualityMetricsValue("CustomerSatisfaction"),
            DefectEscape: $scope._getQualityMetricsValue("DefectEscape"),
            BusinessValueForProposedFeatures: $scope._getQualityMetricsValue("BusinessValueForProposedFeatures")
        }
        return config;
    };
    $scope._getQualityMetricsValue = function (metricName) {
        var array = $.map($scope.AllMetrics, function (value, name) { return { name: name, value: value }; });
        var aMetric = [];
        var getQuality = function(params) {
            aMetric = {
                MetricColorId: params,
                MetricType: "constraint",
                ProjectId: $scope.Color_ProjectName_Update,
                RedLowest: $("#_qmetrics_SD" + metricName + "_Red").val(),
                RedSymbol: $("#_qmetrics_SD" + metricName + "_Red_Symbol option:selected").text(),
                RedHighest: $("#_qmetrics_SD" + metricName + "_Red_Symbol_Up").val(),

                YellowLowest: $("#_qmetrics_SD" + metricName + "_Yellow").val(),
                YellowSymbol: $("#_qmetrics_SD" + metricName + "_Yellow_Symbol option:selected").text(),
                YellowHighest: $("#_qmetrics_SD" + metricName + "_Yellow_Symbol_Up").val(),

                GreenLowest: $("#_qmetrics_SD" + metricName + "_Green").val(),
                GreenSymbol: $("#_qmetrics_SD" + metricName + "_Green_Symbol option:selected").text(),
                GreenHighest: $("#_qmetrics_SD" + metricName + "_Green_Symbol_Up").val(),

                MIF: $("#_qmetrics_SD" + metricName + "_MIF").val()
            };
            return aMetric;
        };
        var getConstraint = function(metricColorId) {
            aMetric = {
                MetricColorId: metricColorId,
                MetricType: "constraint",
                ProjectId: $scope.Color_ProjectName_Update,
                RedLowest: $("#_cmetrics_SD" + metricName + "_Red").val(),
                RedSymbol: $("#_cmetrics_SD" + metricName + "_Red_Symbol option:selected").text(),
                RedHighest: $("#_cmetrics_SD" + metricName + "_Red_Symbol_Up").val(),

                YellowLowest: $("#_cmetrics_SD" + metricName + "_Yellow").val(),
                YellowSymbol: $("#_cmetrics_SD" + metricName + "_Yellow_Symbol option:selected").text(),
                YellowHighest: $("#_cmetrics_SD" + metricName + "_Yellow_Symbol_Up").val(),

                GreenLowest: $("#_cmetrics_SD" + metricName + "_Green").val(),
                GreenSymbol: $("#_cmetrics_SD" + metricName + "_Green_Symbol option:selected").text(),
                GreenHighest: $("#_cmetrics_SD" + metricName + "_Green_Symbol_Up").val(),

                MIF: $("#_cmetrics_SD" + metricName + "_MIF").val()
            };
            return aMetric;
        };
        var getValue = function(colorId) {
            aMetric = {
                MetricColorId: colorId,
                MetricType: "value",
                ProjectId: $scope.Color_ProjectName_Update,
                RedLowest: $("#_values_SD" + metricName + "_Red").val(),
                RedSymbol: $("#_values_SD" + metricName + "_Red_Symbol option:selected").text(),
                RedHighest: $("#_values_SD" + metricName + "_Red_Symbol_Up").val(),

                YellowLowest: $("#_values_SD" + metricName + "_Yellow").val(),
                YellowSymbol: $("#_values_SD" + metricName + "_Yellow_Symbol option:selected").text(),
                YellowHighest: $("#_values_SD" + metricName + "_Yellow_Symbol_Up").val(),

                GreenLowest: $("#_values_SD" + metricName + "_Green").val(),
                GreenSymbol: $("#_values_SD" + metricName + "_Green_Symbol option:selected").text(),
                GreenHighest: $("#_values_SD" + metricName + "_Green_Symbol_Up").val(),

                MIF: $("#_values_SD" + metricName + "_MIF").val()
            };
            return aMetric;
        };
        for (var i = 0; i < array.length; i++) {
            if (array[i].name === metricName && array[i].value.MetricType === "quality") {
                return getQuality(array[i].value.MetricColorId, "quality");
            } else if (array[i].name === metricName && array[i].value.MetricType === "constraint") {
                return getConstraint(array[i].value.MetricColorId);
            } else if (array[i].name === metricName && array[i].value.MetricType === "value") {
                return getValue(array[i].value.MetricColorId);
            }
        }
        return aMetric;
    };
    $scope._getMetricType = function (metricName) {

        var qualityMetrics = $scope._qualityMetrics;

        var constraintsMetrics = $scope._constraintsMetrics;
        var valuesMetrics = $scope._valuesMetrics;
        for (var i = 0; i < $scope._qualityMetrics; i++) {
            if (metricName === $scope._qualityMetrics.key) {

            }
        }
       
    };
    /////////////// Data Save to Db ////////////////////


    /////////////// Pages Render ////////////////////

    $scope._qualityMetrics = [
        { id: 1, type: "_quality_", key: "SDUserStoryClosure", name: "1. User Story Closure" },
        { id: 2, type: "_quality_", key: "SDTestPassFailOverTime", name: "2. Test Pass/Fail over Time" },
        { id: 3, type: "_quality_", key: "SDDefectMttrInternal", name: "3. Defect MTTR (Internal)" },
        { id: 4, type: "_quality_", key: "SDDefectsFoundInHardening", name: "4. Defects found in Hardening" },
        { id: 5, type: "_quality_", key: "SDDefectClosureInternal", name: "5. Defect closure (Internal)" },
        { id: 6, type: "_quality_", key: "SDDefectSeverityInternal", name: "6. Defect Severity (Internal)" },
        { id: 7, type: "_quality_", key: "SDDefectArrivalInternal", name: "7. Defect arrival (Internal)" },
        { id: 8, type: "_quality_", key: "SDDefectsPerRelease", name: "8. Defects per release or phase" },
        { id: 9, type: "_quality_", key: "SDDefectsOccurAfterRelease", name: "9. Defects Occuring After a Release" },
        { id: 10, type: "_quality_", key: "SDDefectsByStateInternal", name: "10. Defects by State (internal)" },
        { id: 11, type: "_quality_", key: "SDDefectsByPriorityInternal", name: "11. Defects Priority (internal)" },
        { id: 12, type: "_quality_", key: "SDDefectsByType", name: "12. Defects By Type" }
    ];
    $scope._constraintsMetrics = [

        { id: 1, key: "SDRequirementDecompositionRate", name: "1. Requirement Decomp. Rate" },
        { id: 2, key: "SDUserStoryConsumptionRate", name: "2. User Story Consumption Rate" },
        { id: 3, key: "SDFeatureComprehension", name: "3. Feature Comprehension" },
        { id: 4, key: "SDTeamAssessments", name: "4. Team Assessments" },
        { id: 5, key: "SDBudget", name: "5. Budget" },
        { id: 6, key: "SDCostPerformanceIndex", name: "6. Cost Performance Index (CPI)" },
        { id: 7, key: "SDSprintTargets", name: "7. Sprint Targets" },
        { id: 8, key: "SDAccuracy", name: "8. Accuracy" },
        { id: 9, key: "SDScopechange", name: "9. Scope Change" },
        { id: 10, key: "SDVelocity", name: "10. Velocity" },
        { id: 11, key: "SDBurndownCharts", name: "11. Burndown charts" },
        { id: 12, key: "SDTestBurndownchart", name: "12. Test Burndown chart" },
        { id: 13, key: "SDProductivityOverEfficiencyImprovement", name: "13.Productivity Over Efficiency Improvement" },
        { id: 14, key: "SDTeamMix", name: "14. Team Mix" },
        { id: 15, key: "SDWip", name: "15. WIP" },
        { id: 16, key: "SDTip", name: "16. TIP" },
        { id: 17, key: "SDPlndVsActlRelDtOverDur", name: "17. Plnd Vs Actl Rel Dt OverDur" },
        { id: 18, key: "SDCapacity", name: "18. Capacity" },
        { id: 19, key: "SDPlndVsActlRelDtOverDurVsCrSlipsVsTargets", name: "19. Plnd Vs Actl Rel Dt Over DurVsCR SlipsVsTargets" },
        { id: 20, key: "SDPlndvsActlStoriesOverIteration", name: "20. Plnd vs Actl Stories OverIteration" },
        { id: 21, key: "SDChangeRequestsFeaturesQualityTimingCost", name: "21. Constraint Metric Change Requests Features Quality TimingCost" },
        { id: 22, key: "SDProductMaintenanceBudgetOverCost", name: "22. Constraint Metric Product Maintenance Budget OverCost" },
    ];
    $scope._valuesMetrics = [
        { id: 1, key: "SDNetPresentValue", name: "1. Net Present Value(NPI)" },
        { id: 2, key: "SDUserStoryValue", name: "2. User Story Value" },
        { id: 3, key: "SDUserStoryCompletion", name: "3. User Story Completion" },
        { id: 4, key: "SDTaskCompletionPerDeveloper", name: "4. Task Completion Per Developer" },
        { id: 5, key: "SDDefectMttrCustomerReported", name: "5. Defect MTTR (Customer Reported)" },
        { id: 6, key: "SDDefectArrivalCustomerReported", name: "6. Defect Arrival (Customer reported)" },
        { id: 7, key: "SDDefectClosureCustomerReported", name: "7. Defect Closure (Customer Reported)" },
        { id: 8, key: "SDDefectSeverityCustomerReported", name: "8. Defect Severity (Customer Reported)" },
        { id: 9, key: "SDFeatureCompletionPercentage", name: "9. Feature Completion %" },
        { id: 10, key: "SDCustomerRetention", name: "10. Customer Retention" },
        { id: 11, key: "SDCycleTime", name: "11. Cycle Time" },
        { id: 12, key: "SDRevenueOverSalesImpact", name: "12. Revenue/Sales Impact" },
        { id: 13, key: "SDProductUtilization", name: "13. Product Utilization" },
        { id: 14, key: "SDCumulativeFlowChart", name: "14. Cumulative Flow Chart" },
        { id: 15, key: "SDBusinessValueDelivered", name: "15. Business Value Delivered" },
        { id: 16, key: "SDCustomerSatisfaction", name: "16. Customer Satisfaction" },
        { id: 17, key: "SDDefectEscape", name: "17. Defect Escape" },
        { id: 18, key: "SDBusinessValueForProposedFeatures", name: "18. Business Value for Proposed Features" }
    ];

    $scope._AllMetrics = [

        { id: 1, key: "SDUserStoryClosure", name: "1. User Story Closure" },
        { id: 2, key: "SDTestPassFailOverTime", name: "2. Test Pass/Fail Over Time" },
        { id: 3, key: "SDDefectMttrInternal", name: "3. Defect MTTR (Internal)" },
        { id: 4, key: "SDDefectsFoundInHardening", name: "4. Defects Found in Hardening" },
        { id: 5, key: "SDDefectClosureInternal", name: "5. Defect Closure (Internal)" },
        { id: 6, key: "SDDefectSeverityInternal", name: "6. Defect Severity (Internal)" },
        { id: 7, key: "SDDefectArrivalInternal", name: "7. Defect Arrival (Internal)" },
        { id: 8, key: "SDDefectsPerRelease", name: "8. Defects Per Release or Phase" },
        { id: 9, key: "SDDefectsOccurAfterRelease", name: "9. Defects Occuring After a Release" },
        { id: 10, key: "SDDefectsByStateInternal", name: "10. Defects by State (internal)" },
        { id: 11, key: "SDDefectsByPriorityInternal", name: "11. Defects Priority (internal)" },
        { id: 12, key: "SDDefectsByType", name: "12. Defects By Type" },

        { id: 13, key: "SDRequirementDecompositionRate", name: "1. Requirement Decomp. Rate" },
        { id: 14, key: "SDUserStoryConsumptionRate", name: "2. User Story Consumption Rate" },
        { id: 15, key: "SDFeatureComprehension", name: "3. Feature Comprehension" },
        { id: 16, key: "SDTeamAssessments", name: "4. Team Assessments" },
        { id: 17, key: "SDBudget", name: "5. Budget" },
        { id: 18, key: "SDCostPerformanceIndex", name: "6. Cost Performance Index (CPI)" },
        { id: 19, key: "SDSprintTargets", name: "7. Sprint Targets" },
        { id: 20, key: "SDAccuracy", name: "8. Accuracy" },
        { id: 21, key: "SDScopechange", name: "9. Scope Change" },
        { id: 22, key: "SDVelocity", name: "10. Velocity" },
        { id: 22, key: "SDCapacity", name: "11. Capacity" },
        { id: 23, key: "SDBurndownCharts", name: "12. Burndown charts" },
        { id: 24, key: "SDTestBurndownchart", name: "13. Test Burndown chart" },
        { id: 25, key: "SDProductivityOverEfficiencyImprovement", name: "14.Productivity Over Efficiency Improvement" },
        { id: 26, key: "SDTeamMix", name: "15. Team Mix" },
        { id: 27, key: "SDWip", name: "16. WIP" },
        { id: 28, key: "SDTip", name: "17. TIP" },
        { id: 29, key: "SDPlndVsActlRelDtOverDur", name: "18. Plnd Vs Actl Rel Dt OverDur" },
        { id: 30, key: "SDPlndVsActlRelDtOverDurVsCrSlipsVsTargets", name: "19. Plnd Vs Actl Rel Dt Over DurVsCR SlipsVsTargets" },
        { id: 31, key: "SDPlndvsActlStoriesOverIteration", name: "20. Plnd vs Actl Stories OverIteration" },
        { id: 32, key: "SDChangeRequestsFeaturesQualityTimingCost", name: "21. Constraint Metric Change Requests Features Quality TimingCost" },
        { id: 33, key: "SDProductMaintenanceBudgetOverCost", name: "22. Constraint Metric Product Maintenance Budget OverCost" },

        
        { id: 34, key: "SDNetPresentValue", name: "1. Net Present Value(NPI)" },
        { id: 35, key: "SDUserStoryValue", name: "2. User Story Value" },
        { id: 36, key: "SDUserStoryCompletion", name: "3. User Story Completion" },
        { id: 37, key: "SDTaskCompletionPerDeveloper", name: "4. Task Completion Per Developer" },
        { id: 38, key: "SDDefectMttrCustomerReported", name: "5. Defect MTTR (Customer Reported)" },
        { id: 39, key: "SDDefectArrivalCustomerReported", name: "6. Defect Arrival (Customer reported)" },
        { id: 40, key: "SDDefectClosureCustomerReported", name: "7. Defect Closure (Customer Reported)" },
        { id: 41, key: "SDDefectSeverityCustomerReported", name: "8. Defect Severity (Customer Reported)" },
        { id: 42, key: "SDFeatureCompletionPercentage", name: "9. Feature Completion %" },
        { id: 43, key: "SDCustomerRetention", name: "10. Customer Retention" },
        { id: 44, key: "SDCycleTime", name: "11. Cycle Time" },
        { id: 45, key: "SDRevenueOverSalesImpact", name: "12. Revenue/Sales Impact" },
        { id: 46, key: "SDProductUtilization", name: "13. Product Utilization" },
        { id: 47, key: "SDCumulativeFlowChart", name: "14. Cumulative Flow Chart" },
        { id: 48, key: "SDBusinessValueDelivered", name: "15. Business Value Delivered" },
        { id: 49, key: "SDCustomerSatisfaction", name: "16. Customer Satisfaction" },
        { id: 50, key: "SDDefectEscape", name: "17. Defect Escape" },
        { id: 51, key: "SDBusinessValueForProposedFeatures", name: "18. Business Value for Proposed Features" }
    ];
    $scope._AllMetrics_SP = [
        { id: 1, key: "SPUserStoryClosure", name: "1. User Story Closure" },
        { id: 2, key: "SPTestPassFailOverTime", name: "2. Test Pass/Fail over Time" },
        { id: 3, key: "SPDefectMttrInternal", name: "3. Defect MTTR (Internal)" },
        { id: 4, key: "SPDefectsFoundInHardening", name: "4. Defects found in Hardening" },
        { id: 5, key: "SPDefectClosureInternal", name: "5. Defect closure (Internal)" },
        { id: 6, key: "SPDefectSeverityInternal", name: "6. Defect Severity (Internal)" },
        { id: 7, key: "SPDefectArrivalInternal", name: "7. Defect arrival (Internal)" },
        { id: 8, key: "SPDefectsPerRelease", name: "8. Defects per release or phase" },
        { id: 10, key: "SPDefectsByStateInternal", name: "10. Defects by State (internal)" },
        { id: 11, key: "SPDefectsByPriorityInternal", name: "11. Defects Priority (internal)" },
        { id: 12, key: "SPDefectsByType", name: "12. Defects Type" },
        { id: 1, key: "SPRequirementDecompositionRate", name: "1. Requirement Decomp. Rate" },
        { id: 2, key: "SPUserStoryConsumptionRate", name: "2. User Story Consumption Rate" },
        { id: 3, key: "SPFeatureComprehension", name: "3. Feature Comprehension" },
        { id: 4, key: "SPTeamAssessments", name: "4. Team Assessments" },
        { id: 5, key: "SPBudget", name: "5. Budget" },
        { id: 6, key: "SPCostPerformanceIndex", name: "6. Cost Performance Index (CPI)" },
        { id: 7, key: "SPSprintTargets", name: "7. Sprint Targets" },
        { id: 8, key: "SPAccuracy", name: "8. Accuracy" },
        { id: 9, key: "SPScopechange", name: "9. Scope Change" },
        { id: 10, key: "SPVelocity", name: "10. Velocity" },
        { id: 11, key: "SPBurndownCharts", name: "11. Burndown charts" },
        { id: 12, key: "SPTestBurndownchart", name: "12. Test Burndown chart" },
        { id: 13, key: "SPProductivityOverEfficiencyImprovement", name: "15.Productivity Over Efficiency Improvement" },
        { id: 14, key: "SPTeamMix", name: "16. Team Mix" },
        { id: 15, key: "SPWip", name: "17. WIP" },
        { id: 16, key: "SPTip", name: "18. TIP" },
        { id: 17, key: "SPPlndVsActlRelDtOverDur", name: "19. Plnd Vs Actl Rel Dt OverDur" },
        { id: 18, key: "SPCapacity", name: "20. Capacity" },
        { id: 18, key: "SPPlndVsActlRelDtOverDurVsCrSlipsVsTargets", name: "21. Plnd Vs Actl Rel Dt Over DurVsCR SlipsVsTargets" },
        { id: 19, key: "SPPlndvsActlStoriesOverIteration", name: "22. Plnd vs Actl Stories OverIteration" },
        { id: 20, key: "SPChangeRequestsFeaturesQualityTimingCost", name: "23. Constraint Metric Change Requests Features Quality TimingCost" },
        { id: 21, key: "SPProductMaintenanceBudgetOverCost", name: "24. Constraint Metric Product Maintenance Budget OverCost" },


        { id: 1, key: "SPNetPresentValue", name: "1. Net Present Value(NPI)" },
        { id: 2, key: "SPUserStoryValue", name: "2. User Story Value" },
        { id: 3, key: "SPUserStoryCompletion", name: "3. User Story Completion" },
        { id: 4, key: "SPTaskCompletionPerDeveloper", name: "4. Task Completion Per Developer" },
        { id: 5, key: "SPDefectMttrCustomerReported", name: "5. Defect MTTR (Customer Reported)" },
        { id: 6, key: "SPDefectArrivalCustomerReported", name: "6. Defect Arrival (Customer reported)" },
        { id: 7, key: "SPDefectClosureCustomerReported", name: "7. Defect Closure (Customer Reported)" },
        { id: 8, key: "SPDefectSeverityCustomerReported", name: "8. Defect Severity (Customer Reported)" },
        { id: 9, key: "SPFeatureCompletionPercentage", name: "9. Feature Completion %" },
        { id: 10, key: "SPCustomerRetention", name: "10. Customer Retention" },
        { id: 11, key: "SPCycleTime", name: "11. Cycle Time" },
        { id: 12, key: "SPRevenueOverSalesImpact", name: "12. Revenue/Sales Impact" },
        { id: 13, key: "SPProductUtilization", name: "13. Product Utilization" },
        { id: 14, key: "SPCumulativeFlowChart", name: "14. Cumulative Flow Chart" },
        { id: 15, key: "SPBusinessValueDelivered", name: "15. Business Value Delivered" },
        { id: 16, key: "SPCustomerSatisfaction", name: "16. Customer Satisfaction" },
        { id: 17, key: "SPDefectEscape", name: "17. Defect Escape" },
        { id: 18, key: "SPBusinessValueForProposedFeatures", name: "18. Business Value for Proposed Features" }
    ];

    $scope.activities = ["Software", "Hardware", "Firmware"];
    $scope.priorities = ["Critical", "High", "Medium", "Low"];
    $scope.ColorValues = [{ Name: "Red" }, { Name: "Yellow" }, { Name: "Green" }];

});
