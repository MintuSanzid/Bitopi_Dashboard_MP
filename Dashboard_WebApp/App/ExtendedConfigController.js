
var app = angular.module("app", ["ngDialog"]);

app.controller("ExtendedConfigController", function ($scope, $rootScope, $http, $filter, $window, ngDialog) {

    $scope.OpenngDiologValidation = function () {
        ngDialog.open({ template: "Validation_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });

    }

    $scope.config = { headers: { 'Content-Type': "application/x-www-form-urlencoded;charset=utf-8;" } }
    $scope.urlSaveOrUpdateProgram = "/Program/SaveOrUpdatePrograms";
    $scope.urlSaveOrUpdateProject = "/Project/SaveOrUpdateProject";
    $scope.urlSaveOrUpdateSprint = "/Sprint/SaveOrUpdateSprint";
    $scope.urlSaveOrUpdateTeam = "/Team/SaveOrUpdateTeam";
    $scope.urlSaveOrUpdateMember = "/Member/SaveOrUpdateMembers";
    $scope.urlSaveOrUpdateStageGate = "/StageGate/SaveOrUpdateStageGates";

    $scope.MemberNameChange = function () {
        var name = $scope.Member_FirstName + " " + $scope.Member_LastName;
        var pairedName = $("#Member_PairedMemberName option:selected").text();
        if (name === pairedName) {
            $scope.pairedName = true;
        } else {
            $scope.pairedName = false;
        }
    }
    $scope.MemberNameUpdateChange = function () {
        var name = $scope.Member_FirstName_Update + " " + $scope.Member_LastName_Update;
        var pairedName = $("#Member_PairedMemberName_Update option:selected").text();
        if (name === pairedName) {
            $scope.pairedName = true;
        } else {
            $scope.pairedName = false;
        }
    }
    //////////////////// Program Crud Operation //////////////
    function loadDomainForDdl() {
        //$http.get("/Domain/GetDomains", $scope.config).success(function (data) {
        //    $scope.Programs = data;
        //    $scope.Program_Program = $scope.Programs[0];
        //});
        $scope.Domains = [
            { "DomainId": "Software", "DomainName": "Software" },
            { "DomainId": "Hardware", "DomainName": "Hardware" },
            { "DomainId": "Firmware", "DomainName": "Firmware" }];
        // $scope.Pro_DomainName = $scope.Domains[0];

        $scope.Pro_Statuses = [
            { "StatusCode": 17, "Status": "Active" },
            { "StatusCode": 13, "Status": "Closed" }
        ];
    };
    loadDomainForDdl();

    function loadProgramForDdl() {
        $http.get("/Program/GetPrograms", $scope.config).success(function (data, status, headers, config) {
            $scope.Programs = data;
            $scope.Program_Program = $scope.Programs[0];
        });
    };
    loadProgramForDdl();

    $scope.OpenngDiologProgram = function () {
        var programId = $("#Pro_ProgramName").val();
        if (programId === "") {
            $scope.Pro_ProgramId = 0;
            $scope.Pro_ProgramName = "";
            $scope.Pro_DomainName = "Software";
            $scope.Pro_Status = 17;
            $scope.Pro_CreateOn = new Date();
            ngDialog.open({ template: "Program_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });

        } else {

            var projectObj = getAProgramItem($scope.Pro_Program);
            $scope.Pro_ProgramId_Update = projectObj.ProgramId;
            $scope.Pro_ProgramName_Update = projectObj.ProgramName;
            $scope.Pro_DomainName_Update = projectObj.DomainName;
            $scope.Pro_Status_Update = projectObj.StatusCode;
            $scope.Pro_CreateOn_Update = new Date(); //getDateObj(); //new Date(2014, 3, 19); //new Date("Thu Aug 11 2016 06:00:00 GMT+0600 (Bangladesh Standard Time)");  //
            ngDialog.open({ template: "Program_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope });
        }
    }
    $rootScope.InsertOrUpdateProgram = function (num) {
        var aProgram = $scope.GetProgramsObj(num);
        if ($scope.Pro_ProgramName !== aProgram) {
            $http.post($scope.urlSaveOrUpdateProgram, aProgram).success(function (returnData) {
                $window.location.reload();
                ngDialog.close();
            });
        } else {
            alert(" Program Name Already Exits");
        }
    }
    $rootScope.DeleteConfirmDialog = function () {
        ngDialog.openConfirm({
            template: "Delete_Id",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteProgram = function (num) {
        var aProgram = $scope.GetProgramsObj(num);
        $http.post("/Program/Delete/" + aProgram.Id).success(function (returnData) {
            ngDialog.close();
        });
    }
    $rootScope.CancelProgram = function () {
        ngDialog.close();
    }

    //////////////////// End of Program Crud Operation ////////


    //////////////////// Project Crud Operation ////////

    function loadProjectForDdl() {

        $scope.Project_Statuses = [
           { "StatusCode": 17, "Status": "Active" },
           { "StatusCode": 23, "Status": "Completed" },
           { "StatusCode": 25, "Status": "Released" }
        ];
        $http.get("/Project/GetProjects", $scope.config).success(function (data, status, headers, config) {
            $scope.Projects = data;
            $scope.Project_Project = $scope.Projects[0];
        });
    };
    loadProjectForDdl();

    $scope.OpenngDiologProject = function () {
        var projectId = $("#Project_ProjectName").val();   //$scope.Project_Project;     //$("#Project_ProjectName").val();
        if (projectId === "") {
            $scope.Project_ProjectId = 0;
            $scope.Project_ProjectName = "";
            $scope.Project_ProjectCost = 0;
            $scope.Project_ProjectVersion = "0.0";
            $scope.Project_ReleaseDate = getDateObj(),
            $scope.Project_Status = 17;

            $scope.Project_Software = true;
            $scope.Project_Hardware = false;
            $scope.Project_Firmware = false;

            $scope.Project_Program = "Project";

            ngDialog.open({ template: "Project_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });
        } else {
            var projectObj = getAProjectItem($scope.Project_Project);
            //var date = projectObj.Estimatedreleasedate;
            //var adate = date.getDate();
            $scope.Project_ProjectId_Update = projectObj.ProjectId;
            $scope.Project_ProjectName_Update = projectObj.ProjectName;
            $scope.Project_ProjectVersion = "0.0";
            $scope.Project_ProjectCost_Update = projectObj.Estimatedcost;
            $scope.Project_ReleaseDate_Update = getDateObj();
            $scope.Project_Software_Update = projectObj.Software;
            $scope.Project_Hardware_Update = projectObj.Hardware;
            $scope.Project_Firmware_Update = projectObj.Firmware;
            $scope.Project_Status_Update = projectObj.StatusCode,                //getDateObj(programObj.CreateOn);
            $scope.Project_ProgramName_Update = projectObj.ProgramId;

            ngDialog.open({
                template: "Project_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope
            });
        }
    }
    $rootScope.InsertOrUpdateProject = function (num) {
        var aProject = $scope.GetProjectObj(num);
        if ($scope.Project_ProjectName !== aProject) {
            $http.post($scope.urlSaveOrUpdateProject, aProject).success(function (data, status, headers, config) {
                $window.location.reload();
                ngDialog.close();
            }).error(function (data, status, header, config) { });
        } else {
            alert("Project Name Already Exits");
        }
    };
    $rootScope.DeleteConfirmDialogProject = function () {
        ngDialog.open({
            template: "ProjectId_Delete",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteProject = function (num) {
        var aProject = $scope.GetProjectObj(num);
        $http.post("/Project/Delete/" + aProject.Id).success(function (returnData) {
            ngDialog.close();
        });

    }
    $rootScope.CancelProject = function () {
        ngDialog.close();
    }
    //////////////////// End of Project Crud Operation ////////


    //////////////////// Sprint Crud Operation ////////
    function loadSprintForDdl() {
        $http.get("/Sprint/GetSprints", $scope.config).success(function (data, status, headers, config) {
            $scope.Sprints = data;
            $scope.Sprint_Sprint = $scope.Sprints[0];
        });
    };
    loadSprintForDdl();

    $scope.OpenngDiologSprint = function () {
        var sprintId = $("#Sprint_SprintName").val();
        if (sprintId === "") {
            $scope.Sprint_SprintId = 0;
            $scope.Sprint_SprintName = "";
            $scope.Sprint_DomainName = "";
            $scope.Sprint_ProjectName = 0;
            $scope.Sprint_StartDate = getDateObj();
            $scope.Sprint_Duration = 0;
            ngDialog.open({ template: "Sprint_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });
        } else {
            alert("You can not update Sprint info....");
            //var sprintObj = getASprintItem($scope.Sprint_Sprint);
            //$scope.Sprint_SprintId_Update = sprintObj.SprintId;
            //$scope.Sprint_SprintName_Update = sprintObj.SprintName;
            //$scope.Sprint_DomainName_Update = sprintObj.DomainName;
            //$scope.Sprint_ProjectName_Update = sprintObj.ProjectId;
            //$scope.Sprint_StartDate_Update = getDateObj();               // new Date(programObj.Estimatedreleasedate);
            //$scope.Sprint_Duration_Update = sprintObj.Duration;                      //programObj.AProgramViewModel.ProgramName;

            //ngDialog.open({
            //    template: "Sprint_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope
            //});
        }
    }
    $rootScope.InsertOrUpdateSprint = function (num) {
        var aSprint = $scope.GetSprintObj(num);
        if ($scope.Sprint_SprintName !== aSprint) {
            $http.post($scope.urlSaveOrUpdateSprint, aSprint).success(function (data, status, headers, config) {
                $window.location.reload();
                ngDialog.close();
            }).error(function (data, status, header, config) { });
        } else {
            alert("Sprint Name Already Exits");
        }
    };
    $rootScope.DeleteConfirmDialogSprint = function () {
        ngDialog.open({
            template: "SprintId_Delete",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteSprint = function (num) {
        ngDialog.close();
        //var aSprint = $scope.GetNewSprintObj(num);
        //$http.post("/Sprint/Delete/" + aSprint.Id).success(function (returnData) {
        //    ngDialog.close();
        //});

    }
    $rootScope.CancelSprint = function () {
        ngDialog.close();
    }
    //////////// End of Sprint Crud Operation ////////


    //////////// Team Crud Operation ////////

    function loadTeamForDdl() {
        $http.get("/Team/GetTeams", $scope.config).success(function (data, status, headers, config) {
            $scope.Teams = data;
            $scope.Team_Teams = $scope.Teams[0];
        });
    };
    loadTeamForDdl();

    $scope.OpenngDiologTeam = function () {
        var teamId = $("#Team_Teams").val();
        if (teamId === "") {
            $scope.Team_TeamId = 0;
            $scope.Team_TeamName = "";
            $scope.Team_CreateOn = getDateObj();

            ngDialog.open({ template: "Team_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });
        } else {
            //alert("You can not update Team info....");
            var teamObj = getATeamItem($scope.Team_Teams);
            $scope.Team_TeamId_Update = teamObj.TeamId;
            $scope.Team_TeamName_Update = teamObj.TeamName;
            $scope.Team_SprintName_Update = teamObj.SprintId;
            $scope.Team_CreateOn_Update = getDateObj();
            ngDialog.open({
                template: "Team_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope
            });
        }
    }
    $rootScope.InsertOrUpdateTeam = function (num) {
        var aTeam = $scope.GetTeamObj(num);
        if ($scope.Team_TeamName !== aTeam) {
            $http.post($scope.urlSaveOrUpdateTeam, aTeam).success(function (data, status, headers, config) {
                $window.location.reload();
                ngDialog.close();
            }).error(function (data, status, header, config) { });
        } else {
            alert("Team Name Already Exits");
        }

    };
    $rootScope.DeleteConfirmDialogTeam = function () {
        ngDialog.open({
            template: "TeamId_Delete",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteTeam = function (num) {
        ngDialog.close();
        //var aTeam = $scope.GetNewTeamObj(num);
        //$http.post("/Team/Delete/" + aTeam.Id).success(function (returnData) {
        //    ngDialog.close();
        //});

    }
    $rootScope.CancelTeam = function () {
        ngDialog.close();
    }
    //////////////////// End of Team Crud Operation ////////


    //////////////////// Member Crud Operation ////////

    function loadMemberForDdl() {
        $scope.Member_Statuses = [
           { "StatusCode": 17, "Status": "Active" },
           { "StatusCode": 24, "Status": "Inactive" }
        ];

        $http.get("/Member/GetMembers", $scope.config).success(function (data, status, headers, config) {
            $scope.Members = data;
            $scope.Member_Member = $scope.Members[0];
        });
    };
    loadMemberForDdl();

    $scope.OpenngDiologMember = function () {
        var memberId = $("#Member_MemberName").val();
        if (memberId === "") {
            $scope.Member_MemberId = "";
            $scope.Member_FirstName = "";
            $scope.Member_LastName = "";
            $scope.Member_PrevLastName = "";

            $scope.Member_TeamId = "";
            $scope.Member_PrecTeamId = "";
            $scope.Member_Employeeid = "";

            $scope.Member_PairedmemberId = "";
            $scope.Member_PrevPairedmemberId = "";

            $scope.Member_Seniority = "";
            $scope.Member_Subjectexpertise = "";               // new Date(programObj.Estimatedreleasedate);
            //$scope.Member_CreateOn = new Date();
            $scope.Member_Status = 17;

            ngDialog.open({ template: "Member_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });
        } else {
            var memberObj = getAMemberItem($scope.Member_Member);
            $scope.Member_MemberId_Update = memberObj.MemberId;
            $scope.Member_FirstName_Update = memberObj.FirstName;
            $scope.Member_LastName_Update = memberObj.LastName;

            $scope.Member_TeamName_Update = memberObj.TeamId;
            $scope.Member_EmployeeId_Update = memberObj.EmployeeId;

            $scope.Member_PairedMemberName_Update = memberObj.PairedMemberId;
            //$scope.Member_PrevLastName_Update = memberObj.PrevlastName;
            //$scope.Member_PrevTeamName_Update = memberObj.Prevteamid;
            //$scope.Member_PrevPairedMemberName_Update = memberObj.Prevpairedmemberid;
            // $scope.Member_CreateOn_Update = new Date();

            $scope.Member_Seniority_Update = memberObj.Seniority;
            $scope.Member_Subjectexpertise_Update = memberObj.SubjectExpertise;
            $scope.Member_Status_Update = memberObj.StatusCode;

            ngDialog.open({ template: "Member_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope });
        }
    }
    $rootScope.InsertOrUpdateMember = function (num) {
        var aMember = $scope.GetMemberObj(num);
        if ($scope.Member_FirstName !== aMember) {
            $http.post($scope.urlSaveOrUpdateMember, aMember).success(function (data, status, headers, config) {
                $window.location.reload();
                ngDialog.close();
            }).error(function (data, status, header, config) { alert("Something Error !"); });
        } else {
            alert("Mamber Name Already Exits");
        }

    };
    $rootScope.DeleteConfirmDialogMember = function () {
        ngDialog.open({
            template: "MemberId_Delete",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteMember = function (num) {
        ngDialog.close();
        //var aMember = $scope.GetNewMemberObj(num);
        //$http.post("/Member/Delete/" + aMember.Id).success(function (returnData) {
        //    ngDialog.close();
        //});

    }
    $rootScope.CancelMember = function () {
        ngDialog.close();
    }
    //////////////////// End of Member Crud Operation ////////

    //////////////////// StageGate Crud Operation ////////
    function loadStageGateForDdl() {
        $http.get("/StageGate/GetStageGates", $scope.config).success(function (data, status, headers, config) {
            $scope.StageGates = data;
            $scope.StageGate_StageGate = $scope.StageGates[0];
        });
    };
    loadStageGateForDdl();

    $scope.OpenngDiologStageGate = function () {

        var stageGateId = $("#StageGate_StageGateName").val();
        var date = getDateObj();

        if (stageGateId === "") {

            $scope.StageGate_Id = "";
            $scope.StageGate_SettingId = "";
            $scope.StageGate_ProjectName = 5;
            $scope.StageGate_StageGateName = "";
            $scope.StageGate_Description = "";

            $scope.StageGate_BeginDate = getDateObj();
            $scope.StageGate_EndDate = getDateObj();
            $scope.StageGate_CreatedOnDate = getDateObj();
            $scope.StageGate_UpdateDate = getDateObj();

            ngDialog.open({ template: "StageGate_Id", controller: "ExtendedConfigController", className: "ngdialog-theme-default", scope: $scope });
        } else {
            var stageGateObj = getAStageGateItem($scope.StageGate_StageGate);

            $scope.StageGate_Id_Update = stageGateObj.StageGateId;
            $scope.StageGate_SettingId_Update = stageGateObj.SettingId;
            $scope.StageGate_ProjectName_Update = stageGateObj.ProjectId;
            $scope.StageGate_Name_Update = stageGateObj.StageGateName;
            $scope.StageGate_Description_Update = stageGateObj.Description;

            $scope.StageGate_BeginDate_Update = getDateObj();                   //stageGateObj.BeginDate;
            $scope.StageGate_EndDate_Update = getDateObj();                     //stageGateObj.EndDate;
            $scope.StageGate_CreatedOnDate_Update = getDateObj();               //stageGateObj.CreatedOnDate;
            $scope.StageGate_UpdateDate_Update = getDateObj();                  //stageGateObj.UpdateDate;

            ngDialog.open({ template: "StageGate_Id_Update", controller: "ExtendedConfigController", className: "ngdialog-theme-default", closeByEscape: true, scope: $scope });
        }
    }
    $rootScope.InsertOrUpdateStageGate = function (num) {
        var aStageGate = $scope.GetStageGateObj(num);
        if ($scope.StageGate_Name !== aStageGate) {
            $http.post($scope.urlSaveOrUpdateStageGate, aStageGate).success(function (data, status, headers, config) {
                $window.location.reload();
                ngDialog.close();
            }).error(function (data, status, header, config) { });
        } else {
            alert("StageGate Name Already Exits");
        }

    };
    $rootScope.DeleteConfirmDialogStageGate = function () {
        ngDialog.open({
            template: "StageGateId_Delete",
            controller: "ExtendedConfigController",
            className: "ngdialog-theme-default",
            scope: $scope,
            showClose: true
        });
    }
    $rootScope.DeleteStageGate = function (num) {
        ngDialog.close();
        //var aStageGate = $scope.GetNewStageGateObj(num);
        //$http.post("/StageGate/Delete/" + aStageGate.Id).success(function (returnData) {
        //    ngDialog.close();
        //});

    }
    $rootScope.CancelStageGate = function () {
        ngDialog.close();
    }

    //////////////////// End of StageGate Crud Operation ////////

    $scope.SetSelectedIdName = function (id) {
        alert("hi");
    }

    //////////// Support Method /////////////////
    $scope.GetStageGateObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.StageGates.length !== null) {
                for (var i = 0; i < $scope.StageGates.length; i++) {
                    if ($scope.StageGates[i].StageGateName === $scope.StageGate_Name) {
                        return $scope.StageGate_Name;
                    }
                }
                aSelectedObject = {
                    StageGateId: $scope.StageGate_Id,
                    StageGateName: $scope.StageGate_Name,
                    SettingId: $scope.StageGate_SettingId,
                    ProjectId: $scope.StageGate_ProjectName,
                    Description: $scope.StageGate_Description,

                    BeginDate: $scope.StageGate_BeginDate,
                    EndDate: $scope.StageGate_EndDate,
                    CreatedOnDate: $scope.StageGate_CreatedOnDate,
                    UpdateDate: $scope.StageGate_UpdateDate
                };
                return aSelectedObject;
            }

        } else if (id === 2) {
            aSelectedObject = {

                StageGateId: $scope.StageGate_Id_Update,
                StageGateName: $scope.StageGate_Name_Update,
                SettingId: $scope.StageGate_SettingId_Update,
                ProjectId: $scope.StageGate_ProjectName_Update,
                Description: $scope.StageGate_Description_Update,

                BeginDate: $scope.StageGate_BeginDate_Update,
                EndDate: $scope.StageGate_EndDate_Update,
                CreatedOnDate: $scope.StageGate_CreatedOnDate_Update,
                UpdateDate: $scope.StageGate_UpdateDate_Update
            }
        } else {
            aSelectedObject = {
                StageGateId: $scope.StageGate_Id_Update,
                StageGateName: $scope.StageGate_Name_Update
            }
        }
        return aSelectedObject;
    };

    $scope.GetMemberObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.Members.length !== null) {
                for (var i = 0; i < $scope.Members.length; i++) {
                    if ($scope.Members[i].FirstName === $scope.Member_FirstName && $scope.Members[i].LastName === $scope.Member_LastName) {
                        return $scope.Member_FirstName;
                    }
                }
                aSelectedObject = {
                    Memberid: $scope.Member_MemberId,
                    Firstname: $scope.Member_FirstName,
                    Lastname: $scope.Member_LastName,
                    Prevlastname: $scope.Member_PrevLastName,

                    Teamid: $scope.Member_TeamName,
                    Prevteamid: $scope.Member_PrevTeamName,
                    Employeeid: $scope.Member_EmployeeId,

                    Pairedmemberid: $scope.Member_PairedMemberName,
                    Prevpairedmemberid: $scope.Member_PrevPairedMemberName,

                    Seniority: $scope.Member_Seniority,
                    Subjectexpertise: $scope.Member_Subjectexpertise,
                    StatusCode: $scope.Member_Status,
                    Status: $scope.Member_Status,
                    CreatedonDate: $scope.Member_CreateOn
                };
                return aSelectedObject;
            };

        } else if (id === 2) {
            aSelectedObject = {

                MemberId: $scope.Member_MemberId_Update,
                FirstName: $scope.Member_FirstName_Update,
                LastName: $scope.Member_LastName_Update,
                PrevlastName: $scope.Member_PrevLastName_Update,

                TeamId: $scope.Member_TeamName_Update,
                PrevteamId: $scope.Member_PrevTeamName_Update,
                EmployeeId: $scope.Member_EmployeeId_Update,

                PairedmemberId: $scope.Member_PairedMemberName_Update,
                Prevpairedmemberid: $scope.Member_PrevPairedMemberName_Update,

                Seniority: $scope.Member_Seniority_Update,
                SubjectExpertise: $scope.Member_Subjectexpertise_Update,
                StatusCode: $scope.Member_Status_Update,
                Status: $scope.Member_Status_Update,
                CreatedonDate: $scope.Member_CreateOn_Update
            }
        } else {
            aSelectedObject = {
                MemberId: $scope.Member_MemberId_Update,
                FirstName: $scope.Member_FirstName_Update,
                LastName: $scope.Member_LastName_Update,
                PrevlastName: $scope.Member_PrevLastName_Update
            }
        }
        return aSelectedObject;
    };

    $scope.GetTeamObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.Teams.length !== null) {
                for (var i = 0; i < $scope.Teams.length; i++) {
                    if ($scope.Teams[i].TeamName === $scope.Team_TeamName) {
                        return $scope.Team_TeamName;
                    }
                }
                aSelectedObject = {
                    TeamId: $scope.Team_TeamId,
                    TeamName: $scope.Team_TeamName,
                    SprintId: $scope.Team_SprintName,
                    CreatedOn: $scope.Team_CreateOn // new Date(programObj.Estimatedreleasedate);
                };
                return aSelectedObject;
            }

        } else if (id === 2) {
            aSelectedObject = {
                TeamId: $scope.Team_TeamId_Update,
                TeamName: $scope.Team_TeamName_Update,
                SprintId: $scope.Team_SprintName_Update,
                CreatedOn: $scope.Team_CreateOn_Update // new Date(programObj.Estimatedreleasedate);
            }
        } else {
            aSelectedObject = {
                Id: $scope.Team_TeamId_Update,
                TeamName: $scope.Team_TeamName_Update
            }
        }
        return aSelectedObject;
    };

    $scope.GetSprintObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.Sprints.length !== null) {
                for (var i = 0; i < $scope.Sprints.length; i++) {
                    if ($scope.Sprints[i].SprintName === $scope.Sprint_SprintName) {
                        return $scope.Sprint_SprintName;
                    }
                }
                aSelectedObject = {
                    SprintId: $scope.Sprint_SprintId,
                    SprintName: $scope.Sprint_SprintName,
                    DomainName: $scope.Sprint_DomainName,
                    ProjectId: $scope.Sprint_ProjectName,
                    StartDate: $scope.Sprint_StartDate,         // new Date(programObj.Estimatedreleasedate);
                    Duration: $scope.Sprint_Duration            //getDateObj(programObj.CreateOn);
                };
                return aSelectedObject;
            }

        } else if (id === 2) {
            aSelectedObject = {
                SprintId: $scope.Sprint_SprintId_Update,
                SprintName: $scope.Sprint_SprintName_Update,
                DomainName: $scope.Sprint_DomainName_Update,
                ProjectId: $scope.Sprint_ProjectName_Update,
                StartDate: $scope.Sprint_StartDate_Update, // new Date(programObj.Estimatedreleasedate);
                Duration: $scope.Sprint_Duration_Update //getDateObj(programObj.CreateOn);
            }
        } else {
            aSelectedObject = {
                Id: $scope.Sprint_SprintId_Update,
                DomainName: $scope.Sprint_DomainName_Update,
                ProjectName: $scope.Sprint_ProjectName_Update
            }
        }
        return aSelectedObject;
    };

    $scope.GetProjectObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.Projects.length !== null) {
                for (var i = 0; i < $scope.Projects.length; i++) {
                    if ($scope.Projects[i].ProjectName === $scope.Project_ProjectName) {
                        return $scope.Project_ProjectName;
                    }
                }
                aSelectedObject = {
                    ProjectId: $scope.Project_ProjectId,
                    ProjectName: $scope.Project_ProjectName,
                    Status: $scope.Project_Status,
                    StatusCode: $scope.Project_Status, //Version: $scope.Project_ProjectVersion,
                    Estimatedcost: $scope.Project_ProjectCost,
                    Estimatedreleasedate: $scope.Project_ReleaseDate, // new Date(programObj.Estimatedreleasedate);
                    Software: $scope.Project_Software,
                    Hardware: $scope.Project_Hardware,        
                    Firmware: $scope.Project_Firmware,
                    CreateOn: $scope.Project_CreateOn, //getDateObj(programObj.CreateOn);
                    ProgramId: $scope.Project_ProgramName
                };
                return aSelectedObject;
            }
        } else if (id === 2) {
            aSelectedObject = {
                ProjectId: $scope.Project_ProjectId_Update,
                ProjectName: $scope.Project_ProjectName_Update,
                Status: $scope.Project_Status_Update,              //Version: $scope.Project_ProjectVersion_Update,
                StatusCode: $scope.Project_Status_Update,
                Estimatedcost: $scope.Project_ProjectCost_Update,
                Estimatedreleasedate: $scope.Project_ReleaseDate_Update,    // new Date(programObj.Estimatedreleasedate);
                Software: $scope.Project_Software_Update, 
                Hardware: $scope.Project_Hardware_Update,
                Firmware: $scope.Project_Firmware_Update,
                CreateOn: $scope.Project_CreateOn_Update,                   //getDateObj(programObj.CreateOn);
                ProgramId: $scope.Project_ProgramName_Update
            }
        } else {
            aSelectedObject = {
                Id: $scope.Project_ProjectId_Update,
                AProgramViewModel: { ProgramName: $scope.Project_Program_Update }
            }
        }
        return aSelectedObject;
    };

    $scope.GetProgramsObj = function (id) {
        var aSelectedObject = null;
        if (id === 1) {
            if ($scope.Programs.length !== null) {
                for (var i = 0; i < $scope.Programs.length; i++) {
                    if ($scope.Programs[i].ProgramName === $scope.Pro_ProgramName) {
                        return $scope.Pro_ProgramName;
                    }
                };
                aSelectedObject = {
                    ProgramId: $scope.Pro_ProgramId,
                    ProgramName: $scope.Pro_ProgramName,
                    Createdon: $scope.Pro_CreateOn,
                    DomainName: $scope.Pro_DomainName,
                    StatusCode: $scope.Pro_Status
                    // Status: $scope.Pro_Status
                }
                return aSelectedObject;
            }

        } else if (id === 2) {
            aSelectedObject = {
                ProgramId: $scope.Pro_ProgramId_Update,
                ProgramName: $scope.Pro_ProgramName_Update,
                Createdon: $scope.Pro_CreateOn_Update,
                DomainName: $scope.Pro_DomainName_Update,
                StatusCode: $scope.Pro_Status_Update
            }
        } else {
            aSelectedObject = {
                ProgramId: $scope.Pro_ProgramId_Update,
                ProgramName: $scope.Pro_ProgramName_Update,
                DomainName: $scope.Pro_DomainName
            }
        }
        return aSelectedObject;
    };

    function getAStageGateItem(pid) {
        var item;
        for (var i = 0; i < $scope.StageGates.length; i++) {
            item = $scope.StageGates[i];
            if (item.StageGateId === pid) {
                return item;
            }
        }
        return null;
    };

    function getAMemberItem(pid) {
        var item;
        for (var i = 0; i < $scope.Members.length; i++) {
            item = $scope.Members[i];
            if (item.MemberId === pid) {
                return item;
            }
        }
        return null;
    };

    function getATeamItem(pid) {
        var item;
        for (var i = 0; i < $scope.Teams.length; i++) {
            item = $scope.Teams[i];
            if (item.TeamId === pid) {
                return item;
            }
        }
        return null;
    };

    function getASprintItem(pid) {
        var item;
        for (var i = 0; i < $scope.Sprints.length; i++) {
            item = $scope.Sprints[i];
            if (item.SprintId === pid) {
                return item;
            }
        }
        return null;
    };

    function getAProjectItem(pid) {
        var item;
        for (var i = 0; i < $scope.Projects.length; i++) {
            item = $scope.Projects[i];
            if (item.ProjectId === pid) {
                return item;
            }
        }
        return null;
    };

    function getAProgramItem(pid) {
        var item;
        for (var i = 0; i < $scope.Programs.length; i++) {
            item = $scope.Programs[i];
            if (item.ProgramId === pid) {
                return item;
            }
        }
        return null;
    };

    function getDateObj() {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) { month = "0" + month; }
        var day = d.getDate();
        if (day < 10) { day = "0" + day; }
        return year + "-" + month + "-" + day;
    };

    function getSelectedValue(objId) {
        var id = $("#" + objId + " option:selected").val();
        var pId = id.split(":");
        return parseInt(pId[1]);

    };

    function getToday() {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        $("#datePicker").val(today);
        return today;
    }
});

