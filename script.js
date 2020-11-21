let script = ["Show museums and galleries"];

if (annyang) {
  var commands = {
    // List the commands
    "list commands": function () {
      document.getElementById("outputTitle").innerHTML = "Commands";
      document.getElementById("output").innerHTML = "";
      // Create an unordered list element and add script as items
      let list = document.createElement("ul");
      document.getElementById("output").appendChild(list);
      script.forEach(function (cmd) {
        let item = document.createElement("li");
        list.appendChild(item);
        item.innerHTML += cmd;
      });
    },

    "show *type": function (type) {
      // Start by clearing map
      for (let i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof Microsoft.Maps.Pushpin) {
          map.entities.removeAt(i);
        }
      }

      // Museums and Galleries
      if (type.includes("museums") || type.includes("galleries")) {
        // Update Sidebar Title
        document.getElementById("outputTitle").innerHTML =
          "Museums and Galleries";
        document.getElementById("output").innerHTML = "";
        let list = document.createElement("ul");
        document.getElementById("output").appendChild(list);
        for (let i = 0; i < Museums_and_Galleries.features.length; i++) {
          // Add Location to Sidebar
          let item = document.createElement("li");
          list.appendChild(item);
          item.innerHTML += Museums_and_Galleries.features[i].properties.NAME;

          // Plot Location on Bing Maps
          map.entities.push(
            new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(
                Museums_and_Galleries.features[i].properties.LATITUDE,
                Museums_and_Galleries.features[i].properties.LONGITUDE
              ),
              { title: Museums_and_Galleries.features[i].properties.NAME }
            )
          );
        }
      }
    },

    "clear map": function () {
      document.getElementById("outputTitle").innerHTML = "Welcome to Hamilton";
      document.getElementById("output").innerHTML = "";
      for (let i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof Microsoft.Maps.Pushpin) {
          map.entities.removeAt(i);
        }
      }
    },

    // Search Bing Maps if not one of scripted commands
    "*catchall": function (catchall) {
      var requestOptions = {
        bounds: map.getBounds(),
        where: catchall,
        callback: function (answer, userData) {
          map.setView({ bounds: answer.results[0].bestView });
          map.entities.push(
            new Microsoft.Maps.Pushpin(answer.results[0].location, {
              title: catchall,
            })
          );
        },
      };
      searchManager.geocode(requestOptions);
    },
  };

  annyang.addCommands(commands);
  annyang.start({ autoRestart: true, continuous: true });
}

function loadmap() {
  // Create a map centered on Hamilton, Ontario
  map = new Microsoft.Maps.Map(document.getElementById("BingMap"), {
    center: new Microsoft.Maps.Location(43.2557, -79.8711),
    zoom: 13,
  });

  // Load the search manager that allows us to search for locations
  // (lat and long positions) based on an address, e.g. Toronto, Ontario
  Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
    searchManager = new Microsoft.Maps.Search.SearchManager(map);
  });
}

// Commands Button (Same as "list commands" above)
document.getElementById("commands").onclick = function () {
  document.getElementById("outputTitle").innerHTML = "Commands";
  document.getElementById("output").innerHTML = "";
  let list = document.createElement("ul");
  document.getElementById("output").appendChild(list);
  script.forEach(function (cmd) {
    let item = document.createElement("li");
    list.appendChild(item);
    item.innerHTML += cmd;
  });
};
