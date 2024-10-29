// Starting the map
let map = L.map("map").setView([20, 0], 2);

// tile layers 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetching the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  // Define function to get color based on depth
  function getColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#b8e186' :
                        '#66bd63';
  }

  // magnitude/radius function
  function getRadius(magnitude) {
    return magnitude * 4;
  }

  // markers function
  function createMarkers(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // GeoJSON layer
  L.geoJson(data, {
    pointToLayer: createMarkers
  }).addTo(map);

  // Create a legend
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');

    // legend tile layers 
    div.innerHTML += '<h4>Earthquake Depth</h4>';

    let grades = [0, 10, 30, 50, 70, 90];
    
    // color squares for legend
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<div style="display: flex; align-items: center; margin-bottom: 4px;">' +
          '<i style="width: 18px; height: 18px; background:' + getColor(grades[i] + 1) + '; display: inline-block; margin-right: 6px;"></i>' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+') +
        '</div>';
    }

    return div;
  };
  legend.addTo(map);
});

