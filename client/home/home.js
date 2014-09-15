angular.module('githubscout.home', ['nvd3ChartDirectives', 'leaflet-directive'])

.controller('HomeController', [ '$scope', 'ChartsUtil', 'Map','$http', function($scope, ChartsUtil, Map, $http){

  // Top 10 languages chart
  settings = {
    countType: 'activity',
    url: './data/home_top_language_by_activity_quarterly.csv'
  };

  ChartsUtil.fetchStackedAreaData(settings)
    .then(function(chartData){
      // console.log('Top languages', chartData);
      $scope.topLanguages  = chartData;
  });

  // Formats the JavaScript date object for the x axis labels
  $scope.xAxisTickFormat = function(){
      return function(d){
          return d3.time.format('%x')(new Date(d)); 
      };
  };
}]);
