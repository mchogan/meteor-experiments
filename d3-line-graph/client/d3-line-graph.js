/*globals d3, Deps, Meteor, Points, Session, Template */
/*jslint nomen:true */

Template.input.helpers({
  pointsAsJSON: function () {
    'use strict';
    // get data
    var data = Points.find();
    // transform data into a JSON string
    return JSON.stringify(data.fetch(), undefined, 2);
  }
});

Template.table_transformation.helpers({
  points: function () {
    'use strict';
    return Points.find();
  }
});

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
  
  margin = {top: 20, right: 120, bottom: 30, left: 50};
  width = 640 - margin.left - margin.right;
  height = 480 - margin.top - margin.bottom;

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

  // define the function that will draw the line
  // for each data series
  line = d3.svg.line()
    .interpolate("linear") // the shape of the line
    .x(function (d) { return x(d.timestamp); }) // timestamp as the x coordinate
    .y(function (d) { return y(d.temperature); }); // temperature as the y coordinate

  svg = d3.select("#chart_container")
    .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  
  chart = svg
    .append("g")
      .attr("class", "chart-area")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // add the x axis
  chart
    .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

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
  
  function keyFunction(d) {
    return d.series;
  }
  
  // everything below this point depends on data
  
  Deps.autorun(function () {
    var chartData, minX, maxX, minY, maxY, labels, lines, series, seriesEnter, seriesExit;
    Meteor._debug("requesting chart data");
    chartData = Points.find().fetch();
    //
    //  Expects input in an array similar to...
    //
    //  [
    //    {series: "one", values: [{timestamp: 1, temperature: 1}, {timestamp: 2, temperature: 2}]},
    //    {series: "two", values: [{timestamp: 1, temperature: 1}, {timestamp: 2, temperature: 2}]}
    //  ]
    //
    
    // make sure we're getting the chart data we need
    // if chartData exists, then draw the chart
    if (chartData.length > 0) {
      Meteor._debug("we have chart data");
      //Meteor._debug("chart data: " + JSON.stringify(chartData, undefined, 2));

      // assign each data series a color that will be used to plot it's line    
      color.domain(chartData.map(function (d) { return d.series; }));

      // complete the definition of x by adding a domain to the time.scale() and .range
      minX = d3.min(chartData, function (d) { return d3.min(d.values, function (d) { return d.timestamp; }); });
      maxX = d3.min(chartData, function (d) { return d3.max(d.values, function (d) { return d.timestamp; }); });
      x.domain([minX, maxX]);

      // complete the definition of y by adding a domain to the scale.linear() and .range
      minY = d3.min(chartData, function (d) { return d3.min(d.values, function (d) { return d.temperature; }); });
      maxY = d3.max(chartData, function (d) { return d3.max(d.values, function (d) { return d.temperature; }); });
      Meteor._debug("y[" + minY + "," + maxY + "]");
      y.domain([minY, maxY]);
      
      // scale the x axis and add to chart
      svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);
      
      svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);
            
      // DATA JOIN
      // Join new data with old elements, if any.
      series = chart.selectAll(".series")
        .data(chartData, keyFunction); // use the series' name as it's identifier
      
      Meteor._debug("data joined...");
      
      // ENTER
      // Create new elements as needed.
      // append any new series as a <g> element with a class="series"
      seriesEnter = series.enter()
        .append("g")
        .attr("class", "series")
        .attr("id", function (d) { return d.series; });

      // append a <path class="line" ... > to each entering series
      seriesEnter.append("path")
        .attr("class", "line");

      // append a <text class="label" ... > to each entering series
      // in the transform below,
      // the x function defined on line 48 returns the scaled value of the date
      // the y function defined on line 51 returns the scaled value of the temperature
      seriesEnter.append("text")
        .attr("class", "label")
        .attr("x", 3)
        .attr("dy", ".35em");
      
      Meteor._debug("data has entered...");

      // ENTER + UPDATE
      // Appending to the enter selection expands the update selection to include
      // entering elements; so, operations on the update selection after appending to
      // the enter selection will apply to both entering and updating nodes.
      
      lines = series.selectAll("path")
        .data(chartData, keyFunction);
      
      Meteor._debug("line data joined...");

      
      lines
        .transition()
        .duration(1000)
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { return color(d.series); });
      
      Meteor._debug("lines updated...");
      
      labels = series.selectAll("text")
        .data(chartData, keyFunction);
      
      Meteor._debug("label data joined...");
      
      labels
        .transition()
        .duration(1000)
        .attr("transform", function (d) {
          var xCoord, yCoord, translation;
          xCoord = d.values[d.values.length - 1].timestamp;
          yCoord = d.values[d.values.length - 1].temperature;
          translation = "translate(" + x(xCoord) + "," + y(yCoord) + ")";
          return translation;
        })
        .text(function (d) { return d.series; });
      
      Meteor._debug("labels updated...");


      // EXIT
      // Remove old elements as needed.
      seriesExit = series.exit();
      
      seriesExit
        .transition()
        .duration(1000)
        .remove();
      
      Meteor._debug("exiting series removed...");
      
      Meteor._debug("graph redrawn");
      
    } else {
      Meteor._debug("chart data not yet available");
    }
  });
};
