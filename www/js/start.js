angular.module('app', [])//ngTouch'
.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);