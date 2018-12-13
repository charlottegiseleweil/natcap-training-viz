function createGraph(path, container_id, graph_id) {
  d3.csv(path, (d, i, columns) => {
    return {
      values: columns.slice(1).map(k => +d[k]),
      name: d[""]
    };
  }).then(d => {
    let data = {
      Year: d.columns.slice(1),
      Intro: d[0].values,
      Intermediate: d[1].values,
      Advanced: d[2].values
    };

    function drawGraph(class_data) {
      var transformedData = class_data.Year.map((Year, index) => ({
        Year,
        Intro: class_data.Intro[index],
        Intermediate: class_data.Intermediate[index],
        Advanced: class_data.Advanced[index]
      }));

      const marginStackChart = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };

      size = d3
        .select(container_id)
        .node()
        .getBoundingClientRect();

      width = size.width;
      height = size.height;

      const widthStackChart =
        width - marginStackChart.left - marginStackChart.right - 60;
      const heightStackChart =
        height - marginStackChart.top - marginStackChart.bottom;

      const xStackChart = d3
        .scaleBand()
        .range([0, widthStackChart])
        .padding(0.1);

      const yStackChart = d3.scaleLinear().range([heightStackChart, 0]);

      const colorStackChart = d3.scaleOrdinal([
        "#222E50",
        "#007991",
        "#439A86"
      ]);

      var canvasStackChart = d3
        .select(container_id)
        .append("svg")
        .attr("id", graph_id)
        .attr(
          "width",
          widthStackChart + marginStackChart.left + marginStackChart.right + 90
        )
        .attr(
          "height",
          heightStackChart + marginStackChart.top + marginStackChart.bottom
        )
        .append("g")
        .attr(
          "transform",
          "translate(" +
            marginStackChart.left +
            "," +
            marginStackChart.top +
            ")"
        );

      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "toolTip");

      colorStackChart.domain(
        d3.keys(transformedData[0]).filter(function(key) {
          return key !== "Year";
        })
      );

      transformedData.forEach(function(d) {
        var y0 = 0;
        d.ages = colorStackChart.domain().map(function(name) {
          return {
            name: name,
            y0: y0,
            y1: (y0 += +d[name])
          };
        });
        d.total = d.ages[d.ages.length - 1].y1;
      });

      xStackChart.domain(
        transformedData.map(function(d) {
          return d.Year;
        })
      );

      yStackChart.domain([
        0,
        d3.max(transformedData, function(d) {
          return d.total;
        })
      ]);

      canvasStackChart
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightStackChart + ")")
        .call(d3.axisBottom(xStackChart));

      canvasStackChart
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yStackChart))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

      var state = canvasStackChart
        .selectAll(".Year")
        .data(transformedData)
        .enter()
        .append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
          return "translate(" + xStackChart(d.Year) + ",0)";
        });

      state
        .selectAll("rect")
        .data(function(d) {
          return d.ages;
        })
        .enter()
        .append("rect")
        .attr("width", xStackChart.bandwidth())
        .attr("y", function(d) {
          return yStackChart(d.y1);
        })
        .attr("height", function(d) {
          return yStackChart(d.y0) - yStackChart(d.y1);
        })
        .on("mouseover", function(d) {
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 40 + "px")
            .style("display", "inline-block")
            .html((d.y1 - d.y0).toFixed(0));
          d3.select(this)
            .attr("r", 10)
            .style("fill", "#26a69a");
        })
        .on("mouseout", function(d) {
          tooltip.style("display", "none");
          d3.select(this)
            .attr("r", 5.5)
            .style("fill", colorStackChart(d.name));
        })
        .style("fill", function(d) {
          return colorStackChart(d.name);
        });

      var legend = canvasStackChart
        .selectAll(".legend")
        .data(
          colorStackChart
            .domain()
            .slice()
            .reverse()
        )
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("x", widthStackChart + 75)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorStackChart);

      legend
        .append("text")
        .attr("x", widthStackChart + 70)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .text(function(d) {
          return d;
        });
    }

    function resize() {
      var s = d3.select("#" + graph_id);
      s = s.remove();
      drawGraph(data);
    }

    drawGraph(data);
    console.log(path);
    console.log(container_id);
    console.log(graph_id);

    window.addEventListener("resize", resize);
  });
}

createGraph("Data/class-levels-all-time.csv", "#barGraph", "barGraph-svg");
createGraph("Data/class-levels-all-time.csv", "#barGraph2", "barGraph-svg2");
