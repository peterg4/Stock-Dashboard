


// Instantiate the myApp Angular application that we attached to out html tag
var app = angular.module("stonks", []);

// Here is the Javascript for our controller which we linked (scoped) to the body tag
app.controller("stonk-controller", ['$scope','$http',function($scope, $http) {
    $scope.ticker_response = [];
    $scope.close = 0.0;
    $scope.open = 0.0;
    $scope.low = 0.0;
    $scope.high = 0.0;
    $scope.dat = [];
    $scope.options;
    $scope.chart;
    $scope.getItems = function() {
        try { 
            var get_value = window.location.href.match(/(?<=search=)(.*?)[^&]+/)[0];
            var call = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+get_value+'&interval=5min&apikey=AU33596Z2YZ5B6C2';
          } catch{
            var call = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=5min&apikey=AU33596Z2YZ5B6C2';
        }
        $http({method : 'GET',url : call})
            .success(function(data, status) {
                $scope.ticker_response = data["Time Series (5min)"];
                google.charts.load('current', {'packages':['corechart']});
                var dat = [['Date', 'Price']];
                var i = 1;
                var keys=['1'];
                var timestamps = [new Date('2020-02-11 16:00:00')];
                var day = data["Meta Data"]["3. Last Refreshed"].substring(8,11);
                for( var prop in data["Time Series (5min)"]){
                    if(prop.substring(8,11) == day) {
                        keys.push(prop);
                        timestamps.push(new Date(prop));
                    }
                }
                var min = parseFloat($scope.ticker_response[keys[i]]["4. close"]);
                var max = 0;
                $scope.close = parseFloat($scope.ticker_response[keys[i]]["4. close"]);
                $scope.open = parseFloat($scope.ticker_response[keys[keys.length-1]]["1. open"]);
                var timestamp = 1;
                for(i=keys.length-1; i > 0; i--) {
                    if(parseFloat($scope.ticker_response[keys[i]]["4. close"]) < min){
                         min = parseFloat($scope.ticker_response[keys[i]]["4. close"]);
                    }
                    if(parseFloat($scope.ticker_response[keys[i]]["4. close"]) > max){
                         max = parseFloat($scope.ticker_response[keys[i]]["4. close"]);
                    }
                    dat.push([timestamps[i],parseFloat($scope.ticker_response[keys[i]]["4. close"])]);
                    timestamp++;
                }
                $scope.low = min;
                $scope.high = max;
                var dat_table = google.visualization.arrayToDataTable(dat);
          
                  var options = {
                    title: data["Meta Data"]["2. Symbol"]+" - "+new Date(data["Meta Data"]["3. Last Refreshed"]),
                    hAxis: {title: '',  titleTextStyle: {color: '#fffff0'}, textStyle:{color: '#fffff0'}, gridlines:{color: '#555555'}},
                    titleTextStyle: {color: '#fffff0'},
                    backgroundColor: '#333333',
                    colors:['#0F9D58'],
                    legendTextStyle: {color: '#fffff0'},
                    vAxis: {minValue: min*.9918, textStyle:{color: '#fffff0'}, gridlines:{color: '#555555'}}
                  };
                  $scope.options = options;
                  $scope.dat = dat_table;
                  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
                  $scope.chart = chart;
                  chart.draw(dat_table, options);                
            })
            .error(function(data, status) {
                alert("Error");
            });       
    }

    $scope.drawChart = function() {
        google.charts.load('current', {'packages':['corechart']});
    }

    $(window).resize(function(){
        $scope.chart.draw($scope.dat, $scope.options);
      });
}]);

