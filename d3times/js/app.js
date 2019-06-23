// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");
  if (!svgArea.empty()) {
      svgArea.remove();
  }
    
  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window minus a percent.
  var svgHeight = window.innerHeight * .9;
  var svgWidth = window.innerWidth * .8; 

  // Define the margin, width and height dimensions
  var margin = {
      top: 20,
      right: 40,
      bottom: 80,
      left: 80
    };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Define the radius for the circles and the font size for the labels
  var radius = 0;
  var fontSize = 0;
  if (svgWidth > 960) {
    // For Large ≥992px	and Extra large ≥1200px screens
     radius = 25;
     fontSize = 12;
  }
  else if (svgWidth > 720) {
    // For Medium ≥768px screens
     radius = 20;
     fontSize = 10;
  }
  else {
    // For Extra small <576px	Small and ≥576px screens
    radius = 15;
    fontSize = 8;
  }

  // Create an SVG wrapper, append an SVG group that will hold the chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

  // Initial Params for the axis
  var chosenXAxis = "poverty";
  var chosenYAxis = "obesity";

 // Function used for updating X-scale var upon click on axis label
  function xScale(factData, chosenXAxis) {
    // create scale
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(factData, d => d[chosenXAxis]) * 0.95,
              d3.max(factData, d => d[chosenXAxis]) * 1.01])
      .range([0, width]);
    return xLinearScale;
  }

