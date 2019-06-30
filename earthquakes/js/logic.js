// Define a function that will give each point a different radius based on earthquake magnitude
function markerSize(magnitude) {
  if (magnitude < 0) {
    return 1;    
  }
  return magnitude * 4;
}

// Define a function that will give each point a different color based on earthquake magnitude
function getColor(d) {
  return d > 5 ? 'hsl(15, 100%, 50%)' :
         d > 4  ? 'hsl(30, 100%, 50%)' :
         d > 3  ? 'hsl(45, 100%, 50%)' :
         d > 2  ? 'hsl(60, 100%, 50%)' :
         d > 1   ? 'hsl(75, 100%, 50%)' :
         d > 0   ? 'hsl(90, 100%, 50%)' :
                   'hsl(0, 100%, 50%)';
}

var faultLines = [];
// Grab faultLines data with d3
d3.json("./json/PB2002_boundaries.json", function(bdata) {
    // Creating a GeoJSON layer with the retrieved data
    faultLines = L.geoJson(bdata);
  });
  
// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab earthquakes data with d3
d3.json(APILink, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define a function to run once for each feature in the features array
function createFeatures(earthquakeData) {
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.title + "<hr>" + new Date(feature.properties.time) + " | Depth: " + feature.geometry.coordinates[2] + " km");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {radius: markerSize(feature.properties.mag), 
                    fillColor: getColor(feature.properties.mag), 
                    color: "#000", 
                    opacity: 0.3, 
                    fillOpacity: 0.8});
    },
    onEachFeature: onEachFeature
  });

  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
};

function createMap(earthquakes) {
  // Define light layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.light",
          accessToken: API_KEY
        });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.satellite",
          accessToken: API_KEY
        });

  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.outdoors",
          accessToken: API_KEY
        });
     
   // Define a baseMaps object to hold our base layers
   var baseMaps = {
        "Satellite": satellite,
        "GrayScale": lightmap,
        "Outdoors" : outdoors
      };

   // Create overlay object to hold our overlay layer
   var overlayMaps = {
        "Fault Lines" : faultLines,  
        "Earthquakes": earthquakes
      };

  // Create map objet
  var myMap = L.map("map", {
          center: [35.4828833,-97.7593954],
          zoom: 5,
          layers: [satellite, earthquakes, faultLines]
        });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

  // Create a legend to display information about our map
  var info = L.control({
        position: "bottomright"
      });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };
  
  // Add the info legend to the map
  info.addTo(myMap);

  // Present the legend
  addLegend();

};

// Add the legend's innerHTML 
function addLegend() {
  document.querySelector(".legend").innerHTML = [
    "<div>Magnitude</div>",
    "<ul><li class=\"zero\"></li>",
    "<li class=\"one\"></li>",
    "<li class=\"two\"></li>",
    "<li class=\"three\"></li>",
    "<li class=\"four\"></li>",
    "<li class=\"five\"></li></ul>",
    "<hr><div class=\"flines\">&nbsp; Fault lines</div>"
  ].join("");
}
