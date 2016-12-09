

var app = angular.module("app_new", []);

app.controller("ConfigurationDynamic", function($scope, $http) {

    var configuration = [];
    $scope._getMetricValue = function() {
        for (var i = 0; i < $scope.activities.length; i++) {
            var activitie = $scope.activities[i];
            configuration[i] = {
                OrganizationIdentificationNumber: $scope.id, //int
                OrganizationName: $scope.name, //string
                Organizationaddress: $scope.address, //string
                OrganizationCity: $scope.city, //string
                OrganizationState: $scope.state, //string
                OrganizationZipCode: $scope.zipCode, //string

                MetricStateRed: $scope.stateRed, //hex
                MetricStateGreen: $scope.stateGreen, //hex
                MetricStateYellow: $scope.stateYellow, //hex
                OrganizationTimeZone: $scope.timeZone, //int 

                OperationalModeHybridAgile: $scope.hybridAgile, //true/false
                OperationalModeAgileOnly: $scope.pureAgile, //true/false

                ProductTypeSoftwareOnly: $scope.software, //true/false
                ProductTypeEmbeddedSystems: $scope.embedded, //true/false

                DevelopmentTrackSoftware: $scope.devSoftware, //true/false
                DevelopmentTrackFirmware: $scope.devEmbedded, //true/false
                DevelopmentTrackHardware: $scope.devEmbedded, //true/false

                Stagegate1: 18, //discovery
                Stagegate2: 19, //scope
                Stagegate3: 20, //feasibility
                Stagegate4: 21, //development
                Stagegate5: 22, //verification
                Stagegate6: 23, //implementation


                ///// get data from  quality of Configuration UI ////////////

                QualityMetricUserStoryClosure: $("input[name=_quality_user_" + activitie + "]:checked").val(),
                QualityMetricTestPassFailOverTime: $("input[name=_quality_test_" + activitie + "]:checked").val(),
                QualityMetricDefectMttrInternal: $("input[name=_quality_mttr_" + activitie + "]:checked").val(),
                QualityMetricDefectClosureInternal: $("input[name=_quality_closure_" + activitie + "]:checked").val(),
                QualityMetricDefectSeverityInternal: $("input[name=_quality_severity_" + activitie + "]:checked").val(),
                QualityMetricDefectArrivalInternal: $("input[name=_quality_arrival_" + activitie + "]:checked").val(),
                QualityMetricDefectsFoundInHardening: $("input[name=_quality_found_" + activitie + "]:checked").val(),
                QualityMetricDefectsPerRelease: $("input[name=_quality_release_" + activitie + "]:checked").val(),
                QualityMetricDefectsByStateInternal: $("input[name=_quality_state_" + activitie + "]:checked").val(),
                QualityMetricDefectsByPriorityInternal: $("input[name=_quality_priority_" + activitie + "]:checked").val(),
                QualityMetricDefectsByType: $("input[name=_quality_type_" + activitie + "]:checked").val(),

                ///// get data from  quality of Configuration UI ////////////

                ///// get data from  constraints of Configuration UI ////////////

                CMRequirementDecompositionRate: $("input[name=_cmetrics_requirement_" + activitie + "]:checked").val(),
                CMUserStoryConsumptionRate: $("input[name=_cmetrics_consumption_" + activitie + "]:checked").val(),
                CMFeatureComprehension: $("input[name=_cmetrics_feature_" + activitie + "]:checked").val(),
                CMCostPerformanceIndex: $("input[name=_cmetrics_cpi_" + activitie + "]:checked").val(),
                CMBudget: $("input[name=_cmetrics_budget_" + activitie + "]:checked").val(),
                CMTeamAssessments: $("input[name=_cmetrics_team_" + activitie + "]:checked").val(),
                CMSprintTargets: $("input[name=_cmetrics_targets_" + activitie + "]:checked").val(),
                CMAccuracy: $("input[name=_cmetrics_accuracy_" + activitie + "]:checked").val(),
                CMScopechange: $("input[name=_cmetrics_scope_" + activitie + "]:checked").val(),
                CMVelocity: $("input[name=_cmetrics_velocity_" + activitie + "]:checked").val(),
                CMCapacity: $("input[name=_cmetrics_Capacity_" + activitie + "]:checked").val(),
                CMBurndownCharts: $("input[name=_cmetrics_burndown_" + activitie + "]:checked").val(),
                CMTestBurndownchart: $("input[name=_cmetrics_test_" + activitie + "]:checked").val(),
                CMProductivityOverEfficiencyImprovement: $("input[name=_cmetrics_improvement_" + activitie + "]:checked").val(),
                CMChangeRequestsFeaturesQualityTimingCost: $("input[name=_cmetrics_timingCost_" + activitie + "]:checked").val(),
                CMProductMaintenanceBudgetOverCost: $("input[name=_cmetrics_overCost_" + activitie + "]:checked").val(),

                CMTeamMix: $("input[name=_cmetrics_teamMix_" + activitie + "]:checked").val(),
                CMWIP: $("input[name=_cmetrics_wip_" + activitie + "]:checked").val(),
                CMTIP: $("input[name=_cmetrics_tip_" + activitie + "]:checked").val(),
                CMPlndVsActlRelDtOverDur: $("input[name=_cmetrics_overDur_" + activitie + "]:checked").val(),
                CMPlndVsActlRelDtOverDurVsCRSlipsVsTargets: $("input[name=_cmetrics_slipsVsTargets_" + activitie + "]:checked").val(),
                CMPlndvsActlStoriesOverIteration: $("input[name=_cmetrics_overIteration_" + activitie + "]:checked").val(),

                ///// get data from  constraints of Configuration UI ////////////

                ///// get data from  value of Configuration UI ////////////

                ValueMetricNetPresentValue: $("input[name=_value_npi_" + activitie + "]:checked").val(),
                ValueMetricUserStoryValue: $("input[name=_value_value_" + activitie + "]:checked").val(),
                ValueMetricUserStoryCompletion: $("input[name=_value_completion_" + activitie + "]:checked").val(),
                ValueMetricTaskCompletionPerDeveloper: $("input[name=_value_task_" + activitie + "]:checked").val(),
                ValueMetricDefectMTTRCustomerReported: $("input[name=_value_mttr_" + activitie + "]:checked").val(),
                ValueMetricDefectArrivalCustomerReported: $("input[name=_value_arrival_" + activitie + "]:checked").val(),
                ValueMetricDefectClosureCustomerReported: $("input[name=_value_closure_" + activitie + "]:checked").val(),
                ValueMetricDefectSeverityCustomerReported: $("input[name=_value_severity_" + activitie + "]:checked").val(),
                ValueMetricFeatureCompletionPercentage: $("input[name=_value_feature_" + activitie + "]:checked").val(),
                ValueMetricCustomerRetention: $("input[name=_value_retention_" + activitie + "]:checked").val(),
                ValueMetricCycleTime: $("input[name=_value_cycle_" + activitie + "]:checked").val(),
                ValueMetricRevenueOverSalesImpact: $("input[name=_value_revenue_" + activitie + "]:checked").val(),
                ValueMetricProductUtilization: $("input[name=_value_product_" + activitie + "]:checked").val(),
                ValueMetricCumulativeFlowChart: $("input[name=_value_cumulative_" + activitie + "]:checked").val(),
                ValueMetricBusinessValueDelivered: $("input[name=_value_delivered_" + activitie + "]:checked").val(),
                ValueMetricCustomerSatisfaction: $("input[name=_value_satisfaction_" + activitie + "]:checked").val(),
                ValueMetricDefectEscape: $("input[name=_value_escape_" + activitie + "]:checked").val(),
                ValueMetricBusinessValueForProposedFeatures: $("input[name=_value_proposed_" + activitie + "]:checked").val()

                ///// get data from value of Configuration UI ////////////
            };
        }
        return configuration;
    }
});

