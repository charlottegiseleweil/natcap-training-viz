function createGraph_bar(
  path,
  container_id,
  graph_id,
  type,
  country = "WORLD",
  year = "Total"
) {
  d3.csv(path, (d, i, columns) => {
    if (type !== 1) {
      return {
        d
      };
    } else {
      return {
        values: columns.slice(1).map(k => +d[k]),
        name: d[""]
      };
    }
  }).then(d => {
    let data = {};

    if (type !== 1) {
      if (year == "Total") {
        var filtered_data = d.filter(function(x) {
          return x.d.Country == country && x.d.Year == year;
        });

        data = {
          Year: ["2013", "2014", "2015", "2016", "2017", "2018"],
          Intro: [],
          Nodal: [],
          Partner: [],
          Public: [],
          Regional: [],
          Seminar: [],
          Symposium: [],
          Webinar: []
        };

        for (var i = 0; i < data.Year.length; i++) {
          var filtered_data = d.filter(function(x) {
            return x.d.Country == country && x.d.Year == data.Year[i];
          });

          if (filtered_data == []) {
            return;
          }

          data.Intro.push(filtered_data[0].d.Count);
          data.Nodal.push(filtered_data[1].d.Count);
          data.Partner.push(filtered_data[2].d.Count);
          data.Public.push(filtered_data[3].d.Count);
          data.Regional.push(filtered_data[4].d.Count);
          data.Seminar.push(filtered_data[5].d.Count);
          data.Symposium.push(filtered_data[6].d.Count);
          data.Webinar.push(filtered_data[7].d.Count);
        }
      } else {
        var filtered_data = d.filter(function(x) {
          return x.d.Country == country && x.d.Year == year;
        });

        years = [];
        values = [];
        for (var i = 0; i < filtered_data.length; i++) {
          years.push(filtered_data[i].d.Type);
          values.push(parseInt(filtered_data[i].d.Count));
        }

        data = {
          Year: years,
          Trainees: values
        };
      }
    } else {
      data = {
        Year: d.columns.slice(1),
        Symposium: d[1].values,
        Other: d[0].values
      };
    }

    if (type === 2) {
      var filtered_data = d.filter(function(x) {
        return x.d.Country == country && x.d.Year == year;
      });

      years = [];
      values = [];
      for (var i = filtered_data.length - 1; i >= 0; i--) {
        years.push(filtered_data[i].d.Type);
        values.push(parseInt(filtered_data[i].d.Count));
      }

      data = {
        Year: years,
        Trainees: values
      };
    }

    function drawGraph(class_data, type, country, year) {
      var transformedData = {};

      if (year == "Total") {
        if (type === 0) {
          transformedData = class_data.Year.map((Year, index) => ({
            Year,
            Intro: class_data.Intro[index],
            Nodal: class_data.Nodal[index],
            Partner: class_data.Partner[index],
            Public: class_data.Public[index],
            Regional: class_data.Regional[index],
            Seminar: class_data.Seminar[index],
            Symposium: class_data.Symposium[index],
            Webinar: class_data.Webinar[index]
          }));
        } else {
          transformedData = class_data.Year.map((Year, index) => ({
            Year,
            Symposium: class_data.Symposium[index],
            Other: class_data.Other[index]
          }));
        }
      } else {
        transformedData = class_data.Year.map((Year, index) => ({
          Year,
          Trainees: class_data.Trainees[index]
        }));
      }

      if (type === 2) {
        transformedData = class_data.Year.map((Year, index) => ({
          Year,
          Trainees: class_data.Trainees[index]
        }));
      }

      const marginStackChart = {
        top: 10,
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

      var widthStackChart = 0;

      if (year == "Total") {
        widthStackChart =
          width - marginStackChart.left - marginStackChart.right - 60;
      } else {
        widthStackChart =
          width - marginStackChart.left - marginStackChart.right - 20;
      }

      const heightStackChart =
        height - marginStackChart.top - marginStackChart.bottom;

      const xStackChart = d3
        .scaleBand()
        .range([0, widthStackChart])
        .padding(0.1);

      const yStackChart = d3.scaleLinear().range([heightStackChart, 0]);

      const colorStackChart = d3.scaleOrdinal(
        // [
        //   "#225ea8",
        //   "#41b6c4",
        //   "#4daf4a",
        //   "#984ea3",
        //   "#ff7f00",
        //   "#5B86E5",
        //   "#e41a1c",
        //   "#f781bf"
        // ]
        [
          "#1f78b4",
          "#a6cee3",
          "#b2df8a",
          "#33a02c",
          "#fb9a99",
          "#e31a1c",
          "#fdbf6f",
          "#ff7f00"
        ]
        // [
        //   "#1f78b4",
        //   "#a6cee3",
        //   "#b2df8a",-
        //   "#33a02c",
        //   "#fb9a99",
        //   "#e31a1c",
        //   "#fdbf6f",-
        //   "#ff7f00"
        // ]
        // [
        //   "#ffffd9",
        //   "#081d58",
        //   "#007991", -
        //   "#5B86E5",
        //   "#7fcdbb",
        //   "#225ea8",
        //   "#000046",
        //   "#253494",
        //   "#41b6c4"
        // ] //.reverse()
      );

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
            .style("fill", "#e7298a");
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
          colorStackChart.domain().slice()
          // .reverse()
        )
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
        });

      var variable = 30;
      if (year === "Total") {
        variable = 60;
      }

      legend
        .append("rect")
        .attr("x", widthStackChart + variable + 5)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorStackChart);

      legend
        .append("text")
        .attr("x", widthStackChart + variable)
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
      drawGraph(data, type, country, year);
    }

    drawGraph(data, type, country, year);

    window.addEventListener("resize", resize);
  });
}

createGraph_bar("Data/Type_Stats.csv", "#barGraph-type", "barGraph-svg", 0);

createGraph_bar(
  "Data/symposium-vs-rest.csv",
  "#barGraph-symposium",
  "barGraph-svg3",
  1
);
