
# Functions for Using D3 Graphics -----------------------------------------

#' D3 RadialTree Visual
#' 
#' Function to create a D3 radialtree graphic.
#' @param data Data for the radialtree - TODO: give format
#' @param width,height Parameters to override the default sizing policy
#' 
#' @export
#' @name RadialTree
#' 
d3_radialtree <- function(data, width = NULL, height = NULL) {
  
  r2d3::r2d3(data = data,
             width = width, height = height,
             script = system.file("d3", "radialtree", "radialtree.js",
                                  package = "r2d3wrappers"),
             css = system.file("d3", "radialtree", "radialtree.css",
                               package = "r2d3wrappers"))
}
