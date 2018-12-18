function createGraph(path, id, code='WORLD', year='TOTAL') {
  d3.csv(path, (d, i, columns) => {
    return {
      values: columns.slice(1).map(k => +d[k]),
      name: d['']
    }
  }).then((d) => {
    let data = {
      y: "Number of Trainees",
      series: d,
      dates: d.columns.slice(1).map(d3.timeParse("%Y"))
    }

    function drawGraphic() {
      size = d3.select(id).node().parentNode.getBoundingClientRect()

      width = size.width
      height = size.height

      margin = ({
        top: 10,
        right: 20,
        bottom: 20,
        left: 30
      })

      x = d3.scaleTime()
        .domain(d3.extent(data.dates))
        .range([margin.left, width - margin.right])

      y = d3.scaleLinear()
        .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
        .range([height - margin.bottom, margin.top])

      line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(data.dates[i]))
        .y(d => y(d))

      xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

      yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(data.y))

      // const svg = d3.select(DOM.svg(width, height));
      const svg = d3.select(id)
        .attr('height', height)
        .attr('width', width)

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      const path = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3.0)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(data.series)
        .enter().append("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.values))
        .attr("stroke", typecolors)

      svg.call(hover, path);
      // svg.call(responsivefy);

      function typecolors(d) {
        switch (d.name) {
          case 'Intro':
            return '#66c2a5'
          case 'Intermediate':
            return '#fc8d62'
          case 'Symposium':
            return '#8da0cb'
          case 'Advanced':
            return '#e78ac3'
          case 'Regional':
            return '#a6d854'
          case 'Nodal':
            return '#ffd92f'
          case 'Seminar':
            return '#e5c494'
          case 'Public':
            return '#b3b3b3'
        }
      }

      function hover(svg, path) {
        svg
          .style("position", "relative");

        if ("ontouchstart" in document) svg
          .style("-webkit-tap-highlight-color", "transparent")
          .on("touchmove", moved)
          .on("touchstart", entered)
          .on("touchend", left)
        else svg
          .on("mousemove", moved)
          .on("mouseenter", entered)
          .on("mouseleave", left);

        const dot = svg.append("g")
          .attr("display", "none");

        dot.append("circle")
          .attr("r", 2.5);

        dot.append("text")
          .style("font", "10px sans-serif")
          .attr("text-anchor", "middle")
          .attr("y", -8);

        function moved() {
          d3.event.preventDefault();
          const ym = y.invert(d3.event.layerY);
          const xm = x.invert(d3.event.layerX);
          const i1 = d3.bisectLeft(data.dates, xm, 1);
          const i0 = i1 - 1;
          const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
          const s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
          path.attr("stroke", d => d === s ? typecolors(d) : "#ddd").filter(d => d === s).raise();
          dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
          dot.select("text").text(s.name);
        }

        function entered() {
          path.style("mix-blend-mode", null).attr("stroke", "#ddd");
          dot.attr("display", null);
        }

        function left() {
          path.style("mix-blend-mode", "multiply").attr("stroke", typecolors);
          dot.attr("display", "none");
        }
      }
    }

    drawGraphic()

    function resize() {
      var s = d3.select(id);
      var parent = s.node().parentNode
      s = s.remove();
      d3.select(parent).append('svg').attr('id', id.substring(1))
      drawGraphic();
    }

    window.addEventListener("resize", resize);
  })
}

createGraph("Data/chart-data-copy.csv", "#line-chart");
// createGraph("Data/chart-data.csv", "#line-chart-2");
