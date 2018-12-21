function createGraph(path, id, byYears=false, country='WORLD', year='TOTAL') {
  d3.csv(path, (d, i, columns) => {
    return d
  }).then((d) => {

    var filtered_data = d.filter(function(x) {
      if(byYears) {
        return x.Year == year && x.Country == country
      }
      else {
        return x.Country == country
      }
    });

    df = {
      Year: ["2013", "2014", "2015", "2016", "2017", "2018"],
      Intro: [],
      Intermediate: [],
      Advanced: []
    };

    for (var i = 0; i < df.Year.length; i++) {
      var filtered_data = d.filter(function(x) {
        return x.Country == country && x.Year == df.Year[i];
      });

      if (filtered_data == []) {
        return;
      }

      df.Advanced.push(filtered_data[0].Count);
      df.Intermediate.push(filtered_data[1].Count);
      df.Intro.push(filtered_data[2].Count);
    }

    let data = {
      y: "Trainee*Days",
      series: [{name: 'Intro', values: df.Intro.map(k => +k)},
               {name: 'Intermediate', values: df.Intermediate.map(k => +k)},
               {name: 'Advanced', values: df.Advanced.map(k => +k)}],
      dates: df.Year.map(d3.timeParse("%Y"))
    }

    function drawGraphic() {

      size = d3.select(id).node().parentNode.getBoundingClientRect()

      width = size.width
      height = size.height

      margin = ({
        top: 15,
        right: 30,
        bottom: 20,
        left: 35
      })

      x = d3.scaleTime()
        .domain(d3.extent(data.dates))
        .range([margin.left, width - margin.right - 80])

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

      var ordinal = d3.scaleOrdinal()
        .domain(["Intro", "Intermediate", "Advanced"])
        .range([ "#66c2a5", "#fc8d62", "#e78ac3"]);

      svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(370,20)")
        .attr("transform", "translate(" + (width - margin.right - 60) + "," + 20 + ")")
        .attr('font-size', 11);

      var legendOrdinal = d3.legendColor()
        //d3 symbol creates a path-string, for example
        //"M0,-8.059274488676564L9.306048591020996,
        //8.059274488676564 -9.306048591020996,8.059274488676564Z"
        // .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
        // .shapePadding(10)
        //use cellFilter to hide the "e" cell
        // .orient('horizontal')
        // .labelAlign("end")
        .cellFilter(function(d){ return d.label !== "e" })
        .scale(ordinal);

      svg.select(".legendOrdinal")
        .call(legendOrdinal);

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

createGraph("Data/Level_Stats.csv", "#line-chart");
