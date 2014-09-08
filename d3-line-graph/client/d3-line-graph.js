// counter starts at 0
Session.setDefault("counter", 0);

Template.input.helpers({
  points: function () {
    return Points.find({});
  },
  pointsAsJSON: function () {
    var data = Points.find();
    return JSON.stringify(data.fetch(), undefined, 2);
  }
});

Template.hello.helpers({
  counter: function () {
    return Session.get("counter");
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);
  }
});
