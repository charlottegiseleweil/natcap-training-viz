var currentCountry = "WORLD";
var currentYear = "Total";

$.when($.getJSON("Data/data.json"), $.getJSON("Data/zeros.json")).done(function(
  data1,
  data2
) {
  data = data1[0];
  zeros = data2[0].Number_of_Participants;

  var traineeData = data["Total"];

  $(function() {
    map = new jvm.Map({
      container: $("#world-map"),
      map: "world_mill",

      backgroundColor: "#fff",
      borderColor: "#fff",
      borderOpacity: 0.25,
      borderWidth: 0,
      color: "#e6e6e6",

      regionStyle: {
        initial: {
          fill: "#e4ecef"
        },
        selected: {
          fill: "#cf8989"
        }
      },

      regionsSelectable: true,
      regionsSelectableOne: true,

      series: {
        regions: [
          {
            values: traineeData,
            min: 0,
            scale: ["#e4ecef", "#0071A4"],
            normalizeFunction: "polynomial",
            legend: {
              horizontal: true,
              title: "Number of Trainees",
              cssClass: "legend"
            }
          }
        ]
      },

      onRegionTipShow: function(e, el, code) {
        if (map.series.regions[0].values[code]) {
          el.html(
            el.html() +
              " (Trainees: " +
              map.series.regions[0].values[code] +
              ")"
          );
        } else {
          el.html(el.html() + " (Trainees: 0)");
        }
      },

      onRegionSelected: function(e, code, isSelected, selectedRegions) {
        if (isSelected) {
          // Make charts specific to this country
          // console.log(code);
          currentCountry = code;

          var s = d3.select("#barGraph-svg");
          s = s.remove();
          createGraph_bar(
            "Data/Type_Stats.csv",
            "#barGraph-type",
            "barGraph-svg",
            0,
            currentCountry,
            "" + currentYear
          );

          if (currentYear == "Total") {
            var s = d3.select("#line-chart");
            var parent = s.node().parentNode;
            s = s.remove();
            d3.select(parent)
              .append("svg")
              .attr("id", "line-chart");
            createGraph(
              "Data/Level_Stats.csv",
              "#line-chart",
              false,
              currentCountry,
              "" + currentYear
            );
          } else {
            var s = d3.select("#barGraph-svg2");
            s = s.remove();
            createGraph_bar(
              "Data/Level_Stats.csv",
              "#types",
              "barGraph-svg2",
              2,
              currentCountry,
              "" + currentYear
            );
          }
        }
      },

      onRegionClick: function(e, code) {
        // Deselection by clicking again
        if (map.getSelectedRegions().includes(code)) {
          map.clearSelectedRegions();

          // Revert charts back to world
          // console.log("WORLD");
          currentCountry = "WORLD";

          var s = d3.select("#barGraph-svg");
          s = s.remove();
          createGraph_bar(
            "Data/Type_Stats.csv",
            "#barGraph-type",
            "barGraph-svg",
            0,
            currentCountry,
            "" + currentYear
          );

          if (currentYear == "Total") {
            var s = d3.select("#line-chart");
            var parent = s.node().parentNode;
            s = s.remove();
            d3.select(parent)
              .append("svg")
              .attr("id", "line-chart");
            createGraph(
              "Data/Level_Stats.csv",
              "#line-chart",
              false,
              currentCountry,
              "" + currentYear
            );
          } else {
            var s = d3.select("#barGraph-svg2");
            s = s.remove();
            createGraph_bar(
              "Data/Level_Stats.csv",
              "#types",
              "barGraph-svg2",
              2,
              currentCountry,
              "" + currentYear
            );
          }

          // Prevent reselection
          e.preventDefault();
        }
      }
    });
  });
});

d3.selectAll(".range-field").classed("hidden", true);
d3.selectAll("#current-year").classed("hidden", true);
var latestYear = 2018;

function totalOrYears(checked) {
  if (checked) {
    currentYear = latestYear;
    d3.selectAll(".range-field").classed("hidden", false);
    d3.selectAll("#current-year").classed("hidden", false);
    // Reset all
    map.series.regions[0].setValues(zeros);
    // Paint the new ones
    map.series.regions[0].setValues(data[latestYear]);
    // Update level chart
    var s = d3.select("#line-chart");
    var parent = s.node().parentNode;
    s = s.remove();
    createGraph_bar(
      "Data/Level_Stats.csv",
      "#types",
      "barGraph-svg2",
      2,
      currentCountry,
      "" + currentYear
    );
    // d3.select(parent).append('svg').attr('id', 'line-chart')
    // createGraph("Data/Level_Stats.csv", "#line-chart", false, currentCountry, "" + currentYear);
  } else {
    currentYear = "Total";
    d3.selectAll(".range-field").classed("hidden", true);
    d3.selectAll("#current-year").classed("hidden", true);
    // Reset all
    map.series.regions[0].setValues(zeros);
    // Paint the new ones
    map.series.regions[0].setValues(data["Total"]);
    // Update level chart
    var s = d3.select("#barGraph-svg2");
    var parent = s.node().parentNode;
    s = s.remove();
    d3.select(parent)
      .append("svg")
      .attr("id", "line-chart");
    createGraph(
      "Data/Level_Stats.csv",
      "#line-chart",
      false,
      currentCountry,
      "" + currentYear
    );
  }

  var s = d3.select("#barGraph-svg");
  s = s.remove();
  createGraph_bar(
    "Data/Type_Stats.csv",
    "#barGraph-type",
    "barGraph-svg",
    0,
    currentCountry,
    "" + currentYear
  );
}

function yearChanged(val) {
  latestYear = val;
  currentYear = val;
  // Reset all
  map.series.regions[0].setValues(zeros);
  // Paint the new ones
  map.series.regions[0].setValues(data[val]);
  // Change text
  d3.select("#current-year").text(val);

  var s = d3.select("#barGraph-svg");
  s = s.remove();
  createGraph_bar(
    "Data/Type_Stats.csv",
    "#barGraph-type",
    "barGraph-svg",
    0,
    currentCountry,
    "" + currentYear
  );

  var s = d3.select("#barGraph-svg2");
  s = s.remove();
  createGraph_bar(
    "Data/Level_Stats.csv",
    "#types",
    "barGraph-svg2",
    2,
    currentCountry,
    "" + currentYear
  );
}

$(document).ready(function() {
  $("ul.tabs").tabs({
    // swipeable : true,
  });
});
