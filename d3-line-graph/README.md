An experiment based on Mike Bostock's [Line Chart](http://bl.ocks.org/mbostock/3883245) and [Multi-series Line Chart](http://bl.ocks.org/mbostock/3884955) tutorials.

[See this experiment on MeteorPad](http://meteorpad.com/pad/yCwF6aX2R5oG58Y4Y).

## Other Mike Bostock references:
* [General Update Pattern, I](http://bl.ocks.org/mbostock/3808218)
* [General Update Pattern, II](http://bl.ocks.org/mbostock/3808221), which introduces key funcions
* [General Update Pattern, III](http://bl.ocks.org/mbostock/3808234), which introduces transitions
* [Thinking with Joins](http://bost.ocks.org/mike/join/)
* [Object Constancy](http://bost.ocks.org/mike/constancy/)

## Spacebars references:
* [Drew Noakes](http://stackoverflow.com/users/24874/drew-noakes) gave a concise explaination on Stackoverflow for how to access parent properties from within a nested `{{#each}}` loop.[1][1]
[1]: http://stackoverflow.com/a/12297980

## The tricky part - Data Bindings
Databindings in d3 are confusing. The General Update Pattern tutorials Mike Bostock has provided give a nice introduction for handling CSV data and simple object structures; however, I found they broke when I introduced a nested JSON data structure like that in this sample application:

    [
        {
            "_id": "kW8ubfnRGrJHAxRwt",
            "name": "one",
            "values": [
                {
                    "timestamp": 1,
                    "temperature": 1
                },
                {
                    "timestamp": 2,
                    "temperature": 2
                }
            ]
        },
        {
            "_id": "4fJK7QRzn2L5itYZR",
            "name": "two",
            "values": [
                {
                    "timestamp": 1,
                    "temperature": 1
                },
                {
                    "timestamp": 2,
                    "temperature": 2
                }
            ]
        }
    ]

For data structures like this, which are common in the MongoDB documents used by Meteor.js, it is necessary to bind data between SVG elements and JSON data at each layer of the data structure. For example, in the `Template.chart.rendered` helper I bind data first to get the data series (line 159) and then to get the paths (line 192) and labels (line 206).

## Line Shape
d3 uses interpolation to determine line shape. For various examples see the [SVG Paths and d3js](https://www.dashingd3js.com/svg-paths-and-d3js) article at dashingd3js.com. This example uses the "linear" interpolation.