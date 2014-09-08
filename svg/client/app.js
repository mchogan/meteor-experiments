//client only code

Template.shapes.shapes = function () {
  return Shapes.find({});
};

Template.shapes.repeater = function (timesToRepeat) {
  var xPosition = 40,
    gap = 40,
    out = "<svg width='300' height='200'>";

  timesToRepeat = timesToRepeat || 3;

  for(var i = 0; i < timesToRepeat; i++) {
    out = out + "<circle cx='" + xPosition + "' cy='60' r='10' fill='blue' stroke='red' stroke-width='2' />";
    xPosition = xPosition + gap;
  }

  return out + "</svg>";
}