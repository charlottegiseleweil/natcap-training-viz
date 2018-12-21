function createAreaGraph(data_path, container_id) {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50}

  d3.csv(data_path, (d, i, columns) => {
    return {
      date: new Date(d.Year,0),
      close: +d.Count
    }
  }).then((data) => {
    function drawAreaGraph() {
      var size = d3.select(container_id).node().parentNode.getBoundingClientRect()

      var width = size.width - margin.left - margin.right
      var height = size.height - margin.top - margin.bottom

      // parse the date / time
      var parseTime = d3.timeParse("%d-%b-%y");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // define the area
      var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d.close); });

      var zeroArea = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return height; });

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      var zeroLine = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(0); });

      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select(container_id)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

      // add the area
      svg.append("path")
         .data([data])
         .attr("class", "area")
         .attr("d", zeroArea)
         .transition()
           .duration(2000)
           .attr("d", area)

      // add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", zeroLine)
          .transition()
            .duration(2000)
            .attr("d", valueline)

      // add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y).ticks(5, 's'));

      // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Attendees");
    }

    function resize() {
      var s = d3.select(container_id);
      var parent = s.node().parentNode
      s = s.remove();
      d3.select(parent).append('svg').attr('id', container_id.substring(1))
      drawAreaGraph();
    }

    drawAreaGraph();

    window.addEventListener("resize", resize);
  });
}

createAreaGraph("Data/area-data.csv", '#area-chart')
