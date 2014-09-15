var userapp = angular.module('githubscout.user', ['ui.router','nvd3ChartDirectives']);

userapp.controller('UserController', ['$scope', 'UserData', 'UserSearch', 'UserDateandCommits','UserLanguagesandCommits','UserCompareRescaleBar',function($scope, UserData, UserSearch, UserDateandCommits,UserLanguagesandCommits,UserCompareRescaleBar) {
  $scope.userdata ={};
  $scope.username = UserData.username;
  $scope.userdata.data = UserData.rawDataCommitsByLanguage;
  //saving our total for pie chart
  var pieTotal = 0;
  var pieTotal2 = 0;

  var getCompareRescaleBar = function(firstUserData,secondUserData){
    return UserCompareRescaleBar.getCompareRescaleBar($scope.userDateandCommits, secondUserData);
  };

  var getdateandCommits = function(data){
    return UserDateandCommits.getdateandCommits(data);
  };

  var getUserCommitsperLanganguage = function(data){
    return UserLanguagesandCommits.getUserCommitsperLanganguage(data);
  };

  //combining the commits with the same date into one
  var checkDate = function(data){
    var time = {};
    var timeArray = [];
    _.each(data, function(value){
      var date = value[0];
      var ammount = value[1];
      if( !time.hasOwnProperty(date) ){
        time[date] = ammount;
      } else {
        time[date]+= ammount;
      }
    });

    _.each(time, function(value, key){
      timeArray.push([key, value]);
    });

    return timeArray;
  };

  $scope.userDateandCommits =  checkDate( getdateandCommits($scope.userdata.data).reverse() );
  // console.log( $scope.userDateandCommits );

  // Data for first user bar chart.
  $scope.commitsbyDateData =[{
    key : $scope.username,
    values : $scope.userDateandCommits
  }];

  // Data for first user pie chart.
  $scope.commitsperLangugageData = getUserCommitsperLanganguage($scope.userdata.data);
  //grab total for first pie chart
  for(var i = 0; i < $scope.commitsperLangugageData.length; i++){
    pieTotal += $scope.commitsperLangugageData[i].count;
  }

  // Function grabs second user's data from compare user input to compare with first user on same commits over time chart AND to display second pie chart.
  $scope.addUser = function () {

    // This will add a header for the second pie chart.
    $scope.items = {title: $scope.userdata.nextUsername};

    UserSearch.getUserCommitsByLanguage({username: $scope.userdata.nextUsername})
      .then(function (data) {
        var secondUserDateandCommits = checkDate( getdateandCommits(data).reverse() );
        var combinedNewandOldUserDatesData = getCompareRescaleBar($scope.userDateandCommits, secondUserDateandCommits);

        // Data for first AND second user bar chart.
        $scope.commitsbyDateData =
          [{
           key: $scope.username,
           values: combinedNewandOldUserDatesData
          },
          {
            key: $scope.userdata.nextUsername,
            values: secondUserDateandCommits
          }];

        //gets data for second user's commits by language, which is displayed as a pie chart.
        $scope.commitsperLangugageDataUser2 = getUserCommitsperLanganguage(data);
        //grab total for second pie chart
        for(var i = 0; i < $scope.commitsperLangugageDataUser2.length; i++){
          pieTotal2 += $scope.commitsperLangugageDataUser2[i].count;
        }

      });
  };

  //Function that allows nvd3 and d3 to access x values from the ‘data’.
  $scope.xFunction = function() {
    return function(d) {
      return d.language;
    };
  };
  //Function that allows nvd3 and d3 to access y values from the ‘data’.
  $scope.yFunction = function() {
    return function(d) {
      return d.count;
    };
  };
  //function that allows nvd3 and d3 to have tool tip for pie graph
  $scope.toolTipContentFunction = function(arg){
    if(arg){
      var total = pieTotal2;
    } else {
      var total = pieTotal;
    }

    return function(key, x, y, e, graph) {
        return '<h1 style="text-align: center">' + key + '</h1>' +
              '<p>' + 'Value: ' + parseInt(x) + ' commits' + '</p>' +
              '<p>' + 'Percentage: ' + (x/total*100).toFixed(2) + '%' + '</p>';
    };
  };
}]);
