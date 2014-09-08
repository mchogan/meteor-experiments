Meteor.startup(function () {
  // code to run on server at startup
  if (Points.find().count() === 0) {
    var somePoints = [
      {series: "Phoenix", timestamp: new Date(2014, 8, 8, 12), temperature: 92},
      {series: "Phoenix", timestamp: new Date(2014, 8, 9, 12), temperature: 95},
      {series: "Phoenix", timestamp: new Date(2014, 8, 10, 12), temperature: 94},
      {series: "Phoenix", timestamp: new Date(2014, 8, 11, 12), temperature: 99},
      {series: "Phoenix", timestamp: new Date(2014, 8, 12, 12), temperature: 103},
      {series: "Phoenix", timestamp: new Date(2014, 8, 13, 12), temperature: 101},
      {series: "Phoenix", timestamp: new Date(2014, 8, 14, 12), temperature: 101},
      {series: "Phoenix", timestamp: new Date(2014, 8, 15, 12), temperature: 103},
      {series: "Phoenix", timestamp: new Date(2014, 8, 16, 12), temperature: 101},
      {series: "Phoenix", timestamp: new Date(2014, 8, 17, 12), temperature: 103},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 8, 12), temperature: 80},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 9, 12), temperature: 80},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 10, 12), temperature: 82},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 11, 12), temperature: 84},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 12, 12), temperature: 85},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 13, 12), temperature: 88},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 14, 12), temperature: 89},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 15, 12), temperature: 90},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 16, 12), temperature: 91},
      {series: "Huntington Beach", timestamp: new Date(2014, 8, 17, 12), temperature: 89}
      ];
    for (var i = 0; i < somePoints.length; i++)
      Points.insert(somePoints[i]);
  }
});
