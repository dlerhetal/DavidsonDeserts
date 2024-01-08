// Link to base layer map
var streetmap = 
L.tileLayer('https://{s}.tile.openstreetMap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetMap.org/copyright">OpenStreetMap</a> contributors'
})

console.log("linked base layer map")

// Set the 3 layers
var layers = {
  censusTracts: new L.layerGroup(),
  desertTracts: new L.layerGroup(),
  groceryStores: new L.layerGroup()
};

// Name the 3 layers
var overlays = {
  "Census Tracts": layers.censusTracts,
  "Food Deserts": layers.desertTracts,
  "Grocery Stores": layers.groceryStores
};

// Set map conditions
var myMap = L.map("map", {
  center: [36.156470, -86.788350],
  zoom: 11,
  layers: [
    layers.censusTracts,
    layers.desertTracts,
    layers.groceryStores
  ]
});

// Add base layer map
streetmap.addTo(myMap);

console.log("added base layer map")

// Add 3 layers to the map.
L.control.layers(null, overlays).addTo(myMap);

// Name the data link for the census/desert tracts
var link = "data/map.geojson";

// Define the color palette
function chooseColor(Poverty) {
  if (Poverty == 0) return "#BFEFFF"; 
  else if (Poverty < 6) return "#66B3FF"; 
  else if (Poverty < 11) return "#3366FF"; 
  else if (Poverty < 16) return "#0000CC"; 
  else if (Poverty < 21) return "#000099"; 
  else if (Poverty < 26) return "#000066"; 
  else return "#330066"; 
}

// Name poverty legend
var legend = L.control({ position: 'bottomright' });

// Create poverty legend
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4 style="margin-bottom: 10px;">Poverty Rate <hr> &lt; $10K</h4>';
    var colors = ["#BFEFFF", "#66B3FF", "#3366FF", "#0000CC", "#000099", "#000066", "#330066"];
        labels = [];

    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            chooseColorLabel(colors[i]) + '<br>';
    }

    div.style.border = '2px solid #ccc';
    div.style.background = 'rgba(255, 255, 255, 0.8)';
    div.style.padding = '8px';
    return div;
};

// Add poverty legend
legend.addTo(myMap);
console.log("added legend")

// Add colors to the poverty legend
function chooseColorLabel(color) {

    var povertyRange = getPovertyRange(color);
    return '<span style="color: ' + color + ';">' + povertyRange + '</span>';
}

function getPovertyRange(color) {
  switch (color) {
      case "#BFEFFF":
          return "0%";
      case "#66B3FF":
          return "0% - 2%";
      case "#3366FF":
          return "2% - 4%";
      case "#0000CC":
          return "4% - 8%";
      case "#000099":
          return "8% - 13%";
      case "#000066":
          return "13% - 20%";
      case "#330066":
          return "20%+";
      default:
          return "";
  }
}

// Create census tract layers
d3.json(link).then(function(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.Poverty),
        fillOpacity: 0.5,
        weight: 3
      };
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });

      // Census tract popup content
      layer.bindPopup("<h1>" + "Census Tract: " + feature.properties.NAME_x + "</h1> <hr> <h2>" + "Poverty Rate: " + feature.properties.Poverty + "% " +
      "<br>" + "Households: " + feature.properties.Households.toLocaleString("en-US") + "<br>" + "Average Income: " + 
      feature.properties.Mean.toLocaleString("en-US") + "<br>" + "Food Desert: " + feature.properties.Desert + "</h2>");

    }
  // Add census tract layers to the map
  }).addTo(myMap);
});

console.log("added census tract colors")

// Link to grocery store data
fetch('data/grocery.json')
  .then(response => response.json())
  .then(grocery => {
    locations = grocery;
    console.log(locations); 
locations.forEach(function (location) {

    // The radius of the marker relates to the ratings of the grocery store
    var radius = 6; 
    if (location.rating >= 4.5) {
      radius = 12;
    } else if (location.rating >= 4) {
      radius = 10;
    } else if (location.rating >= 3.5) {
      radius = 8;
    } else if (location.rating >= 3) {
      radius = 6;
    } else if (location.rating >= 2) {
      radius = 4;
    } else {
      radius = 2;
    }
    // Create the grocery store markers
    var marker = L.circleMarker([location.latitude, location.longitude], {
      radius: radius, 
      fillColor: 'red',
      color: 'white',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

      // Grocery store popup content
      var popupContent = `<b>${location.name}</b><br>Address: ${location.address}<br>Rating: ${location.rating}`;
    marker.bindPopup(popupContent);
  
    // I THINK THIS IS WHAT WE NEED TO CHANGE FOR OUR LAYERING, BUT I DUNNO HOW!
    if (!layers[location.rating]) {
      layers[location.rating] = L.layerGroup().addTo(myMap);
    }
  
    layers[location.rating].addLayer(marker);
  });
  })
console.log("1:42p")
  