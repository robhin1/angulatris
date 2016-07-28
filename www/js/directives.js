angular.module('app')
.directive('myTouchstart', [function() {
    return function(scope, element, attr) {
        element.on('touchstart', function(event) {
            scope.$apply(function() { 
                scope.$eval(attr.myTouchstart); 
            });
        });
    };
}]).directive('myTouchend', [function() {
    return function(scope, element, attr) {
        element.on('touchend', function(event) {
            scope.$apply(function() { 
                scope.$eval(attr.myTouchend); 
            });
        });
    };
}]).directive('myTouchcancel', [function() {
    return function(scope, element, attr) {
        element.on('touchcancel', function(event) {
            scope.$apply(function() { 
                scope.$eval(attr.myTouchcancel); 
            });
        });
    };
}]);