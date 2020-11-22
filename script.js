let script = [
  "Show museums and galleries",
  "Show beaches",
  "Show universities",
  "Clear map",
];

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
      } else if (type.includes("beaches")) {
        // Beaches
        document.getElementById("outputTitle").innerHTML = "Beaches";
        document.getElementById("output").innerHTML = "";
        let list = document.createElement("ul");
        document.getElementById("output").appendChild(list);
        for (let i = 0; i < Beaches.features.length; i++) {
          let item = document.createElement("li");
          list.appendChild(item);
          item.innerHTML += Beaches.features[i].properties.NAME;

          map.entities.push(
            new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(
                Beaches.features[i].properties.LATITUDE,
                Beaches.features[i].properties.LONGITUDE
              ),
              { title: Beaches.features[i].properties.NAME }
            )
          );
        }
      } else if (type.includes("universities")) {
        // Universities
        document.getElementById("outputTitle").innerHTML = "Universities";
        document.getElementById("output").innerHTML = "";
        let list = document.createElement("ul");
        document.getElementById("output").appendChild(list);
        for (let i = 0; i < Educational_Institutions.features.length; i++) {
          // Skip if not a university
          if (
            Educational_Institutions.features[i].properties.CATEGORY !==
            "Post Secondary"
          ) {
            continue;
          }

          let item = document.createElement("li");
          list.appendChild(item);
          item.innerHTML +=
            Educational_Institutions.features[i].properties.NAME;

          map.entities.push(
            new Microsoft.Maps.Pushpin(
              new Microsoft.Maps.Location(
                Educational_Institutions.features[i].properties.LATITUDE,
                Educational_Institutions.features[i].properties.LONGITUDE
              ),
              { title: Educational_Institutions.features[i].properties.NAME }
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
