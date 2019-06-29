# Interactive Data Visualizations

Applying the skills learned so far to some real-world situations.


## Data Journalism and D3 Assignment

__D3.js, JavaScript, HTML, CSS and Bootstrap__ were used to build an interactive 
graphic and other informative elements for sharing the findings about the health 
risks in the United States.

The [data set](d3times/data/data.csv) used for this assignment is based on 
2014 ACS 1-year estimates.

### Level 1: D3 Dabbler

Use D3.js to create a [scatter plot](d3times/js/app.js) between two data variables such 
as `Obesity (%) vs. Poverty (%)`.

### Level 2: 1. More Data, More Dynamics and 2. Incorporate d3-tip

This level includes the plot from Level 1 and:
  - More demographics and risk factors for both axes.
  - Additional labels and click events so that the users can decide which data to display.
  - Animated transitions for the circles' locations as well as the range of the axes. 
  - Tooltips were added to the circles to reveal a specific element's data, when the user 
  hovers their cursor over the element. The `d3-tip.js` plugin developed by 
  [Justin Palmer](https://github.com/Caged) was included in the code.

Go to the [repository](d3times/).


## Visualizing Data with Leaflet Assignment 

__Leaflet, JavaScript, HTML, CSS and D3.js__ were used to build a tool that will allow 
the United States Geological Survey (USGS) to visualize their earthquake data and to 
educate the public and other government organizations on issues facing our planet.

## Level 1: Basic Visualization

  - The data set selected for this visualization was available in the 
option `All Earthquakes from the Past 7 Days` from [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page as a GeoJSON file.

  - A map using Leaflet was created. The map shows all of the earthquakes from the data set based on their longitude and latitude, with a legend that provides context for the data.

## Level 2: More Data

In this level, a second data set was plotted on the map to illustrate the relationship between tectonic plates and seismic activity. The data set selected is available in this [page](https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json) as a GeoJSON file. .


Go to the [repository](earthquakes/).
