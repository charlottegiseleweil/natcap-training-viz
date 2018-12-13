d3.csv("Data/chart-data.csv", (d, i, columns) => {
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
    size = d3.select('#line-chart').node().parentNode.getBoundingClientRect()

    width = size.width
    height = size.height

    margin = ({
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
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
    const svg = d3.select('#line-chart')
      .attr('height', height)
      .attr('width', width)

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.0)
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
          return 'red'
        case 'Webinar':
          return 'blue'
        case 'Symposium':
          return 'green'
        case 'Partner':
          return 'orange'
        case 'Regional':
          return 'maroon'
        case 'Nodal':
          return 'cyan'
        case 'Seminar':
          return 'purple'
        case 'Public':
          return 'black'
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

  var resizeTimer;
  window.onresize = function(event) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var s = d3.select('#line-chart');
      var parent = s.node().parentNode
      s = s.remove();
      // console.log(parent)
      d3.select(parent).append('svg').attr('id', 'line-chart')
      // d3.select("body").append("svg")
      drawGraphic();
    }, 50);
  }

  // function responsivefy(svg) {
  //   // get container + svg aspect ratio
  //   var container = d3.select(svg.node().parentNode),
  //       width = parseInt(svg.style("width")),
  //       height = parseInt(svg.style("height")),
  //       aspect = width / height;
  //
  //   // add viewBox and preserveAspectRatio properties,
  //   // and call resize so that svg resizes on inital page load
  //   svg.attr("viewBox", "0 0 " + width + " " + height)
  //       .attr("perserveAspectRatio", "xMinYMid")
  //       .call(resize);
  //
  //   // to register multiple listeners for same event type,
  //   // you need to add namespace, i.e., 'click.foo'
  //   // necessary if you call invoke this function for multiple svgs
  //   // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  //   d3.select(window).on("resize." + container.attr("id"), resize);
  //
  //   // get width of container and resize svg to fit it
  //   function resize() {
  //       var targetWidth = parseInt(container.style("width"));
  //       svg.attr("width", targetWidth);
  //       svg.attr("height", Math.round(targetWidth / aspect));
  //
  //       // x.range([margin.left, targetWidth - margin.right])
  //       // y.range([Math.round(targetWidth / aspect) - margin.bottom, margin.top])
  //       // svg.call(hover, path);
  //
  //   }
  // }
})