// Function used for updating Y-scale var upon click on axis label
  function yScale(factData, chosenYAxis) {
    //  Define the value that will be used for the domain min value
    var factor = 0;
    if (chosenYAxis === 'healthcare') {
      factor = .7;
    }
    else {
      factor = .88;
    }
    // create scale
    var yLinearScale = d3.scaleLinear()
       .domain([d3.min(factData, d => d[chosenYAxis]) * factor,
                d3.max(factData, d => d[chosenYAxis]) * 1.01])
      .range([height, 0]);
    return yLinearScale;
  }

 // Function used for updating Axis var upon click on axis label
  function renderAxes(update, newScale, xAxis, yAxis) {
    // Chech which axis must change
    if (update === "x") {
        var bottomAxis = d3.axisBottom(newScale);
        // update the XAxis
        xAxis.transition()
          .duration(500)
          .call(bottomAxis);
      
        return xAxis;
    }
    else {
      var leftAxis = d3.axisLeft(newScale);
      // update the YAxis
      yAxis.transition()
        .duration(500)
        .call(leftAxis);
    
      return yAxis;

    }
  }
  
  // Function used for updating circles group with a transition to new circles
  function renderCircles(update, circlesGroup, newScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000);
    
    // Select the labels - state abbreviations
    var sel = chartGroup.select('g.join')
        .selectAll("text");
  
    // Check which Axis must change
    if (update === "x") {
      // Update the scale to reposition the circles and update the labels
      circlesGroup.attr("cx", width / 2)
          .attr("r", 1)
          .transition()
          .duration(1000)
          .attr("cx", d => newScale(d[chosenXAxis]))
          .attr("r", radius);

      sel.attr("x",d => newScale(d[chosenXAxis]));
    }
    else {
      // Update the scale to reposition the circles and update the labels
      circlesGroup.attr("cy", height / 2)
          .attr("r", 1)
          .transition()
          .duration(1000)
          .attr("cy", d => newScale(d[chosenYAxis]))
          .attr("r", radius);

      sel.attr("y",d => newScale(d[chosenYAxis]));
    }

    if (chosenXAxis==="poverty" || (chosenXAxis==="age" && chosenYAxis==="smokes")) {
      // The color teal will be assigned to those combinations of variables where the correlation is positive
      circlesGroup.attr("fill", "teal").attr("stroke", "#e3e3e3");
    }
    else {
      // The color lightsalmon will be assigned to those combinations of variables where the correlation is negative
      circlesGroup.attr("fill", "lightsalmon").attr("stroke", "#e3e3e3");
    }

    return circlesGroup;
  }

  // Function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
     var xLabel = "";
     var yLabel = "";
     var xUnit = "";
     var yUnit = "";
     // Define the Xaxis variables and the unit of measure for each variable
     switch (chosenXAxis)
       {
         case("poverty"): {
            xLabel = "Poverty:";
            xUnit = " %";
            break;
         }
         case("age"): {
            xLabel = "Age:";
            xUnit = " (median)";
            break;
         }
         case("income"): {
            xLabel = "Income:";
            xUnit = " (median)";
            break;
          }
        }
      // Define the Yaxis variables and the unit of measure for each variable
      switch (chosenYAxis)
        {
          case("obesity"): {
            yLabel = "Obesity:";
            yUnit = " %";
            break;
         }
         case("smokes"): {
            yLabel = "Smoking:";
            yUnit = " %";
            break;
          }
          case("healthcare"): {
            yLabel = "Healthcare:";
            yUnit = " %";
            break;
          }
        }
  
    // Define the tooltip with the style and the data to be displayed, and make the call
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]} ${xUnit}<br>${yLabel} ${d[chosenYAxis]} ${yUnit}`);
      });
    circlesGroup.call(toolTip);

    // Define the actions to do with the tooltip
    // Onmouseover event
    circlesGroup.on("mouseover", function(data) {
             toolTip.show(data, this);
         })
    // Onmouseout event
        .on("mouseout", function(data, index) {
             toolTip.hide(data, this);
         });

    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("./data/data.csv").then(function(factData) {

    // Parse data to convert it to numbers
    factData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;    
      data.obesity = +data.obesity;    
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
    });

    // Create Xscale function
    var xLinearScale = xScale(factData, chosenXAxis);

    // Create Yscale function
    var yLinearScale = yScale(factData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Xaxis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Append Yaxis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Define the group for the circles
    var circle = chartGroup.append('g').classed('join', true);

    // Append initial circles
    var circlesGroup = circle.selectAll("circle")
        .data(factData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("fill", "teal")
        .attr("stroke", "#e3e3e3")
        .attr("opacity", ".8");

      // Initial transition, the circles start at the botton of the chart and
      // then take their corresponding position
      circlesGroup.attr("cy", height)
        .attr("r", 1)
        .transition()
        .duration(1500)
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", radius);

      // Define the labels for the circles, the labels start at the bottom 
      // of the chart and then take their corresponding position
      circle.selectAll("text")
        .data(factData)
        .enter()
        .append("text")
        .attr("x",d => xLinearScale(d[chosenXAxis]))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size',fontSize)
        .attr('fill',"#fff")
        .text(d => d.abbr)
        .attr("y",height)
        .transition()
        .duration(2000)
        .attr("y",d => yLinearScale(d[chosenYAxis]));

    // Create group for Xaxis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Define the labels for event listener onClick
    var povLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") 
      .classed("inactive", true)
      .text("Age (Median)");

    var incLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Create group for y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${0 - margin.left},${height / 2})`);

    // Define the labels for event listener onClick
    var obeLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obese (%)");

    var smoLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var careLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 40)
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    // Define variable with the call to the function for updating ToolTips
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // XAxis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // Get value of selection
        var value = d3.select(this).attr("value");

        // Define which axis to update
        var update = "x";

        if (value !== chosenXAxis) {

          // Replaces chosenXAxis with value
          chosenXAxis = value;

          // Updates x scale for new data
          xLinearScale = xScale(factData, chosenXAxis);

          // Updates x axis with transition
          xAxis = renderAxes(update, xLinearScale, xAxis, yAxis);

          // Updates circles with new x values
          circlesGroup = renderCircles(update, circlesGroup, xLinearScale, chosenXAxis, chosenYAxis);

          // Updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // Changes classes to change bold text
          switch (chosenXAxis)
          {
              case("poverty"): {
                  povLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  incLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  break;
              }
              case("age"): {
                  povLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  ageLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  incLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  break;
              }
              case("income"): {
                  povLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  incLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  break;
              }
          }
        }
      });

    // YAxis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // Get value of selection
      var value = d3.select(this).attr("value");
     
      // Define which axis to update
      var update = "y";

      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // Updates y scale for new data
        yLinearScale = yScale(factData, chosenYAxis);

        // Updates y axis with transition
        yAxis = renderAxes(update, yLinearScale, xAxis, yAxis);

        // Updates circles with new x values
        circlesGroup = renderCircles(update, circlesGroup, yLinearScale, chosenXAxis, chosenYAxis);

        // Updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Changes classes to change bold text
        switch (chosenYAxis)
        {
          case("obesity"): {
                obeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smoLabel
                    .classed("active", false)
                    .classed("inactive", true);
                careLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
            }
            case("smokes"): {
                obeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smoLabel
                    .classed("active", true)
                    .classed("inactive", false);
                careLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
            }
            case("healthcare"): {
                obeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smoLabel
                    .classed("active", false)
                    .classed("inactive", true);
                careLabel
                    .classed("active", true)
                    .classed("inactive", false);
                break;
            }
        }

      }
    });
  });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

