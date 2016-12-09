//var StudentApp = angular.module("StudentApp", ["ngResource", "ngRoute"]);



//StudentApp.controller("StudentController",  ["$scope", function($scope)  {
//   
//    $scope.message = "Infrgistics Mahafuz";
//    $scope.save = function(producttype) {}
//   
//}]);


angular.module('changeExample', [])
  .controller('ExampleController', ['$scope', function ($scope) {
      $scope.counter = 0;
      $scope.change = function () {
         
          $scope.counter++;
      };
  }]);
