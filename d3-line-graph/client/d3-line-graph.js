/*globals d3, Deps, Meteor, Points, Session, Template */
/*jslint nomen:true */

// counter starts at 0
Session.setDefault("counter", 0);

Template.input.helpers({
  points: function () {
    'use strict';
    return Points.find();
  },
  pointsAsJSON: function () {
    'use strict';
    // get data
    var data = Points.find();
    // transform data into a JSON string
    return JSON.stringify(data.fetch(), undefined, 2);
  }
});


Template.chart.helpers({
  //
});

Template.chart.created = function () {
  'use strict';
  //
};

Template.chart.rendered = function () {
  'use strict';
  // Data-independent chart variables;
  var margin,
    width,
    height,
    x,
    y,
    color,
    xAxis,
    yAxis,
    line,
    svg,
    chart;
  
  margin = {top: 20, right: 80, bottom: 30, left: 50};
  width = 586 - margin.left - margin.right;
  height = 331 - margin.top - margin.bottom;

  // x is a function that returns the scaled display value in the range
  // for a given data value in the domain
  x = d3.time.scale()
    .range([0, width]);

  // y is a function that returns the scaled display value in the range
  // for a given data value in the domain
  y = d3.scale.linear()
    .range([height, 0]);

  // color is a function that returns a color
  // for a given data value in the domain
  color = d3.scale.category20();
  
  /* alternately, custom color domain
  color = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["red", "white", "green"]);
    
    see: https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_domain
  */

  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  line = d3.svg.line()
    .interpolate("step-after") // was "basis"
    .x(function (d) { return x(d.timestamp); })
    .y(function (d) { return y(d.temperature); });

  svg = d3.select("#chart_container")
    .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  
  chart = svg
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // add the x axis
  chart
    .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // add the y axis
  chart
    .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (ºF)");
  
  // everything below this point depends on data
  
  Deps.autorun(function () {
    var data, chartData, minY, maxY, dataseries, series, seriesUpdate, seriesEnter, seriesExit;
    
    data = Points.find();
    chartData = data.fetch();
    //
    //  Expects input in an array similar to...
    //
    //  [
    //    {name: "one", values: [{timestamp: 1, temperature: 1}, {timestamp: 2, temperature: 2}]},
    //    {name: "two", values: [{timestamp: 1, temperature: 1}, {timestamp: 2, temperature: 2}]}
    //  ]
    //
    
    Meteor._debug("chart data: " + JSON.stringify(chartData, undefined, 2));
    
    // build the data series and assign each series a color    
    color.domain(chartData.map(function (d) { return d.name; }));
    
    // complete the definition of x by adding a domain to the time.scale() and .range
    x.domain(d3.extent(chartData, function (d) { return d.timestamp; }));
    
    minY = d3.min(chartData, function (d) { return d.temperature; });
    minY = d3.max(chartData, function (d) { return d.temperature; });
    
    // complete the definition of y by adding a domain to the scale.linear() and .range
    y.domain([minY, maxY]);
    
    dataseries = color.domain().map(function (series) {
      return {
        name: series,
        values: data.map(function (d) {
          return {date: new Date(d.timestamp).valueOf(), temperature: +d.temperature};
        })
      };
    });
    
    Meteor._debug("dataseries as JSON: " + JSON.stringify(dataseries, undefined, 2));

    series = chart.selectAll(".series");
    
    seriesUpdate = series.data(dataseries);
    
    // append any new series as a <g> element with a class="series"
    seriesEnter = seriesUpdate.enter()
          .append("g")
          .attr("class", "series");

    // append a <path class="line" ... > to each entering series
    seriesEnter.append("path")
          .attr("class", "line")
          .attr("d", function (d) { return line(d.values); })
          .style("stroke", function (d) { return color(d.name); });
    
    // append a <text class="label" ... > to each entering series
    // in the transform below,
    // the x function defined on line 48 returns the scaled value of the date
    // the y function defined on line 51 returns the scaled value of the temperature
    seriesEnter.append("text")
          .attr("class", "label")
          .datum(function (d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function (d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function (d) { return d.name; });
    
    seriesExit = seriesUpdate.exit();
    
  });
};

Template.chart.destroyed = function () {
  'use strict';
};

Template.hello.helpers({
  counter: function () {
    'use strict';
    return Session.get("counter");
  }
});

Template.hello.events({
  'click button': function () {
    'use strict';
    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);
  }
});