/////// get data from  quality of Configuration UI ////////////
//        $scope.QualityMetricUserStoryClosure = "False",
//        $scope.QualityMetricTestPassFailOverTime = "False",
//        $scope.QualityMetricDefectMttrInternal = "False",
//        $scope.QualityMetricDefectClosureInternal = "False",
//        $scope.QualityMetricDefectSeverityInternal = "False",
//        $scope.QualityMetricDefectArrivalInternal = "False",
//        $scope.QualityMetricDefectsFoundInHardeni = "False",
//        $scope.QualityMetricDefectsPerRelease = "False",
//        $scope.QualityMetricDefectsByStateInternal = "False",
//        $scope.QualityMetricDefectsByPriorityInternal = "False",
//        $scope.QualityMetricDefectsByType = "False",

//        ///// get data from  quality of Configuration UI ////////////

//        ///// get data from  constraints of Configuration UI ////////////
//        $scope.CMRequirementDecompositionRate = "False",
//        $scope.CMUserStoryConsumptionRate = "False",
//        $scope.CMFeatureComprehension = "False",
//        $scope.CMCostPerformanceIndex = "False",
//        $scope.CMBudget = "False",
//        $scope.CMTeamAssessments = "False",
//        $scope.CMSprintTargets = "False",
//        $scope.CMAccuracy = "False",
//        $scope.CMScopechange = "False",
//        $scope.CMVelocity = "False",
//        $scope.CMCapacity = "False",
//        $scope.CMBurndownCharts = "False",
//        $scope.CMTestBurndownchart = "False",
//        $scope.CMProductivityOverEfficiencyImprovement = "False",
//        $scope.CMChangeRequestsFeaturesQualityTimingCost = "False",
//        $scope.CMProductMaintenanceBudgetOverCost = "False",
//        $scope.CMTeamMix = "False",
//        $scope.CMWIP = "False",
//        $scope.CMTIP = "False",
//        $scope.CMPlndVsActlRelDtOverDur = "False",
//        $scope.CMPlndVsActlRelDtOverDurVsCRSlipsVsTargets = "False",
//        $scope.CMPlndvsActlStoriesOverIteration = "False",

//        ///// get data from  constraints of Configuration UI ////////////

//        ///// get data from  value of Configuration UI ////////////
//        $scope.ValueMetricNetPresentValue = "False",
//        $scope.ValueMetricUserStoryValue = "False",
//        $scope.ValueMetricUserStoryCompletion = "False",
//        $scope.ValueMetricTaskCompletionPerDeveloper = "False",
//        $scope.ValueMetricDefectMTTRCustomerReported = "False",
//        $scope.ValueMetricDefectArrivalCustomerReported = "False",
//        $scope.ValueMetricDefectClosureCustomerReported = "False",
//        $scope.ValueMetricDefectSeverityCustomerReported = "False",
//        $scope.ValueMetricFeatureCompletionPercentage = "False",
//        $scope.ValueMetricCustomerRetention = "False",
//        $scope.ValueMetricCycleTime = "False",
//        $scope.ValueMetricRevenueOverSalesImpact = "False",
//        $scope.ValueMetricProductUtilization = "False",
//        $scope.ValueMetricCumulativeFlowChart = "False",
//        $scope.ValueMetricBusinessValueDelivered = "False",
//        $scope.ValueMetricCustomerSatisfaction = "False",
//        $scope.ValueMetricDefectEscape = "False",
//        $scope.ValueMetricBusinessValueForProposedFeatures = "";

//        /// get data from value of Configuration UI ////////////