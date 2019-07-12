
// Originally based on: https://bl.ocks.org/mbostock/4063570
// This script based on: https://rstudio.github.io/r2d3/articles/gallery/dendogram/

var tree = d3.cluster()
    .size([height, width - 160]);

var stratify = d3.stratify()
    .parentId(function(d) { 
      return d.id.substring(0, d.id.lastIndexOf(".")); 
    });

r2d3.onRender(function(data, svg, width, height, options) {
  
  var dendrogram = svg.append("g")
    .attr("transform", "translate(40,0)");
  
  var root = stratify(data)
      .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

  tree(root);

  // add links using cubic paths
  var link = dendrogram
    .selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + d.y + "," + d.x
            + "C" + (d.parent.y + 100) + "," + d.x
            + " " + (d.parent.y + 100) + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
      });

  // add nodes
  var node = dendrogram
    .selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { 
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
      });
  
  // add a circle to each node
  node.append("circle")
      .attr("r", 2.5);

  // add a text label to each node
  node.append("text")
      .attr("dy", 3)
      .attr("font-size", 2 + 4 * height / 1000)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
});