// Welcome the user after they click the start button
document.getElementById("start").onclick = function()
{
  var synth = window.speechSynthesis;
  var utterText = "Welcome to Hamilton!";
  var utterThis = new SpeechSynthesisUtterance(utterText);
  utterThis.pitch = 1.0;
  utterThis.rate = 0.9;
  synth.speak(utterThis);
}

if (annyang) {

  // Commands are defined as keys and values in an object, the key is the 
  // text for the command, and the value is callback function (i.e. event 
  // handler) to call for the command
  var commands = {

    // If "information about X" is uttered, we show on the page "Here is some
    // information about X".  
    "information about *place" :
    function(place) 
    {
      document.getElementById("output").innerHTML = 
        "Here is some information about " + place;
    },

    // If "show firestations" or "show libraries" are uttered, the map will 
    // be populated with pushpins for firestations or libraries
    //
    // We use the firestations.js and libraries.js data above to do so, note 
    // that we know how to access the data structure be examining the data 
    // structure... so we can see for example that firestations.features 
    // contains an array of objects with firestation data, and we can see 
    // that firestations.features[i].properties contains latitude, longitude
    // and name data.  
    //
    // You could use a tool like this to help you visualize the data:
    //    http://jsonviewer.stack.hu/
    //
    "show *type": 
    function(type)
    {
      // if type includes "fire" we assume the user wants to see firestations
      if (type.includes("fire"))
      {
        // loop through the array of firestations in the firestations.js data
        for (i = 0; i < firestations.features.length; i++) 
        {
          // add a pushpin to the map for each firestation
          map.entities.push(
            new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(
                // use the latitude & longitude data for the pushpin position
                firestations.features[i].properties.LATITUDE,
                firestations.features[i].properties.LONGITUDE
              ),
              // use the firestation name for the label 
              {title: firestations.features[i].properties.NAME}
            ));
        }
      }
      // if type includes "libraries" we assume user wants to see libraries
      else if (type.includes("libraries"))
      {
        // loop through the array of libraries in the libraries.js data
        for (i = 0; i < libraries.features.length; i++) 
        {
          // add a pushpin to the map for each library
          map.entities.push(
            new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(
                // use the latitude & longitude data for the pushpin position
                libraries.features[i].properties.LATITUDE,
                libraries.features[i].properties.LONGITUDE
              ),
              // use the library name for the label 
              {title: libraries.features[i].properties.NAME}
            ));
        }
      }        
    },

    // If "clear map" is uttered all pushpins are removed from the map
    "clear map" :
    function()
    {
      // Code to remove all pushpins is taken directly from the API docs:
      // https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/deletepushpins
      for (i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof Microsoft.Maps.Pushpin) {
          map.entities.removeAt(i);
        }
      }
    },

    // Any other utterance will be caught by this case, and we use the 
    // Bing Maps geolocation service to find a latitude and longitude 
    // position based on the utterance:
    //  https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/searchbyaddress#JS
    // We then place a pushpin on the map at that location.
    //
    // So if we say "Dundas, Ontario" or "Toronto, Ontario" it will 
    // attempt to find the location and put a pushpin on the map there
    "*catchall" :
    function(catchall) 
    {
      var requestOptions = {
        bounds: map.getBounds(),
        where: catchall,
        callback: function (answer, userData) {
            map.setView({ bounds: answer.results[0].bestView });
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                answer.results[0].location,
                {title: catchall}
              )
            );
        }
      };
      searchManager.geocode(requestOptions);

    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start({ autoRestart: true, continuous: true });
}


// Loads the map, called after Bing map library finishes loading
function loadmap()
{
  // Create a map centered on Hamilton, Ontario
  map = new Microsoft.Maps.Map(document.getElementById("myMap"), 
    {
      center: new Microsoft.Maps.Location(43.2557, -79.8711),
      // we could set additional options when we create the map...
      // mapTypeId: Microsoft.Maps.MapTypeId.aerial,
      // zoom: 12        
    });

  // Load the search manager that allows us to search for locations 
  // (lat and long positions) based on an address, e.g. Toronto, Ontario
  Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
    searchManager = new Microsoft.Maps.Search.SearchManager(map);
  });
}