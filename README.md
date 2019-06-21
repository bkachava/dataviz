# Interactive Data Visualizations

Applying the skills learned so far to some real-world situations.


## Data Journalism and D3 Assignment

__D3.js, JavaScript, HTML, CSS and Bootstrap__ were used to build an interactive 
graphic and other informative elements for sharing the findings about the health 
risks in the United States.

The [data set](dataviz/data/data.csv) used for this assignment is based on 
2014 ACS 1-year estimates.

### Level 1: D3 Dabbler

Use D3.js to create a [scatter plot](dataviz/js/app.js) between two data variables such 
as `Obesity (%) vs. Poverty (%)`.

### Level 2: 1. More Data, More Dynamics and 2. Incorporate d3-tip

This level includes the plot from Level 1 and:
  - More demographics and risk factors for both axes.
  - Additional labels and click events so that the users can decide which data to display.
  - Animated transitions for the circles' locations as well as the range of the axes. 
  - To reveal a specific element's data, when the user hovers their cursor over the element,
   tooltips were added to the circles.  The `d3-tip.js` plugin developed by 
   [Justin Palmer](https://github.com/Caged) was included in the code.

Go to the [repository](d3times/).