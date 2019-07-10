
// Based on https://bl.ocks.org/mbostock/4063318

var height = height / (options.end - options.start);
var cellHeight = height / 8;
var cellWidth = width / 60;
    
// function to draw paths between months
// see https://www.dashingd3js.com/svg-paths-and-d3js for notation
function pathMonth(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
  return "M" + (w0 + 1) * cellWidth + "," + d0 * cellHeight
      + "H" + w0 * cellWidth + "V" + 7 * cellHeight
      + "H" + w1 * cellWidth + "V" + (d1 + 1) * cellHeight
      + "H" + (w1 + 1) * cellWidth + "V" + 0
      + "H" + (w0 + 1) * cellWidth + "Z";
}


// create the calendar graphic with cells for each day
var calendar = div
  .style("line-height", "0")
  .selectAll("svg")
  .data(d3.range(options.start, options.end))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + cellWidth * 3.5 + "," + (height - cellHeight * 7 - 1) + ")");

// append a text layer for the years on the LHS
calendar.append("text")
    .attr("transform", 
          "translate(-" + (6 * height / 60) + "," + cellHeight * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 2 + 8 * height / 60)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });
    
// add calendar background grid with all days for each year
var grid = calendar.append("g")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "0.25")
  .selectAll("rect")
  .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("width", cellWidth)
    .attr("height", cellHeight)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellWidth; })
    .attr("y", function(d) { return d.getDay() * cellHeight; })
    .datum(d3.timeFormat("%d/%m/%Y"))
    .attr("d", function(d) { return d; })
    .on("click", function() {
      Shiny.setInputValue("date_click", { 
        nonce: Math.random(),
        date: d3.select(this).attr("d")
      });
    });
    
// append a graphical layer for the month-end paths
calendar.append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.5")
  .selectAll("path")
  .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("d", pathMonth);

// change things on rendering
r2d3.onRender(function(data, svg, width, height, options) {

  // nest the data
  var source = d3.nest()
      .key(function(d) { return d.date; })
      .rollup(function(v) { return v[0].value })
      .object(data);
     
  // set colors 
  var color = d3.scaleQuantize()
    .domain([0, d3.max(data, function(d) { return d.value; } )])
    .range(options.colors);
      
  // update all the rectangles to blank
  grid.filter(function(d) { return d; })
      .attr("fill", "none");
  
  // add colour back to relevant squares
  grid.filter(function(d) { return d in source; })
      .attr("fill", function(d) { return color(source[d]); });
      
  // add red box round today if desired
  if (options.showToday) {
    var format = d3.timeFormat("%d/%m/%Y");
    grid.filter(function(d) { return d == format(new Date()); })
        .attr("stroke", "#f00")
        .attr("stroke-width", "1"); 
  }
      
});
