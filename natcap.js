let defaultYear = 2018

let rowConverter = (d) => {
  return {
    country: d.Country,
    year: +d.Year,
    trainees: +d.Number_of_Participants
  }
}

let dataset = {}

// Initialize map without colors
map = new Datamap({
    element: document.getElementById('container1'),
    projection: 'mercator', // big world map
    responsive: true,
    // countries don't listed in dataset will be painted with this color
    fills: { defaultFill: '#F5F5F5' },
    data: dataset,
    geographyConfig: {
        borderColor: 'darkgray',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
            // If country is not in the data it means there are no trainees there
            if (!data) { return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Trainees: <strong>', 0, '</strong>',
                '</div>'].join(''); }
            // tooltip content
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Trainees: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');
        }
    }
});

// Color according to the deafult year
changeYear(defaultYear)

function changeYear(year) {
  d3.csv("Data/processed_Data.csv", rowConverter, (data) => {
    data = data.filter(obj => obj.year == year && obj.trainees > 0)

    // Datamaps expect data in format:
    let dataset = {};

    // Create color palette (by scaling min/max series-value to a colormap)
    var onlyValues = data.map(function(obj){ return obj.trainees; });
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

    var paletteScale = d3.scale.log()
            .domain([minValue,maxValue])
            .range(["#EFEFFF","#02386F"]); // blue color

    // Manual color mapping for weird distributions
    // var t = d3.scale.threshold().domain([0, 0.5, 1]).range(['a', 'b', 'c', 'd']);
    // console.log(t(-0.1))
    // console.log(t(0.3))
    // console.log(t(0.8))
    // console.log(t(1.3))

    // Fill dataset in appropriate format
    data.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item.country,
                value = item.trainees;
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

    map.updateChoropleth(dataset)
  });
}

var btnContainer = document.getElementById("years");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("year");
console.log(btnContainer)

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}

// For map responsiveness
window.addEventListener('resize', event => map.resize());
