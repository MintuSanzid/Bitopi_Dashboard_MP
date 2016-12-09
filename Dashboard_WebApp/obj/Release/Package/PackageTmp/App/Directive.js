
app.directive("ngColorPicker", function () {
    var defaultColors = [
        
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
        "#ccffcc",
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
         "#ffb2b2",

        
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

    return {
        scope: {
            selected: "=",
            customizedColors: "=colors"
        },
        restrict: "AE",
        template: '<ul><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
        link: function (scope, element, attr) {
            scope.colors = scope.customizedColors || defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function (color) {
                scope.selected = color;
            };

        }
    };

});

app.directive("ngColorPickerGreen", function () {
    var defaultColors = [
        "#00ff00",
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
        "#ffb2b2",

"#00ff00",
"#00e500",
"#00cc00",
"#00b200",
"#009900",
"#007f00",
"#19ff19",
"#32ff32",
"#4cff4c",
"#66ff66",
"#7fff7f",
"#99ff99",
"#b2ffb2",
"#ccffcc"

    ];

    return {
        scope: { selected: "=", customizedColors: "=colors" },
        restrict: "AE",
        template: '<ul><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
        link: function (scope, element, attr) {
            scope.colors = scope.customizedColors || defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function (color) {
                scope.selected = color;
            };
        }
    };

});