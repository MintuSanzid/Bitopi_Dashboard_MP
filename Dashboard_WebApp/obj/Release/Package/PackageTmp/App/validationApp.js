// create angular app

var validationApp = angular.module("validationApp", []);

// create angular controller
validationApp.controller("mainController", function ($scope) {

    loadDate();

    function loadDate() {
        //debugger;
        //var dat = new Date();
        //var data1 = parseInt('yyyy-MM-dd', dat);
        //$scope.DateTest = new loadDate();//data1;
        //$scope.newDate = dat.getUTCDate();
        //$('#datetimepicker9').val(new Date());
    }
  

    // function to submit the form after all validation has occurred			
    $scope.submitForm = function () {
        //debugger;
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            alert('our form is amazing');
        }

    };

});