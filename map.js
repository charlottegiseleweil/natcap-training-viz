$.getJSON("Data/data.json", function(data) {
  var traineeData = data.Number_of_Participants

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
          scale: ['#C8EEFF', '#0071A4'],
          normalizeFunction: 'polynomial',
          legend: {
            // horizontal: true,
            title: 'Number of Trainees',
            // cssClass: 'legend'
          }
        }]
      },

      onRegionTipShow: function(e, el, code){
        if(traineeData[code]) {
          el.html(el.html()+' (Trainees: '+traineeData[code]+')');
        }
        else {
          el.html(el.html()+' (Trainees: 0)');
        }
      },

      onRegionSelected: function(e, code, isSelected, selectedRegions){
        if(isSelected) {
          // TODO: Make charts specific to this country
          console.log(code)
        }
      },

      onRegionClick: function(e, code){
        // Deselection by clicking again
        if(map.getSelectedRegions().includes(code)) {
          map.clearSelectedRegions()

          // TODO: Revert charts back to world
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
    disabled: true,
    create: function() {
      handle.text( $( this ).slider( "value" ) );
    },
    slide: function(event, ui) {
      val = ui.value;
      console.log(val)
      handle.text( val );
      // TODO: Update Map and Charts
    }
  });

  $( "input" ).checkboxradio({
    icon: false,
  });

  function handleToggle( e ) {
    var target = $( e.target );
    if (target.is( ":checked" )) {
      $( "#slider" ).slider( "enable" );
      $( "#slider" ).show( "fade", {}, 500, callback );
      // TODO: Update Map and Charts
    }
    else {
      $( "#slider" ).slider( "disable" );
      $( "#slider:visible" ).removeAttr( "style" ).fadeOut();
      // TODO: Update Map and Charts
    }
  }

  function callback() {}
  $( "#slider" ).hide();

  $( "#checkbox-1" ).on( "change", handleToggle );
});
