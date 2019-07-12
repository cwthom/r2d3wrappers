
# Functions for Using D3 Graphics -----------------------------------------

#' D3 Calendar Visual
#' 
#' Function to create a D3 calendar graphic.
#' @param data A data.frame containing columns to use for date and value
#' @param date The column containing the dates to use for the calendar
#' @param value The column containing the values
#' @param start The start year for the calendar e.g. 2018
#' @param end The end year for the calendar e.g. 2020
#' @param colors A vector of colors to provide the interpolated color scale
#' @param showToday Mark out today's date?
#' @param dateFormat The format string for the dates in \code{data} 
#' @param width,height Parameters to override the default sizing policy
#' 
#' @export
#' @name Calendar
#' 
d3_calendar <- function(data, date, value, start, end, colors,
                        showToday = TRUE, dateFormat = "%Y-%m-%d",
                        width = NULL, height = NULL) {
  
  # make use of rlang 0.4.0 and {{}} for NSE
  data <- data %>% dplyr::select(date = {{ date }}, value = {{ value }})
  
  r2d3::r2d3(data = data, container = "div", 
             width = width, height = height,
             options = list(start = start, end = end,
                            colors = c("#FFFFFF", colors),
                            showToday = showToday,
                            dateFormat = dateFormat),
             script = system.file("d3", "calendar", "calendar.js",
                                  package = "r2d3wrappers")) 
}
