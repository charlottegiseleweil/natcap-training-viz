var format = function(d) {
    d = d / 1000000;
    return d3.format(',.02f')(d) + 'M';
}

var map = d3.geomap.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2010')
    .format(format)
    .legend(true)
    .unitId('iso3');

d3.csv('sp.pop.totl.csv', function(error, data) {
    console.log(data)
    var selection = d3.select('#map').datum(data);
    map.draw(selection);
});
