//Width and height
var w = 1280;
var h = 720;

var projection = d3.geoMercator()
                   .translate([w/2, h/2])
                   .scale(100)

//Define path generator, using the Albers USA projection
var path = d3.geoPath(projection)
       // .projection(d3.geoAlbersUsa());

//Create SVG element
var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

//Load in GeoJSON data
d3.json("https://unpkg.com/world-atlas@1/world/110m.json").then( function(json) {

  //Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
     .data(topojson.feature(json, json.objects.countries).features)
     .enter()
     .append("path")
     .attr("d", path);

});
