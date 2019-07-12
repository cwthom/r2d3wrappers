
# Functions for Using D3 Graphics -----------------------------------------

#' D3 Dendrogram Visual
#' 
#' Function to create a D3 dendrogram graphic.
#' @param data Data for the dendrogram - TODO: give format
#' @param width,height Parameters to override the default sizing policy
#' 
#' @export
#' @name Dendrogram
#' 
d3_dendrogram <- function(data, width = NULL, height = NULL) {
  
  r2d3::r2d3(data = data,
             width = width, height = height,
             script = system.file("d3", "dendrogram", "dendrogram.js",
                                  package = "r2d3wrappers"),
             css = system.file("d3", "dendrogram", "dendrogram.css",
                               package = "r2d3wrappers"))
}
