
// Originally based on: https://bl.ocks.org/mbostock/4063550
// This script based on: https://rstudio.github.io/r2d3/articles/gallery/radialtree/

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var tree = d3.tree()
    .size([2 * Math.PI, 500])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
    
function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

r2d3.onRender(function(data, svg, w, h, options) {

  var minSize = Math.min(width, height);
  var radialtree = svg.append("g")
    .attr("transform",
          "translate(" + (width / 2) + "," + (height / 2) + ")," +
          "scale(" + minSize / 1200 + "," + minSize / 1200 + ")");
  
  var root = tree(stratify(data));

  // add links using radial paths
  var link = radialtree
    .selectAll(".link")
    .data(root.links())
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial()
          .angle(function(d) { return d.x; })
          .radius(function(d) { return d.y; }));

  // add nodes at each point
  var node = radialtree
    .selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { 
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) { 
        return "translate(" + radialPoint(d.x, d.y) + ")"; 
      });

  // add circles to each node
  node.append("circle")
      .attr("r", 2.5);

  // add text labels to each node, rotating text according to phase
  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", function(d) { 
        return d.x < Math.PI === !d.children ? 6 : -6;
      })
      .attr("text-anchor", function(d) { 
        return d.x < Math.PI === !d.children ? "start" : "end";
      })
      .attr("transform", function(d) {
        return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; 
      })
    .text(function(d) { 
      return d.id.substring(d.id.lastIndexOf(".") + 1);
    });
});

