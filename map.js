$.when(
    $.getJSON("Data/data.json"),
    $.getJSON("Data/zeros.json")
).done(function(data1, data2) {
    data = data1[0]
    zeros = data2[0].Number_of_Participants

    var traineeData = data['Total'];

    $(function(){
      map = new jvm.Map({
        container: $('#world-map'),
        map: 'world_mill',

        backgroundColor: '#fff',
        borderColor: '#fff',
        borderOpacity: 0.25,
        borderWidth: 0,
        color: '#e6e6e6',

        regionStyle : {
          initial : {
            fill : '#e4ecef',
          },
          selected : {
            fill : '#cf8989'
          }
        },

        regionsSelectable: true,
        regionsSelectableOne: true,

        series: {
          regions: [{
            values: traineeData,
            min: 0,
            scale: ['#e4ecef', '#0071A4'],
            normalizeFunction: 'polynomial',
            legend: {
              horizontal: true,
              title: 'Number of Trainees',
              cssClass: 'legend'
            }
          }]
        },

        onRegionTipShow: function(e, el, code){
          if(map.series.regions[0].values[code]) {
            el.html(el.html()+' (Trainees: ' + map.series.regions[0].values[code] + ')');
          }
          else {
            el.html(el.html()+' (Trainees: 0)');
          }
        },

        onRegionSelected: function(e, code, isSelected, selectedRegions){
          if(isSelected) {
            // Make charts specific to this country
            console.log(code)
          }
        },

        onRegionClick: function(e, code){
          // Deselection by clicking again
          if(map.getSelectedRegions().includes(code)) {
            map.clearSelectedRegions()

            // Revert charts back to world
            console.log('WORLD')

            // Prevent reselection
            e.preventDefault()
          }
        },
      });
    });

    var val = 2018
    var handle = $( "#custom-handle" );

    $("#slider").slider({
      value: val,
      min: 2013,
      max: 2018,
      step: 1,
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      slide: function(event, ui) {
        val = ui.value;
        handle.text( val );
        // Reset all
        map.series.regions[0].setValues(zeros)
        // Paint the new ones
        map.series.regions[0].setValues(data[val])
      }
    });

    $( "input" ).checkboxradio({
      icon: false,
    });

    function handleToggle( e ) {
      var target = $( e.target );
      if (target.is( ":checked" )) {
        $( "#slider" ).toggle( "slide", {}, 500 );
        // $( "#slider" ).slider( "enable" );
        // $( "#checkbox-1" ).checkboxradio( "option", "label", "Total" );
        // TODO: Update Map and Charts
        // Reset all
        map.series.regions[0].setValues(zeros)
        // Paint the new ones
        map.series.regions[0].setValues(data[val])
      }
      else {
        // $( "#slider" ).slider( "disable" );
        $( "#slider" ).toggle( "slide", {}, 500 );
        // $( "#checkbox-1" ).checkboxradio( "option", "label", "Years" );
        // TODO: Update Map and Charts
        // Reset all
        map.series.regions[0].setValues(zeros)
        // Paint the new ones
        map.series.regions[0].setValues(data['Total'])
      }
    }

    $( "#slider" ).hide();

    $( "#checkbox-1" ).on( "change", handleToggle );
});
