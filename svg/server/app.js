//server only code

Meteor.startup(function () {
  if (Shapes.find().count() === 0) {
    var someshapes = [
      {cx: 40, cy: 60, r: 6},
      {cx: 80, cy: 60, r: 8},
      {cx: 120, cy: 60, r: 12}
      ];
    for (var i = 0; i < someshapes.length; i++)
      Shapes.insert(someshapes[i]);
  }
});