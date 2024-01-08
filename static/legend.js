// Create a legend control
var legend = L.control({ position: 'bottomright' });
// Add legend to the Map
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'rgba(211,211,211,0.9)';
    div.innerHTML += '<h4 style="margin-bottom: 14px; font-weight: bold;">Poverty Rate <hr> &lt; $10K</h4>';
    var colors = ["#BFEFFF", "#66B3FF", "#3366FF", "#0000CC", "#000099", "#000066", "#330066"];
    labels = [];

    // Loop through colors and generate a label with the corresponding poverty rate range
    for (var i = 0; i < colors.length; i++) {
      div.innerHTML +=
      '<i class="legend-icon" style="background:' + colors[i] + '"></i> ' +
      '<span style="font-weight: bold; color: black;">' + chooseColorLabel(colors[i]) + '</span><br>';
}

    // Add styling to the legend
    div.style.border = '7px solid blue';
    div.style.padding = '8px';
    div.style.fontSize = '16px';
    return div;
};
// Add legend to the Map
legend.addTo(myMap);
// Function to get legend labels based on color
function chooseColorLabel(color) {
    // Extract the poverty rate range from the color function
    var povertyRange = getPovertyRange(color);
    return '<span style="color: ' + color + ';">' + povertyRange + '</span>';
}
// Function to get poverty rate range based on color
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